defmodule ToDoManager.Router do
  use ToDoManager.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.LoadResource
  end

  pipeline :browser_auth do
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.EnsureAuthenticated, handler: ToDoManager.Token
    plug Guardian.Plug.LoadResource
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ToDoManager do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    resources "/users", UserController, only: [:new, :create]
    resources "/sessions", SessionController, only: [:new, :create, :delete]
  end

  scope "/", ToDoManager do
    pipe_through [:browser, :browser_auth]

    get "/", PageController, :index
    resources "/users", UserController, only: [:delete]

    resources "/lists", ListController do
      patch "/tasks/complete_tasks", TaskController, :complete_tasks
      delete "/tasks/delete_tasks", TaskController, :delete_tasks

      resources "/tasks", TaskController
    end
  end

  # Other scopes may use custom stacks.
  # scope "/api", ToDoManager do
  #   pipe_through :api
  # end
end
