defmodule Gameoff.PageController do
  use Gameoff.Web, :controller

  def landing(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, _params) do
    conn
      |> put_resp_content_type("text/html")
      |> send_file(200, "priv/static/index.html")
  end
end
