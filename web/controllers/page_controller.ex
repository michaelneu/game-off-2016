defmodule Gameoff.PageController do
  use Gameoff.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, [handler: Gameoff.AuthErrorHandler] when action in [:game]

  def landing(conn, _params) do
    render conn, "landing.html"
  end

  def game(conn, _params) do
    conn
    |> put_layout(false)
    |> render("game.html", jwt_token: Guardian.Plug.current_token(conn))
  end
end
