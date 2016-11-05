defmodule Gameoff.Router do
  use Gameoff.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Gameoff do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :landing
    get "/game", PageController, :game
  end

  # Other scopes may use custom stacks.
  # scope "/api", Gameoff do
  #   pipe_through :api
  # end
end
