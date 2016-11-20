defmodule Gameoff.UserTest do
  use Gameoff.ModelCase

  alias Gameoff.User

  @valid_attrs %{github_uid: "some content", name: "some content", location_x: 10, location_y: 15}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = User.changeset(%User{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = User.changeset(%User{}, @invalid_attrs)
    refute changeset.valid?
  end
end
