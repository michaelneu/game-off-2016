use Mix.Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.
config :gameoff, Gameoff.Endpoint,
  http: [port: 4000],
  debug_errors: true,
  code_reloader: true,
  check_origin: false,
  watchers: [npm: ["run", "build"], npm: ["run", "dev"]]


# Watch static and templates for browser reloading.
config :gameoff, Gameoff.Endpoint,
  live_reload: [
    patterns: [
      ~r{priv/static/.*(js|css|png|jpeg|jpg|gif|svg|html)$},
      ~r{priv/gettext/.*(po)$},
      ~r{web/views/.*(ex)$},
      ~r{web/templates/.*(eex)$}
    ]
  ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Configure your database
config :gameoff, Gameoff.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "gameoff_dev",
  hostname: "localhost",
  pool_size: 10

config :guardian, Guardian,
  secret_key: %{
      "k" => "wPRv1qH/dbxc3L1Tkud4wUoTM/fVB9d9rTrvNRHX7r8TtZNE0+XX6B/pDHEuZ9A5",
      "kty" => "oct"
    }
