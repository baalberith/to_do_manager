ExUnit.start

Mix.Task.run "ecto.create", ~w(-r ToDoManager.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r ToDoManager.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(ToDoManager.Repo)

