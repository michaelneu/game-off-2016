defmodule Gameoff.AuthErrorHandler do
  use Gameoff.Web, :controller

  def unauthenticated(conn, _params) do
      conn
      |> put_flash(:error, "authentication required")
      |> redirect(to: page_path(conn, :landing))
  end
end