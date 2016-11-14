defmodule Gameoff.World.GithubApiDataSource do
  @moduledoc"""
  Wrapper for the github tentacat api library.
  The wrapper is used to allow easy insertion of an stub when testing.
  """

  @behaviour Gameoff.World.GithubDataSource

  def get_client(github_token) do
    Tentacat.Client.new(%{access_token: github_token})
  end

  def get_repo_list(client, since) do
    Tentacat.Repositories.list_public(client, [since: since])
  end

  def get_repo_details(client, owner_name, repo_name) do
    Tentacat.Repositories.repo_get(owner_name, repo_name, client)
  end

  def get_repo_content(client, owner_name, repo_name, path) do
    Tentacat.Contents.find(owner_name, repo_name, path, client)
  end

  def get_recursive_tree(client, owner_name, repo_name, file_sha) do
    Tentacat.Trees.find_recursive(owner_name, repo_name, file_sha, client)
  end
end
