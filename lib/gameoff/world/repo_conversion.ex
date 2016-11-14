defmodule Gameoff.World.RepoConversion do
  alias Gameoff.Repository

  @fork_count_weight 2
  @star_cont_weight 1

  @doc"""
  Pulls all required repository information from github.
  Returns a map Gameoff.Repository with the data parsed into it.
  """
  def pull_repo_from_github(data_source, client , owner_name, repo_name) do
    repo_details = data_source.get_repo_details(client, owner_name, repo_name)

    star_count = repo_details["stargazers_count"]
    forks_count = repo_details["forks_count"]
    rank = star_count * @star_cont_weight + forks_count * @fork_count_weight
    github_id = repo_details["id"]

    structure = get_repo_structure(data_source, client, owner_name, repo_name, "")

    %Repository{level: rank, name: "#{owner_name}/#{repo_name}", repo_structure: structure, github_id: github_id}
  end

  # Returns the structure (file tree) of an github repository by queriieng the github api.
  defp get_repo_structure(data_source, client, owner_name, repo_name, path) do
    children = data_source.get_repo_content(client, owner_name, repo_name, path)
                |> Enum.map(fn(element) ->
                    get_file_structure(data_source, client, owner_name, repo_name, element)
                  end)
                |> Enum.filter(fn(element) ->
                    element != nil
                  end)
                |> Enum.map(fn(element) ->
                    {element.name, element}
                  end)
                |> Map.new

    name = path |> String.split("/") |> List.last() || ""

    %{type: :dir, name: name, size: 0, children: children}
  end

  # Returns the file Structure of an github content element.
  # For file elements this simply means converting them to the internal representation.
  # For directories an api request will be made to optain their sub-files.
  defp get_file_structure(_, _, _, _, %{"type" => "file", "name" => name, "size" => size}) do
    %{type: :file, name: name, size: size, children: %{}}
  end
  defp get_file_structure(data_source, client, owner_name, repo_name, %{"type" => "dir", "name" => name, "sha" => sha, "path" => path}) do
    recursive_children = data_source.get_recursive_tree(client, owner_name, repo_name, sha)

    if recursive_children["truncated"] do
      get_repo_structure(data_source, client, owner_name, repo_name, path)
    else
      dir = %{type: :dir, name: name, size: 0, children: %{}}

      recursive_children["tree"]
      |> Enum.map(fn(element) -> Map.update(element, "path", "", fn(value) -> String.split(value, "/") end) end)
      |> Enum.reduce(dir, fn(element, acc) -> insert_element_to_tree(element, acc) end)
    end
  end
  defp get_file_structure(_, _, _, _, _) do
    nil
  end

  # Inserts an github tree element (file or directory) into an given directory.
  # Returns the updated directory (now containing the new file).
  defp insert_element_to_tree(%{"type" => "blob", "path" => [name], "size" => size}, dir) do
    # We found a file, insert it directly
    child_file = %{type: :file, name: name, size: size, children: %{}}
    Map.update(dir, :children, %{}, fn(children) -> Map.put(children, name, child_file) end)
  end
  defp insert_element_to_tree(%{"type" => "blob", "path" => [dir_name | rest]} = new_element, dir) do
    # Find the correct child dir
    child_dir = Map.get(dir.children, dir_name) || %{type: :dir, name: dir_name, children: %{}}

    # Update it by inserting the file inte the child dir
    new_child = insert_element_to_tree(Map.put(new_element, "path", rest), child_dir)
    Map.update(dir, :children, %{}, fn(children) -> Map.put(children, dir_name, new_child) end)
  end
  defp insert_element_to_tree(_, dir) do
    # Ignore directory nodes, they will be implicitly created by inserting files (as there ar no empty folders)
    dir
  end

end
