defmodule Gameoff.RepositoryTest do
  use Gameoff.ModelCase

  alias Gameoff.Repository

  @valid_attrs %{level: 42, location_x: 42, location_y: 42, name: "some content", repo_structure: %{}}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Repository.changeset(%Repository{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Repository.changeset(%Repository{}, @invalid_attrs)
    refute changeset.valid?
  end
end
