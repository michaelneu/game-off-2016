defmodule Gameoff.RepoChannelTest do
  use Gameoff.ChannelCase
  alias Gameoff.UserSocket

  import Gameoff.Factory

  setup do
    default_user = insert(:user)
    {:ok, jwt, _} = Guardian.encode_and_sign(default_user)

    {:ok, default_socket} = connect(UserSocket, %{"guardian_token" => "#{jwt}"})

    {:ok, socket: default_socket, user: default_user}
  end

  test "socket authenticate with valid token" do
    user = insert(:user)
    {:ok, jwt, _} = Guardian.encode_and_sign(user)

    assert {:ok, _socket} = connect(UserSocket, %{"guardian_token" => "#{jwt}"})
  end

  test "socket authenticate with invalid token" do
    assert :error = connect(UserSocket, %{"guardian_token" => "12345"})
    assert :error = connect(UserSocket, %{})
  end

  test "join lobby with authenticated user", %{socket: socket} do
    assert {:ok, _, _} = subscribe_and_join(socket, "repo:lobby", %{})
  end

  test "get current user name", %{socket: socket, user: user} do
    assert {:ok, _, socket} = subscribe_and_join(socket, "repo:lobby", %{})

    ref = push socket, "user", %{}
    response_user = %{name: user.name}
    assert_reply ref, :ok, ^response_user
  end

end