defmodule Gameoff.Repo.Migrations.CreateAttack do
  use Ecto.Migration

  def change do
    create table(:attacks) do
      add :command_name, :string, null: false
      add :description, :string, null: false, default: "no description"
      add :properties, :map, null: false
      add :battery_intensity, :integer, null: false, default: 0
      add :attack_intensity, :integer, null: false, default: 0
      add :network_influence, :float, null: false, default: 0.0
      add :computing_influence, :float, null: false, default: 0.0
      add :social_engineering_influence, :float, null: false, default: 0.0
      add :storage_influence, :float, null: false, default: 0.0

      timestamps()
    end

  end
end
