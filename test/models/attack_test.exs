defmodule Gameoff.AttackTest do
  use Gameoff.ModelCase

  alias Gameoff.Attack

  @valid_attrs %{attack_intensity: 42, battery_intensity: 42, command_name: "some content", computing_influence: "120.5", description: "some content", network_influence: "120.5", properties: %{}, social_engineering_influence: "120.5", storage_influence: "120.5"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Attack.changeset(%Attack{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Attack.changeset(%Attack{}, @invalid_attrs)
    refute changeset.valid?
  end
end
