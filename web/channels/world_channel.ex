defmodule Gameoff.WorldChannel do
  use Phoenix.Channel
  require Logger

  alias Gameoff.Repository
  alias Gameoff.User
  alias Gameoff.Repo
  import Ecto.Query, only: [from: 2]

  @player_view_window 25

  def join("world:lobby", _message, socket) do
    socket = assign(socket, :repo, nil)
    user = Guardian.Phoenix.Socket.current_resource(socket) |> Repo.preload(:current_repository)

    changeset = User.changeset(user, %{current_repository_id: nil})
    Repo.update(changeset)

    {:ok, socket}
  end

  def handle_in("get_world", _message, socket) do
    user = Guardian.Phoenix.Socket.current_resource(socket) |> Repo.preload(:current_repository)

    user =
      if user.location_x == nil do
        init_user_position(user)
      else
        user
      end


    location_x = user.location_x
    location_y = user.location_y

    query = from r in Repository,
            where: r.location_x < ^(location_x + @player_view_window),
            where: r.location_x > ^(location_x - @player_view_window),
            where: r.location_y < ^(location_y + @player_view_window),
            where: r.location_y > ^(location_y - @player_view_window)
    repos = Repo.all(query) |> Enum.map(&Repository.world_json/1)
    reply = %{repos: repos, position: %{x: location_x, y: location_y}}

    {:reply, {:ok, reply}, socket}
  end

  intercept ["get_world"]
  def handle_out("get_world", payload, socket) do
    push socket, "get_world", payload
    {:noreply, socket}
  end

  def terminate(_message, _socket) do
    Logger.debug "SOMEBODY TERMINATED"
  end

  defp init_user_position(user) do
    query = from r in Repository,
            where: is_nil(r.owner_id),
            order_by: [asc: r.level],
            limit: 1

    repo = Repo.one(query)

    changeset = User.changeset(user, %{location_x: repo.location_x, location_y: repo.location_y})
    case Repo.update(changeset) do
      {:ok, user} ->
        user
    end
  end
end
