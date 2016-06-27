defmodule ToDoManager.ListController do
  require Logger
  use ToDoManager.Web, :controller

  alias ToDoManager.List

  plug :scrub_params, "list" when action in [:create, :update]

  def index(conn, _params) do
    lists = Repo.all(List)
    render(conn, "index.html", lists: lists)
  end

  def new(conn, _params) do
    changeset = List.changeset(%List{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"list" => list_params}) do
    changeset = List.changeset(%List{}, list_params)

    case Repo.insert(changeset) do
      {:ok, _list} ->
        conn
        |> put_flash(:info, "List created successfully.")
        |> redirect(to: list_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    list = List |> Repo.get!(id) |> Repo.preload([:tasks])
    render(conn, "show.html", list: list)
  end

  def edit(conn, %{"id" => id}) do
    list = Repo.get!(List, id)
    changeset = List.changeset(list)
    render(conn, "edit.html", list: list, changeset: changeset)
  end

  def update(conn, %{"id" => id, "list" => list_params}) do
    list = Repo.get!(List, id)
    changeset = List.changeset(list, list_params)

    case Repo.update(changeset) do
      {:ok, list} ->
        conn
        |> put_flash(:info, "List updated successfully.")
        |> redirect(to: list_path(conn, :show, list))
      {:error, changeset} ->
        render(conn, "edit.html", list: list, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    list = Repo.get!(List, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(list)

    conn
    |> put_flash(:info, "List deleted successfully.")
    |> redirect(to: list_path(conn, :index))
  end

  def delete_tasks(conn, %{"id" => id, "list" => tasks_to_delete}) do
    for {task_id, to_delete} <- tasks_to_delete do
      if to_delete == "true" do
        task = Repo.get!(ToDoManager.Task, String.to_integer(task_id))
        Repo.delete!(task)
      end
    end

    conn
    |> put_flash(:info, "Tasks deleted successfully.")
    |> redirect(to: list_path(conn, :show, id))
  end

  def delete_tasks(conn, %{"id" => id}) do
    conn
    |> put_flash(:info, "No tasks do delete.")
    |> redirect(to: list_path(conn, :show, id))
  end
end
