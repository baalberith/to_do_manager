defmodule ToDoManager.Repo.Migrations.ChangeDatetimeToDateFieldTypeInTask do
  use Ecto.Migration

  def change do
    alter table(:tasks) do
      modify :date, :date
    end
  end
end
