defmodule Gameoff.WorldSection do
  use Gameoff.Web, :model

  schema "world_sections" do
    field :location_x, :integer
    field :location_y, :integer
    field :properties, :map

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:location_x, :location_y, :properties])
    |> validate_required([:location_x, :location_y, :properties])
  end
end
