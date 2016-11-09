defmodule Gameoff.World.WorldLoader do
  use GenServer

  import Ecto.Query, only: [from: 2]
  require Logger
  alias Gameoff.Repo
  alias Gameoff.Repository

  # The world loader will try to extend the world every x milliseconds (if needed)
  @scheudle_interval 1000 * 500000
  # If there are less not coptured repos then this number the world loader will expand the world
  @minimum_free_repos 5
  # The number of free repos that will be present after the insertion
  @repo_insert_count 10

  @world_section_size 50

  def start_link do
    GenServer.start_link(__MODULE__, %{})
  end

  def init(state) do
    schedule_work(@scheudle_interval)
    {:ok, state}
  end

  def handle_info(:extend_world, state) do
    query = from r in "repositories",
            where: not(is_nil(r.location_x)) and is_nil(r.owner_id),
            select: count(r.id)

    free_repos = Repo.one(query)
    Logger.info("Found #{free_repos} free repositories...")

    if free_repos < @minimum_free_repos do
      Logger.info("Try to insert new repos...")

      # Insert at least enough repos to have minimum free repos again (and best a few more)
      insert_repos()

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
  defp insert_repos() do
    # TODO: mock data source for testing. Will do this if there is time in the end.
    data_source = Gameoff.World.GithubApiDataSource
    api_client = data_source.get_client(Application.get_env(:gameoff, :github_api_token))

    query = from r in "repositories",
            where: is_nil(r.location_x),
            select: count(r.id)
    repos_to_insert = Repo.one(query)

    # Seed in some repos to place in the world
    insert_repos_to_db(repos_to_insert, data_source, api_client)

    # Find in what 'section' of the word the new tiles should go
    new_pos = new_world_section_position()

    # Get the new world tiles corner values
    new_corners = find_corners(new_pos)

    # TODO: Spread repos on the new world section
  end

  defp insert_repos_to_db(new_repos, data_source, api_client) do
    query = from r in "repositories",
            order_by: :github_id,
            select: r.github_id,
            limit: 1

    most_recent_repo = Repo.one(query) || 0

    data_source.get_repo_list(api_client, most_recent_repo)
    |> Enum.take(new_repos)
    |> Enum.each(fn(repo) ->
        name = String.split(repo["full_name"], "/")

        Gameoff.World.RepoConversion.pull_repo_from_github(data_source, api_client , Enum.at(name, 0), Enum.at(name, 1))
        |> Repository.changeset(%{})
        |> Repo.insert
      end)
  end

  defp new_world_section_position() do
    query = from w in "world_sections",
            select: count(w.id)
    existing_sections = Repo.one(query)

    existing_square_edge = Float.floor(:math.sqrt(existing_sections))
    existing_sections_in_square = existing_square_edge * existing_square_edge

    existing_sections_in_unfinished = existing_sections - existing_square_edge

    if existing_sections_in_unfinished < existing_square_edge do
      # New position is on right edge
      {:right, @world_section_size * existing_square_edge, @world_section_size * existing_sections_in_unfinished}
    else
      top_position = existing_sections_in_unfinished - existing_square_edge

      # New position is on top edge
      {:top, @world_section_size * top_position, @world_section_size * existing_square_edge}
    end
  end

  defp find_corners(new_pos) do
    # TODO: Refactor to function clauses
    case new_pos do
      {:top, 0, 0} ->
        # Special case, first tile
        strength_corners = %{bottom_left: :rand.uniform(), bottom_right: :rand.uniform(),
                              top_left: :rand.uniform(), top_right: :rand.uniform}
        population_corners = %{bottom_left: :rand.uniform(), bottom_right: :rand.uniform(),
                              top_left: :rand.uniform(), top_right: :rand.uniform}

        %{strength_corners: strength_corners,
          population_corners: population_corners}
      {:top, x, y} ->
        neighbour = Repo.get_by(Repository, %{location_x: x, location_y: (y-1)})
        neighbour_properties = neighbour.properties

        strength_corners = %{bottom_left: neighbour_properties.strength_corners.top_left, bottom_right: neighbour_properties.strength_corners.top_left,
                              top_left: :rand.uniform(), top_right: :rand.uniform}
        population_corners = %{bottom_left: neighbour_properties.population_corners.top_left, bottom_right: neighbour_properties.population_corners.strength_corners.top_left,
                              top_left: :rand.uniform(), top_right: :rand.uniform}

        %{strength_corners: strength_corners,
          population_corners: population_corners}
      {:rigt, x, y} ->
        neighbour = Repo.get_by(Repository, %{location_x: (x-1), location_y: y})
        neighbour_properties = neighbour.properties

        strength_corners = %{bottom_left: neighbour_properties.strength_corners.bottom_right, bottom_right: :rand.uniform,
                              top_left: neighbour_properties.strength_corners.top_right, top_right: :rand.uniform}
        population_corners = %{bottom_left: neighbour_properties.strength_corners.bottom_right, bottom_right: :random.uniform,
                                top_left: neighbour_properties.strength_corners.top_right, top_right: :random.uniform}

        %{strength_corners: strength_corners,
          population_corners: population_corners}
    end
  end
end
