defmodule Gameoff.Repo.Migrations.AddGithubIdToRepo do
  use Ecto.Migration

  def change do
    alter table(:repositories) do
      add :github_id, :integer
    end
  end
end
