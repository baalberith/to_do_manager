defmodule ToDoManager.TaskController do
  require Logger

  use ToDoManager.Web, :controller

  alias ToDoManager.Task

  plug :scrub_params, "task" when action in [:create, :update]

  def new(conn, %{"list_id" => list_id}) do
    changeset = Task.changeset(%Task{})
    render(conn, "new.html", changeset: changeset, list_id: list_id)
  end

  def create(conn, %{"list_id" => list_id, "task" => task_params}) do
    #changeset = Task.changeset(%Task{}, Map.put_new(task_params, "list_id", list_id))
    changeset = Task.changeset(%Task{list_id: String.to_integer(list_id)}, task_params)

    case Repo.insert(changeset) do
      {:ok, _task} ->
        conn
        |> put_flash(:info, "Task created successfully.")
        |> redirect(to: list_path(conn, :show, list_id))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset, list_id: list_id)
    end
  end
  
  def edit(conn, %{"id" => id}) do
    task = Repo.get!(Task, id)
    changeset = Task.changeset(task)
    render(conn, "edit.html", changeset: changeset, task: task)
  end

  def update(conn, %{"id" => id, "task" => task_params}) do
    task = Repo.get!(Task, id)
    changeset = Task.changeset(task, task_params)

    case Repo.update(changeset) do
      {:ok, task} ->
        conn
        |> put_flash(:info, "Task updated successfully.")
        |> redirect(to: list_path(conn, :show, task.list_id))
      {:error, changeset} ->
        render(conn, "edit.html", changeset: changeset, task: task)
    end
  end

  def delete(conn, %{"list_id" => list_id, "id" => id}) do
    task = Repo.get!(Task, id)

    Repo.delete!(task)

    conn
    |> put_flash(:info, "Task deleted successfully.")
    |> redirect(to: list_path(conn, :show, list_id))
  end


  def complete_tasks(conn, %{"list_id" => list_id, "tasks_to_complete" => tasks_to_complete}) do
    for task_id <- tasks_to_complete do
      task = Repo.get!(Task, String.to_integer(task_id))
      Repo.update!(%{task | completed: true})
    end

    json conn, %{location: list_path(conn, :show, list_id), info: "Tasks completed successfully."}
  end

  def complete_tasks(conn, %{"list_id" => list_id}) do
    json conn, %{location: list_path(conn, :show, list_id), info: "Nothing to complete.."}
  end

  def delete_tasks(conn, %{"list_id" => list_id, "tasks_to_delete" => tasks_to_delete}) do
    for task_id <- tasks_to_delete do
      task = Repo.get!(Task, String.to_integer(task_id))
      Repo.delete!(task)
    end

    json conn, %{location: list_path(conn, :show, list_id), info: "Tasks deleted successfully."}
  end

  def delete_tasks(conn, %{"list_id" => list_id}) do
    json conn, %{location: list_path(conn, :show, list_id), info: "Nothing to delete."}
  end

end
