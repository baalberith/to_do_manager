defmodule ToDoManager.Repo.Migrations.CreateList do
  use Ecto.Migration

  def change do
    create table(:lists) do
      add :name, :string

      timestamps
    end

  end
end
