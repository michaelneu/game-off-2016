defmodule Gameoff.World.GithubDataSource do
  @moduledoc"""
  Behaviour for fetching data from github.
  Used to injeckt an api stub for tests.
  """

  # The api client instance, wont do detailed type defs for sipmlicity.
  @type client :: any

  # Returns the githup api result for all public clients.
  # Uses since for pagination (see github api).
  @callback get_repo_list(client, number) :: [any]

  # Returns the repo details of a given repo.
  # Repos are identified by owner_name and repo_name.
  @callback get_repo_details(client, String.t, String.t) :: any

  # Returns the repo content of a given repo.
  # Repos are identified by owner_name and repo_name and an path.
  @callback get_repo_content(client, String.t, String.t, String.t) :: any

  # Returns the recursive tree of a given file in a repo.
  # Repos are identified by owner_name and repo_name.
  # Files are identified by their sha (see github api).
  @callback get_recursive_tree(client, String.t, String.t, String.t) :: any
end
