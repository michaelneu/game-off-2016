defmodule Gameoff.RepoConversionTest do
  use ExUnit.Case, async: true

  defmodule GithubStubDataSource do
    @behaviour Gameoff.World.GithubDataSource

    def get_client(github_token) do
      %{access_token: github_token}
    end

    def get_repo_list(_, _) do
      nil
    end

    def get_repo_details(%{access_token: _token}, "michaelneu", "game-off-2016") do
      File.read!("test/world/get_repo.json") |> Poison.decode!
    end
    def get_repo_details(_, _, _) do
      nil
    end

    def get_repo_content(%{access_token: _token}, "michaelneu", "game-off-2016", "") do
      File.read!("test/world/get_contents.json") |> Poison.decode!
    end
    def get_repo_content(_, _, _, _) do
      nil
    end

    def get_recursive_tree(%{access_token: _token}, "michaelneu", "game-off-2016", "a6b00925130b7b734fb254604cdc555572616e93") do
      File.read!("test/world/get_a6b00925130b7b734fb254604cdc555572616e93.json") |> Poison.decode!
    end
    def get_recursive_tree(_, _, _, _) do
      nil
    end
  end

  test "parsing repository from github" do
    data_source = GithubStubDataSource
    client = data_source.get_client("abc")

    repo = Gameoff.World.RepoConversion.pull_repo_from_github(data_source, client , "michaelneu", "game-off-2016")

    root = repo.repo_structure
    children = root.children
    gitignore = children[{:file, ".gitignore"}]

    assert 72574554 = repo.github_id

    assert ".gitignore" = gitignore.name
    assert 492 = gitignore.size
    assert :file = gitignore.type

    config = children[{:dir, "config"}]
    assert "config" = config.name
    assert :dir = config.type

    simple_nested = config.children[{:file, "dev.exs"}]
    assert "dev.exs" = simple_nested.name
    assert 1388 = simple_nested.size

    sub_dir = config.children[{:dir, "sub"}]
    assert "sub" = sub_dir.name

    complex_nested = sub_dir.children[{:file, "file.ex"}]
    assert "file.ex" = complex_nested.name
  end
end
