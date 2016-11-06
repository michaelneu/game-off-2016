defmodule Gameoff.Repo.Migrations.CreateRepository do
  use Ecto.Migration

  def change do
    create table(:repositories) do
      add :level, :integer, null: false
      add :name, :string, null: false
      add :location_x, :integer, null: false
      add :location_y, :integer, null: false
      add :repo_structure, :map, null: false
      add :owner_id, references(:users, on_delete: :nilify_all)
      add :protection_device_id, references(:devices, on_delete: :nilify_all)

      timestamps()
    end
    create index(:repositories, [:owner_id])

  end
end
