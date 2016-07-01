defmodule ToDoManager.ListController do
  require Logger
  use ToDoManager.Web, :controller

  alias ToDoManager.List

  plug :scrub_params, "list" when action in [:create, :update]

  def index(conn, _params) do
    # lists = Repo.all(List)
    # render(conn, "index.html", lists: lists)
    user = Guardian.Plug.current_resource(conn)
    lists = Repo.all(my_lists(user))
    render(conn, "index.html", lists: lists)
  end

  def new(conn, _params) do
    # changeset = List.changeset(%List{})
    # render(conn, "new.html", changeset: changeset)
    changeset = Guardian.Plug.current_resource(conn)
    |> build_assoc(:lists)
    |> List.changeset()

    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"list" => list_params}) do
    # changeset = List.changeset(%List{}, list_params)

    # case Repo.insert(changeset) do
    #   {:ok, _list} ->
    #     conn
    #     |> put_flash(:info, "List created successfully.")
    #     |> redirect(to: list_path(conn, :index))
    #   {:error, changeset} ->
    #     render(conn, "new.html", changeset: changeset)
    # end
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
    # list = List |> Repo.get!(id) |> Repo.preload([:tasks])
    # render(conn, "show.html", list: list)
    user = Guardian.Plug.current_resource(conn)
    list = Repo.get!(my_lists(user), id) |> Repo.preload([:tasks])
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
    Repo.delete!(list)

    conn
    |> put_flash(:info, "List deleted successfully.")
    |> redirect(to: list_path(conn, :index))
  end

  defp my_lists(user) do
    assoc(user, :lists)
  end
end
