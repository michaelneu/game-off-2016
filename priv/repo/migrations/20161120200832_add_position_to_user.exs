defmodule Gameoff.Repo.Migrations.AddPositionToUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :location_x, :integer
      add :location_y, :integer
    end
  end
end
