defmodule Gameoff.Factory do
  use ExMachina.Ecto, repo: Gameoff.Repo

  alias Gameoff.User
  alias Gameoff.Repository

  def user_factory do
    %User{
      name: "Bob Belcher",
      github_uid: sequence("github_uid"),
    }
  end

  def repository_factory do
    %Repository{
      name: "#{sequence("user")}/#{sequence("repo")}",
      level: round(:rand.uniform() * 100),
      location_x: round(:rand.uniform() * 50),
      location_y: round(:rand.uniform() * 50),
      repo_structure: %{},
      github_id: elem(Integer.parse(sequence("")), 0),
      owner: build(:user)
    }
  end
end
