defmodule HelloPhoenix.RepoChannel do
  use Phoenix.Channel
  require Logger

  def join("repo:lobby", _message, socket) do
    {:ok, socket}
  end
  def join("repo:" <> _repo_name, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end
  def terminate(_message, _socket) do
    Logger.debug "SOMEBODY TERMINATED"
  end
end