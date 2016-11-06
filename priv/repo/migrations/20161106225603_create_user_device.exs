defmodule Gameoff.Repo.Migrations.CreateUserDevice do
  use Ecto.Migration

  def change do
    create table(:user_devices) do
      add :count, :integer, null: false, default: 0
      add :user_id, references(:users, on_delete: :delete_all)
      add :device_id, references(:devices, on_delete: :delete_all)

      timestamps()
    end
    create index(:user_devices, [:user_id])
    create index(:user_devices, [:user_id, :device_id])

  end
end
