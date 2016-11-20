defmodule Gameoff.Repo.Migrations.AddUsersCurrentRepository do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :current_repository_id, references(:repositories, on_delete: :nilify_all)
    end
  end
end
