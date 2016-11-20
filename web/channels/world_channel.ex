defmodule Gameoff.WorldChannel do
  use Phoenix.Channel
  require Logger

  alias Gameoff.Repository
  alias Gameoff.Repo
  import Ecto.Query, only: [from: 2]

  @player_view_window 25

  def join("world:lobby", _message, socket) do
    {:ok, socket}
  end

  def handle_in("get_world", _message, socket) do
    # TODO: Add position to user
    position_x = 30
    position_y = 30

    query = from r in Repository,
            where: r.location_x < ^(position_x + @player_view_window),
            where: r.location_x > ^(position_x - @player_view_window),
            where: r.location_y < ^(position_y + @player_view_window),
            where: r.location_y > ^(position_y - @player_view_window)
    repos = Repo.all(query) |> Enum.map(&Repository.world_json/1)
    reply = %{repos: repos, position: %{x: position_x, y: position_y}}

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
end
