defmodule Gameoff.WorldChannelTest do
  use Gameoff.ChannelCase
  alias Gameoff.UserSocket

  alias Gameoff.Repository
  import Gameoff.Factory

  @player_view_window 25

  setup do
    default_user = insert(:user)
    {:ok, jwt, _} = Guardian.encode_and_sign(default_user)

    {:ok, default_socket} = connect(UserSocket, %{"guardian_token" => "#{jwt}"})
    {:ok, _, socket} = subscribe_and_join(default_socket, "world:lobby", %{})

    {:ok, socket: socket, user: default_user}
  end

  test "get_world on empty world returs empty world", %{socket: socket, user: _user} do
    ref = push socket, "get_world", %{}
    assert_reply ref, :ok, %{repos: [], position: %{x: 30, y: 30}}
  end

  test "get_world returs repositories in player window", %{socket: socket, user: _user} do
    insert(:repository)
    insert(:repository)
    insert(:repository)

    # TODO: Add player position
    position_x = 30
    position_y = 30

    query = from r in Repository,
            where: r.location_x < ^(position_x + @player_view_window),
            where: r.location_x > ^(position_x - @player_view_window),
            where: r.location_y < ^(position_y + @player_view_window),
            where: r.location_y > ^(position_y - @player_view_window)
    repos = Repo.all(query) |> Enum.map(&Repository.user_json/1)

    ref = push socket, "get_world", %{}
    assert_reply ref, :ok, %{repos: ^repos, position: %{x: 30, y: 30}}

  end

  test "get_world returs no repositories outside player window", %{socket: socket, user: _user} do
    insert(:repository)
    insert(:repository)
    insert(:repository)
    insert(:repository, %{location_x: 100})

    # TODO: Add player position
    position_x = 30
    position_y = 30

    query = from r in Repository,
            where: r.location_x < ^(position_x + @player_view_window),
            where: r.location_x > ^(position_x - @player_view_window),
            where: r.location_y < ^(position_y + @player_view_window),
            where: r.location_y > ^(position_y - @player_view_window)
    repos = Repo.all(query) |> Enum.map(&Repository.user_json/1)

    ref = push socket, "get_world", %{}
    assert_reply ref, :ok, %{repos: ^repos, position: %{x: 30, y: 30}}

  end

end
