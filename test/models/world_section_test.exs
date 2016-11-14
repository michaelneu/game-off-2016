defmodule Gameoff.WorldSectionTest do
  use Gameoff.ModelCase

  alias Gameoff.WorldSection

  @valid_attrs %{location_x: 42, location_y: 42, properties: %{}}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = WorldSection.changeset(%WorldSection{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = WorldSection.changeset(%WorldSection{}, @invalid_attrs)
    refute changeset.valid?
  end
end
