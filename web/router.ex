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
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  scope "/", Gameoff do
    pipe_through :browser # Use the default browser stack

    # Serve main game pages
    get "/", PageController, :landing
    get "/game", PageController, :game

    # Login/Auth routes
    get "/auth/logout", AuthController, :logout
    get "/auth/:provider", AuthController, :request
    get "/auth/:provider/callback", AuthController, :callback
    post "/auth/:provider/callback", AuthController, :callback
  end

  # Other scopes may use custom stacks.
  # scope "/api", Gameoff do
  #   pipe_through :api
  # end
end
