defmodule Gameoff.AuthController do
  @moduledoc """
  Auth controller responsible for handling Ueberauth responses.
  Supports only browser based auth.
  """

  use Gameoff.Web, :controller
  plug Ueberauth

  require Logger

  alias Ueberauth.Strategy.Helpers
  alias Gameoff.User

  def logout(conn, _params) do
    Logger.debug "Logout"

    conn
    |> put_flash(:info, "You have been logged out!")
    |> Guardian.Plug.sign_out
    |> redirect(to: page_path(conn, :landing))
  end

  @doc"""
  Called after the oauth failed.
  """
  def callback(%{assigns: %{ueberauth_failure: _fails}} = conn, _params) do
    Logger.debug "Failed auth callback"

    conn
    |> put_flash(:error, "Failed to authenticate.")
    |> redirect(to: page_path(conn, :landing))
  end

  @doc"""
  Called after a successfull auth with oauth.
  Logs the user in and creates an account if non exists.
  """
  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    Logger.debug "Successfull auth callback"

    case find_or_create(auth) do
      {:ok, user} ->
        conn
        |> put_flash(:info, "Successfully authenticated.")
        |> Guardian.Plug.sign_in(user)
        |> redirect(to: page_path(conn, :game))
      {:error, reason} ->
        conn
        |> put_flash(:error, reason)
        |> redirect(to: page_path(conn, :landing))
    end
  end

  @doc """
  Finds or creates a new user using the given github details.

  Returns `{:ok, user}` if successfull.
  Returns `{:error, reason}` if there was an error.

  Can be used with ueberauth.
  """
  defp find_or_create(auth) do
     case Repo.get_by(User, github_uid: auth.uid) do
       nil ->
        name = auth.info.name || auth.info.nickname
        new_user_changeset = User.changeset(%User{}, %{name: name, github_uid: auth.uid})

        case Repo.insert(new_user_changeset) do
          {:ok, user} -> {:ok, user}
          {:error, _user_changeset} -> {:error, "validation error"}
          _ -> {:error, "unknown error"}
        end

        user ->
          {:ok, user}
     end
  end
end