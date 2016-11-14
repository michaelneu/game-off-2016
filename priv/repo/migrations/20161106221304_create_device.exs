defmodule Gameoff.Repo.Migrations.CreateDevice do
  use Ecto.Migration

  def change do
    create table(:devices) do
      add :name, :string, null: false
      add :description, :string, null: false, default: "no description"
      add :properties, :map, null: false
      add :battery, :integer, null: false, default: 1
      add :network_power, :float, null: false, default: 0.0
      add :computing_power, :float, null: false, default: 0.0
      add :social_engineering_power, :float, null: false, default: 0.0
      add :storage_power, :float, null: false, default: 0.0

      timestamps()
    end

  end
end
