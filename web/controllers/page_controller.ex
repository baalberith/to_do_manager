defmodule ToDoManager.PageController do
  use ToDoManager.Web, :controller

  def index(conn, _params) do
    hello_message = %{message: "Hello world, ", name: "Ilona"}
    render conn, "index.html", hello_message: hello_message
  end
end
