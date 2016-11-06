defmodule Gameoff.PageController do
  use Gameoff.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, [handler: Gameoff.AuthErrorHandler] when action in [:game]

  def landing(conn, _params) do
    render conn, "landing.html"
  end

  def game(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    { :ok, jwt, _full_claims } = Guardian.encode_and_sign(user)

    conn
    |> put_layout(false)
    |> render("game.html", jwt_token: jwt)
  end
end
