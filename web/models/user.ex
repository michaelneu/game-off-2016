defmodule Gameoff.User do
  use Gameoff.Web, :model

  schema "users" do
    field :name, :string
    field :github_uid, :string
    field :location_x, :integer
    field :location_y, :integer

    has_many :user_devices, Gameoff.UserDevice
    has_many :devices, through: [:user_devices, :device]

    belongs_to :current_repository, Gameoff.Repository

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :github_uid, :current_repository_id, :location_x, :location_y])
    |> cast_assoc(:current_repository)
    |> validate_required([:name, :github_uid])
  end
end
