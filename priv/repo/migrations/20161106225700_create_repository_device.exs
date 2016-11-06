defmodule Gameoff.Repo.Migrations.CreateRepositoryDevice do
  use Ecto.Migration

  def change do
    create table(:repository_devices) do
      add :repository_id, references(:repositories, on_delete: :delete_all)
      add :device_id, references(:devices, on_delete: :delete_all)

      timestamps()
    end
    create index(:repository_devices, [:repository_id])
    create index(:repository_devices, [:device_id])
    create index(:repository_devices, [:device_id, :repository_id])

  end
end
