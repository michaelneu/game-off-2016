defmodule Gameoff.Repo.Migrations.AddIndexToRepoPosition do
  use Ecto.Migration

  def change do
    create unique_index(:repositories, [:location_x, :location_y], name: "unique_repo_location")
  end
end
