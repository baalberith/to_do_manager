defmodule ToDoManager.Repo.Migrations.AddUserIdFieldToList do
  use Ecto.Migration

  def change do
    alter table(:lists) do
      add :user_id, references(:users, on_delete: :delete_all)
    end
  end
end
