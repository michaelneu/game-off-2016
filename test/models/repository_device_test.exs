defmodule Gameoff.RepositoryDeviceTest do
  use Gameoff.ModelCase

  alias Gameoff.RepositoryDevice

  @valid_attrs %{repository_id: 0, device_id: 0}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = RepositoryDevice.changeset(%RepositoryDevice{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = RepositoryDevice.changeset(%RepositoryDevice{}, @invalid_attrs)
    refute changeset.valid?
  end
end
