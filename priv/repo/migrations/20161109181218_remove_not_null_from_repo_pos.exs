defmodule Gameoff.Repo.Migrations.RemoveNotNullFromRepoPos do
  use Ecto.Migration

  def up do
    alter table(:repositories) do
      modify :location_x, :integer, null: true
      modify :location_y, :integer, null: true
    end
  end

  def down do
    alter table(:repositories) do
      modify :location_x, :integer, null: false
      modify :location_y, :integer, null: false
    end
  end
end
