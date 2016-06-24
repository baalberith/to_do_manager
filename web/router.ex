defmodule ToDoManager.Router do
  use ToDoManager.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ToDoManager do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/hello", HelloController, :index
    get "/hello/:messenger", HelloController, :show

    resources "/lists", ListController do
      resources "/tasks", TaskController
    end
  end

  # Other scopes may use custom stacks.
  # scope "/api", ToDoManager do
  #   pipe_through :api
  # end
end
