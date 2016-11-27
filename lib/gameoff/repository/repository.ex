defmodule Gameoff.Repository.Repository do
  use GenServer
  require Logger

  def start_link(repository) do
    GenServer.start_link(__MODULE__, initial_state(repository), name: via_tuple(repository.name))
  end

  ######################################
  # Public API
  ######################################
  def player_joined(repo_name, player) do
    GenServer.cast(via_tuple(repo_name), {:player_joined, player})
  end
  def player_left(repo_name, player) do
    GenServer.cast(via_tuple(repo_name), {:player_left, player})
  end

  ######################################
  # Actual Game Logic
  ######################################
  def handle_cast({:player_joined, player}, _from, state) do
    new_state = Map.update(state, :players, %{}, fn(players) ->
                  Map.put(players,player.player.github_uid, %{player: player, position: []})
                end)

    Logger.info "Player '#{player.name}' joined repo '#{state.name}'"

    {:noreply, new_state}
  end

  def handle_cast({:player_left, player}, _from, state) do
    new_state = Map.update(state, :players, %{}, fn(players) ->
                  Map.pop(players,player.player.github_uid)
                end)

    Logger.info "Player '#{player.name}' left repo '#{state.name}'"

    {:noreply, new_state}
  end

  def handle_call({:cd, target_path}, _from, state) do
    # TODO: Add player movement
    {:reply, {}, state}
  end


  ######################################
  # House Keeping functions / Helpers
  ######################################

  defp initial_state(repository) do
    %{
      players: %{},
      structure: repository.repo_structure,
      enemies_left: repository.level,
      name: repository.name
    }
  end

  defp via_tuple(repo_name) do
    {:via, :gproc, {:n, :l, {:repository, repo_name}}}
  end
end
