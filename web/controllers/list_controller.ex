defmodule ToDoManager.ListController do
  require Logger
  use ToDoManager.Web, :controller

  alias ToDoManager.List

  plug :scrub_params, "list" when action in [:create, :update]

  def index(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    lists = Repo.all(my_lists(user))
    render(conn, "index.html", lists: lists)
  end

  def new(conn, _params) do
    changeset = Guardian.Plug.current_resource(conn)
    |> build_assoc(:lists)
    |> List.changeset()

    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"list" => list_params}) do
    changeset = Guardian.Plug.current_resource(conn)
    |> build_assoc(:lists)
    |> List.changeset(list_params)

    case Repo.insert(changeset) do
      {:ok, _todo} ->
        conn
        |> put_flash(:info, "List created successfully.")
        |> redirect(to: list_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)
    list = Repo.get!(List, id)
    if list.user_id == user.id do
      list_with_tasks = Repo.preload(list, [:tasks])
      render(conn, "show.html", list: list_with_tasks)
    else
      conn
      |> put_flash(:error, "Not your list")
      |> redirect(to: list_path(conn, :index))
    end
  end

  def edit(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)
    list = Repo.get!(List, id)
    if list.user_id == user.id do
      changeset = List.changeset(list)
      render(conn, "edit.html", list: list, changeset: changeset)
    else
      conn
      |> put_flash(:error, "Not your list")
      |> redirect(to: list_path(conn, :index))
    end
  end

  def update(conn, %{"id" => id, "list" => list_params}) do
    user = Guardian.Plug.current_resource(conn)
    list = Repo.get!(List, id)
    if list.user_id == user.id do
      changeset = List.changeset(list, list_params)

      case Repo.update(changeset) do
        {:ok, _list} ->
          conn
          |> put_flash(:info, "List updated successfully.")
          |> redirect(to: list_path(conn, :index))
        {:error, changeset} ->
          render(conn, "edit.html", list: list, changeset: changeset)
      end
    else
      conn
      |> put_flash(:error, "Not your list")
      |> redirect(to: list_path(conn, :index))
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)
    list = Repo.get!(List, id)
    if list.user_id == user.id do
      Repo.delete!(list)

      conn
      |> put_flash(:info, "List deleted successfully.")
      |> redirect(to: list_path(conn, :index))
    else
      conn
      |> put_flash(:error, "Not your list")
      |> redirect(to: list_path(conn, :index))
    end
  end

  defp my_lists(user) do
    assoc(user, :lists)
  end
end
