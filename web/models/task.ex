defmodule ToDoManager.Task do
  use ToDoManager.Web, :model

  schema "tasks" do
    field :name, :string
    field :date, Ecto.DateTime
    field :completed, :boolean, default: false
    belongs_to :list, ToDoManager.List

    timestamps
  end

  @required_fields ~w(name date list_id completed)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
