defmodule Gameoff.Repository do
  use Gameoff.Web, :model

  @valid_params ~w(level name location_x location_y repo_structure github_id)a
  @required_params ~w(level name repo_structure github_id)a

  schema "repositories" do
    field :level, :integer
    field :name, :string
    field :location_x, :integer
    field :location_y, :integer
    field :repo_structure, :map
    field :github_id, :integer

    belongs_to :owner, Gameoff.User
    belongs_to :protection_device, Gameoff.Device

    has_many :repository_devices, Gameoff.RepositoryDevice
    has_many :devices, through: [:repository_devices, :device]

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @valid_params)
    |> validate_required(@required_params)
    |> unique_constraint(:unique_location, name: "unique_repo_location")
  end
end
