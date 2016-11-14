defmodule Gameoff.Device do
  use Gameoff.Web, :model

  @valid_params ~w(name description properties battery network_power computing_power social_engineering_power storage_power)a
  @required_params ~w(name battery network_power computing_power social_engineering_power storage_power)a

  schema "devices" do
    field :name, :string
    field :description, :string, default: "no description"
    field :properties, :map, default: %{}
    field :battery, :integer, default: 1
    field :network_power, :float, default: 0.0
    field :computing_power, :float, default: 0.0
    field :social_engineering_power, :float, default: 0.0
    field :storage_power, :float, default: 0.0

    has_many :device_attacks, Gameoff.DeviceAttack
    has_many :attacks, through: [:device_attacks, :attack]

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @valid_params)
    |> validate_required(@required_params)
  end
end
