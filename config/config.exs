# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :gameoff,
  ecto_repos: [Gameoff.Repo],
  github_api_token: System.get_env("GITHUB_REST_API_TOKEN")

# Configures the endpoint
config :gameoff, Gameoff.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "WYv+ekoqvupyqz+w7ueI2gk9n6VKSnOdImGdhHDrTX16byr9rFh5mHctzCC79v9J",
  render_errors: [view: Gameoff.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Gameoff.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :ueberauth, Ueberauth,
  providers: [
    github: { Ueberauth.Strategy.Github, [] }
  ]
config :ueberauth, Ueberauth.Strategy.Github.OAuth,
  client_id: System.get_env("GITHUB_CLIENT_ID"),
  client_secret: System.get_env("GITHUB_CLIENT_SECRET")


config :guardian, Guardian,
  allowed_algos: ["HS512"], # optional
  verify_module: Guardian.JWT,  # optional
  issuer: "Game Off 2016",
  ttl: { 30, :days },
  serializer: Gameoff.GuardianSerializer

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
