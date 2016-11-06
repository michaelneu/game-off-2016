defmodule Gameoff.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string
      add :github_uid, :string

      timestamps()
    end

    create index(:users, [:github_uid])

  end
end
