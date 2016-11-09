defmodule Gameoff.Repo.Migrations.CreateWorldSection do
  use Ecto.Migration

  def change do
    create table(:world_sections) do
      add :location_x, :integer
      add :location_y, :integer
      add :properties, :map

      timestamps()
    end

  end
end
