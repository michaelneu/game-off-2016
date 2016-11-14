defmodule Gameoff.RepositoryDevice do
  use Gameoff.Web, :model

  @valid_params ~w(repository_id device_id)a
  @required_params ~w(repository_id device_id)a

  schema "repository_devices" do
    belongs_to :repository, Gameoff.Repository
    belongs_to :device, Gameoff.Device

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
