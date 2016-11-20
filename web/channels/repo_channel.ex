defmodule Gameoff.RepoChannel do
  use Phoenix.Channel
  require Logger

  alias Gameoff.Repository
  alias Gameoff.Repo
  alias Gameoff.User


  def join("repo:" <> repo_name, _params, socket) do
    repository = Repo.get_by(Repository, name: repo_name)
    if repository do
      socket = socket
                |> assign(:repo, repository.name)
                |> assign(:position, [])
      user = Guardian.Phoenix.Socket.current_resource(socket) |> Repo.preload(:current_repository)

      changeset = User.changeset(user, %{current_repository_id: repository.id})
      Repo.update(changeset)

      # TODO: Kick users from all other repos and the world channel
      reply = %{repository: Repository.repo_json(repository)}
      {:ok, {:ok, reply}, socket}
    else
      reply = %{message: "Could not find repository!"}
      {:error, reply}
    end
  end

  def handle_in("user", _message, socket) do
    user = Guardian.Phoenix.Socket.current_resource(socket)
    user_reply = %{
      name: user.name
    }
    {:reply, {:ok, user_reply}, socket}
  end

  intercept ["user"]
  def handle_out("user", payload, socket) do
    push socket, "user", payload
    {:noreply, socket}
  end

  def terminate(_message, _socket) do
    Logger.debug "SOMEBODY TERMINATED"
  end
end
