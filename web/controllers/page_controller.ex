defmodule Gameoff.PageController do
  use Gameoff.Web, :controller

  def landing(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, _params) do
    conn
      |> put_resp_content_type("text/html")
      |> resp(200, File.read!("priv/static/index.html"))
  end
end
