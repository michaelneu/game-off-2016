defmodule Gameoff.World.WorldLoader do
  use GenServer

  import Ecto.Query, only: [from: 2]
  require Logger
  alias Gameoff.Repo
  alias Gameoff.Repository
  alias Gameoff.WorldSection
  alias Gameoff.World.DiamondSquare

  # The world loader will try to extend the world every x milliseconds (if needed)
  @scheudle_interval 1000 * 15
  # If there are less not coptured repos then this number the world loader will expand the world
  @minimum_free_repos 50


  # The number of free repos that will be inserted (not necessory positioned in the world)
  @repo_insert_count 250
  # The size of one world section/tile
  @world_section_size 65 # 2^6 + 1
  # The number of trieals to insert new
  @world_section_insert_tries 150

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
    repos_to_insert = @repo_insert_count - Repo.one(query)

    # Seed in some repos to place in the world
    insert_repos_to_db(repos_to_insert, data_source, api_client)

    # Find in what 'section' of the word the new tiles should go
    {orientation, x, y} = new_pos = new_world_section_position()

    # Get the new world tiles corner values
    new_corners = find_corners(new_pos)

    strength_distribution =
      DiamondSquare.generate_map(@world_section_size, new_corners.strength_corners.bottom_left,
                                                      new_corners.strength_corners.top_left,
                                                      new_corners.strength_corners.top_right,
                                                      new_corners.strength_corners.bottom_right, &rand_function/1)
    population_distribution =
      DiamondSquare.generate_map(@world_section_size, new_corners.population_corners.bottom_left,
                                                      new_corners.population_corners.top_left,
                                                      new_corners.population_corners.top_right,
                                                      new_corners.population_corners.bottom_right, &rand_function/1)

    new_world_section = %WorldSection{location_x: x, location_y: y, properties: new_corners}

    case Repo.insert(WorldSection.changeset(new_world_section)) do
      {:ok, _} ->
        # TODO: Spread repos on the new world section
        1..@world_section_insert_tries
        |> Enum.each(fn(_) ->
            target_x = round(@world_section_size * :rand.uniform() - 1)
            target_y = round(@world_section_size * :rand.uniform() - 1)

            if population_distribution[{target_x, target_y}] >= :rand.uniform() do
              total_avaliable = Repo.one(query) - 1
              target = round(total_avaliable * (strength_distribution[{target_x, target_y}] || 0))

              repo_query = from r in Repository,
                            where: is_nil(r.location_x),
                            order_by: [asc: r.level],
                            offset: ^target,
                            limit: 1
              repo = Repo.one(repo_query)

              if repo != nil do
                Repo.update(Repository.changeset(repo, %{location_x: target_x, location_y: target_y}))
              end
            end
        end)
      {:error, error} ->
        Logger.error(error)
    end
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

    existing_square_edge = round(Float.floor(:math.sqrt(existing_sections)))
    existing_sections_in_square = existing_square_edge * existing_square_edge

    existing_sections_in_unfinished = existing_sections - existing_sections_in_square

    IO.puts("existing_sections: #{existing_sections}, existing_square_edge: #{existing_square_edge}, existing_sections_in_square: #{existing_sections_in_square}, existing_sections_in_unfinished: #{existing_sections_in_unfinished}")

    if existing_sections_in_unfinished < existing_square_edge do
      # New position is on right edge
      {:right, @world_section_size * existing_square_edge, @world_section_size * existing_sections_in_unfinished}
    else
      top_position = existing_sections_in_unfinished - existing_square_edge

      # New position is on top edge
      {:top, @world_section_size * top_position, @world_section_size * existing_square_edge}
    end
  end

  defp find_corners({:top, 0, 0}) do
    # Special case, first tile
    strength_corners = %{bottom_left: :rand.uniform(), bottom_right: :rand.uniform(),
                         top_left: :rand.uniform(), top_right: :rand.uniform}
    population_corners = %{bottom_left: :rand.uniform(), bottom_right: :rand.uniform(),
                           top_left: :rand.uniform(), top_right: :rand.uniform}

    %{strength_corners: strength_corners,
      population_corners: population_corners}
  end
  defp find_corners(input = {:top, x, y}) do
    IO.inspect("first: #{inspect(input)}")
    neighbour = Repo.get_by(WorldSection, %{location_x: x, location_y: (y-@world_section_size)})
    neighbour_properties = neighbour.properties

    strength_corners = %{bottom_left: neighbour_properties["strength_corners"]["top_left"], bottom_right: neighbour_properties["strength_corners"]["top_right"],
                         top_left: :rand.uniform(), top_right: :rand.uniform}
    population_corners = %{bottom_left: neighbour_properties["strength_corners"]["top_left"], bottom_right: neighbour_properties["strength_corners"]["top_right"],
                           top_left: :rand.uniform(), top_right: :rand.uniform}

    %{strength_corners: strength_corners,
      population_corners: population_corners}
  end
  defp find_corners(input = {:right, x, y}) do
    IO.inspect("second: #{inspect(input)}")
    IO.inspect(%{location_x: (x-@world_section_size), location_y: y})
    neighbour = Repo.get_by(WorldSection, %{location_x: (x-@world_section_size), location_y: y})
    neighbour_properties = neighbour.properties

    strength_corners = %{bottom_left: neighbour_properties["strength_corners"]["bottom_right"], bottom_right: :rand.uniform,
                         top_left: neighbour_properties["strength_corners"]["top_right"], top_right: :rand.uniform}
    population_corners = %{bottom_left: neighbour_properties["population_corners"]["bottom_right"], bottom_right: :random.uniform,
                           top_left: neighbour_properties["population_corners"]["top_right"], top_right: :random.uniform}

    %{strength_corners: strength_corners,
      population_corners: population_corners}
  end

  def rand_function(previous) do
    res = previous - 0.5 + :rand.uniform()

    case res do
      res when res < 0 ->
        0
      res when res > 1 ->
        1
      res ->
        res
    end
  end
end
