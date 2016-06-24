defmodule ToDoManager.PageController do
  use ToDoManager.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
