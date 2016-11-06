defmodule Gameoff.Factory do
  use ExMachina.Ecto, repo: Gameoff.Repo

  alias Gameoff.User

  def user_factory do
    %User{
      name: "Bob Belcher",
      github_uid: sequence("github_uid"),
    }
  end
end