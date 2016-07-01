defmodule ToDoManager.UserController do
  use ToDoManager.Web, :controller

  alias ToDoManager.User

  def new(conn, _params) do
    changeset = User.changeset(%User{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"user" => user_params}) do
    changeset = User.registration_changeset(%User{}, user_params)
    case Repo.insert(changeset) do
      {:ok, user} ->
        conn
        |> ToDoManager.Auth.login(user)
        |> put_flash(:info, "User created!")
        |> redirect(to: list_path(conn, :index))
      {:error, changeset} ->
        conn
        |> render("new.html", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Repo.get(User, id)

    cond do
      user == Guardian.Plug.current_resource(conn) ->
        case Repo.delete(user) do
          {:ok, user} ->
            conn
            |> Guardian.Plug.sign_out
            |> put_flash(:info, "Account deleted")
            |> redirect(to: page_path(conn, :index))
          {:error, _} ->
            conn
            |> redirect(to: list_path(conn, :index))
        end
    end
  end
end
