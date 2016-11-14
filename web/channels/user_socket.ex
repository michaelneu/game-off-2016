defmodule Gameoff.UserSocket do
  use Phoenix.Socket
  use Guardian.Phoenix.Socket

  ## Channels
  channel "repo:*", Gameoff.RepoChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket,
      timeout: 45_000
  # transport :longpoll, Phoenix.Transports.LongPoll

  def connect(_params, socket) do
    :error
  end

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "users_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     Gameoff.Endpoint.broadcast("users_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  def id(_socket), do: nil
end
