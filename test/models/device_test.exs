defmodule Gameoff.DeviceTest do
  use Gameoff.ModelCase

  alias Gameoff.Device

  @valid_attrs %{battery: 42, computing_power: "120.5", description: "some content", name: "some content", network_power: "120.5", properties: %{}, social_engineering_power: "120.5", storage_power: "120.5"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Device.changeset(%Device{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Device.changeset(%Device{}, @invalid_attrs)
    refute changeset.valid?
  end
end
