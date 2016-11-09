defmodule Gameoff.World.WorldLoader do
  use GenServer

  import Ecto.Query, only: [from: 2]
  alias Gameoff.Repo
  alias Gameoff.Repository

  # The world loader will try to extend the world every x milliseconds (if needed)
  @scheudle_interval 1000 * 60 * 5
  # If there are less not coptured repos then this number the world loader will expand the world
  @minimum_free_repos 50

  def start_link do
    GenServer.start_link(__MODULE__, %{})
  end

  def init(state) do
    schedule_work(@scheudle_interval)
    {:ok, state}
  end

  def handle_info(:work, state) do
    query = from r in "repositories",
            where: is_nil(r.owner),
            select: count(r.id)

    free_repos = Repo.all(query)

    if free_repos < @minimum_free_repos do
      insert_repos

      # Immideatly re schedule in case there are still not enough repos
      schedule_work(0)
    else
      schedule_work(@scheudle_interval)
    end

    {:noreply, state}
  end

  defp schedule_work(wait_time) do
    Process.send_after(self(), :extend_world, wait_time)
  end

  # Inserts new repos until there are enough in the
  defp insert_repos do
    # TODO: mock data source for testing. Will do this if there is time in the end.
    data_source = Gameoff.World.GithubApiDataSource
    api_client = data_source.get_client(Application.get_env(:gameoff, :github_api_token))

    # TODO: Insert repos
  end
end
