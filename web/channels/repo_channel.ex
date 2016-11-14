defmodule Gameoff.RepoChannel do
  use Phoenix.Channel
  require Logger

  def join("repo:lobby", _message, socket) do
    {:ok, socket}
  end
  def join("repo:" <> _repo_name, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("user", _message, socket) do
    user = Guardian.Phoenix.Socket.current_resource(socket)
    user_reply = %{
      name: user.name
    }
    {:reply, {:ok, user_reply}, socket}
  end

  def handle_out("user", payload, socket) do
    push socket, "user", payload
    {:noreply, socket}
  end

  def terminate(_message, _socket) do
    Logger.debug "SOMEBODY TERMINATED"
  end
end