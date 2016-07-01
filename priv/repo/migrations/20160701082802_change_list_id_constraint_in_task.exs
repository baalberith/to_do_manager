defmodule ToDoManager.Repo.Migrations.ChangeListIdConstraintInTask do
  use Ecto.Migration

  def change do
    alter table(:tasks) do
      remove :list_id
      add :list_id, references(:lists, on_delete: :delete_all)
    end
  end
end
