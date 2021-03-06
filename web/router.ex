defmodule Gameoff.Router do
  use Gameoff.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :browser_session do
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.LoadResource
    plug :put_user
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
    plug :put_user
  end

  scope "/", Gameoff do
    pipe_through [:browser, :browser_session] # Use the default browser stack

    # Serve main game pages
    get "/", PageController, :landing
    get "/game", PageController, :game

    # Login/Auth routes
    get "/auth/logout", AuthController, :logout
    get "/auth/:provider", AuthController, :request
    get "/auth/:provider/callback", AuthController, :callback
    post "/auth/:provider/callback", AuthController, :callback
  end

  defp put_user(conn, _options) do
    user = Guardian.Plug.current_resource(conn)
    assign(conn, :user, user)
  end

  # Other scopes may use custom stacks.
  # scope "/api", Gameoff do
  #   pipe_through :api
  # end
end
