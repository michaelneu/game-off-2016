defmodule Gameoff.RepoChannel do
  use Phoenix.Channel
  require Logger

  alias Gameoff.Repository
  alias Gameoff.Repo
  alias Gameoff.User

  intercept ["user"]

  def join("repo:" <> repo_name, _params, socket) do
    repository = Repo.get_by(Repository, name: repo_name)
    if repository do
      # Register the users current repository in the socket assigns and the db
      socket = socket
                |> assign(:repo, repository.name)
                |> assign(:current_path, [])
                |> assign(:repo_state, :crawling)
      user = Guardian.Phoenix.Socket.current_resource(socket) |> Repo.preload(:current_repository)

      changeset = User.changeset(user, %{current_repository_id: repository.id})
      Repo.update(changeset) # We really do not care if we fail to save this

      # Spin up a repo if it does not already exist
      Gameoff.Repository.RepositorySupervisor.start_repository(repository)
      Gameoff.Repository.Repository.player_joined(user)

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

  def handle_in("cd", %{target_path: path}, socket = %{current_path: _current_path}) do
    path_parts = String.split(path, "/")

    # TODO: Add 'proper' path movemen (see what dirs the  users is going through)
  end

  def handle_out("user", payload, socket) do
    push socket, "user", payload
    {:noreply, socket}
  end

  def terminate(_message, socket) do
      user = Guardian.Phoenix.Socket.current_resource(socket) |> Repo.preload(:current_repository)

      changeset = User.changeset(user, %{current_repository_id: nil})
      Repo.update(changeset)
  end
end
