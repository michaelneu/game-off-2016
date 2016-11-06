defmodule Gameoff.User do
  use Gameoff.Web, :model

  schema "users" do
    field :name, :string
    field :github_uid, :string

    has_many :user_devices, Gameoff.UserDevice
    has_many :devices, through: [:user_devices, :device]

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :github_uid])
    |> validate_required([:name, :github_uid])
  end
end
