defmodule Gameoff.UserDevice do
  use Gameoff.Web, :model

  @valid_params ~w(device_id user_id count)a
  @required_params ~w()a

  schema "user_devices" do
    field :count, :integer, default: 0
    belongs_to :user, Gameoff.User
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
