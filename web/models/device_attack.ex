defmodule Gameoff.DeviceAttack do
  use Gameoff.Web, :model

  schema "device_attacks" do
    field :options, :map, default: %{}
    belongs_to :device, Gameoff.Device
    belongs_to :attack, Gameoff.Attack

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:options])
    |> validate_required([])
  end
end
