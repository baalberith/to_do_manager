defmodule ToDoManager.Task do
  use ToDoManager.Web, :model
  @derive {Poison.Encoder, only: [:id, :name, :date, :completed, :list_id]}

  schema "tasks" do
    field :name, :string
    field :date, Ecto.Date
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
    |> validate_length(:name, min: 3)
  end
end
