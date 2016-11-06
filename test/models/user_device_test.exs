defmodule Gameoff.UserDeviceTest do
  use Gameoff.ModelCase

  alias Gameoff.UserDevice

  @valid_attrs %{count: 42}

  test "changeset with valid attributes" do
    changeset = UserDevice.changeset(%UserDevice{}, @valid_attrs)
    assert changeset.valid?
  end
end
