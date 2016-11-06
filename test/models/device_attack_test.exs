defmodule Gameoff.DeviceAttackTest do
  use Gameoff.ModelCase

  alias Gameoff.DeviceAttack

  @valid_attrs %{options: %{}}

  test "changeset with valid attributes" do
    changeset = DeviceAttack.changeset(%DeviceAttack{}, @valid_attrs)
    assert changeset.valid?
  end
end
