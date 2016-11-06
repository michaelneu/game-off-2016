defmodule Gameoff.Attack do
  use Gameoff.Web, :model

  @valid_params ~w(command_name description properties battery_intensity attack_intensity network_influence
                    computing_influence social_engineering_influence storage_influence)a
  @required_params ~w(command_name battery_intensity attack_intensity network_influence
                      computing_influence social_engineering_influence storage_influence)a

  schema "attacks" do
    field :command_name, :string
    field :description, :string, default: "no description"
    field :properties, :map, default: %{}
    field :battery_intensity, :integer, default: 0
    field :attack_intensity, :integer, default: 0
    field :network_influence, :float, default: 0.0
    field :computing_influence, :float, default: 0.0
    field :social_engineering_influence, :float, default: 0.0
    field :storage_influence, :float, default: 0.0

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
