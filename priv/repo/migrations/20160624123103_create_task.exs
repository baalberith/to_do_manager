defmodule ToDoManager.Repo.Migrations.CreateTask do
  use Ecto.Migration

  def change do
    create table(:tasks) do
      add :name, :string
      add :date, :datetime
      add :list_id, references(:lists, on_delete: :nothing)

      timestamps
    end
    create index(:tasks, [:list_id])

  end
end
