defmodule Gameoff.Repo.Migrations.CreateDeviceAttack do
  use Ecto.Migration

  def change do
    create table(:device_attacks) do
      add :options, :map, null: false
      add :device_id, references(:devices, on_delete: :nothing)
      add :attack_id, references(:attacks, on_delete: :nothing)

      timestamps()
    end
    create index(:device_attacks, [:device_id])
    create index(:device_attacks, [:attack_id])

  end
end
