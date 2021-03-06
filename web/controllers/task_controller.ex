defmodule ToDoManager.TaskController do
  require Logger

  use ToDoManager.Web, :controller

  alias ToDoManager.Task

  plug :scrub_params, "task" when action in [:create, :update]

  def create(conn, %{"list_id" => list_id, "task" => task_params}) do
    changeset = Task.changeset(%Task{list_id: String.to_integer(list_id)}, task_params)

    case Repo.insert(changeset) do
      {:ok, task} ->
        json conn, %{valid: true, task: task}
      {:error, changeset} ->
        json conn, %{valid: false, errors: serialize_errors(changeset.errors)}
    end
  end

  def update(conn, %{"id" => id, "task" => task_params}) do
    task = Repo.get!(Task, id)
    changeset = Task.changeset(task, task_params)

    case Repo.update(changeset) do
      {:ok, task} ->
        json conn, %{valid: true, task: task}
      {:error, changeset} ->
        json conn, %{valid: false, errors: serialize_errors(changeset.errors)}
    end
  end

  def delete(conn, %{"list_id" => list_id, "id" => id}) do
    task = Repo.get!(Task, id)
    Repo.delete!(task)

    json conn, %{info: "Task deleted successfully."}
  end

  def complete_tasks(conn, %{"list_id" => list_id, "tasks_to_complete" => tasks_to_complete}) do
    for task_id <- tasks_to_complete do
      task = Repo.get!(Task, String.to_integer(task_id))
      Repo.update!(%{task | completed: true})
    end

    json conn, %{info: "Tasks completed successfully."}
  end
  def complete_tasks(conn, %{"list_id" => list_id}) do
    json conn, %{info: "Nothing to complete."}
  end

  def delete_tasks(conn, %{"list_id" => list_id, "tasks_to_delete" => tasks_to_delete}) do
    for task_id <- tasks_to_delete do
      task = Repo.get!(Task, String.to_integer(task_id))
      Repo.delete!(task)
    end

    json conn, %{info: "Tasks deleted successfully."}
  end
  def delete_tasks(conn, %{"list_id" => list_id}) do
    json conn, %{info: "Nothing to delete."}
  end



  defp serialize_errors(errors) do
    errors = for {field, detail} <- errors, do: %{field: field, detail: render_detail(detail)}
  end

  defp render_detail(detail) do
    case detail do
      {message, values} ->
        Enum.reduce(values, message, fn {k, v}, acc ->
          String.replace(acc, "%{#{k}}", to_string(v)) end)
      message ->
        message
    end
  end

end
