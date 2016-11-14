use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :gameoff, Gameoff.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :gameoff, Gameoff.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "gameoff_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox


config :guardian, Guardian,
  secret_key: %{
      "k" => "wPRv1qH/dbxc3L1Tkud4wUoTM/fVB9d9rTrvNRHX7r8TtZNE0+XX6B/pDHEuZ9A5",
      "kty" => "oct"
    }
