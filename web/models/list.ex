defmodule ToDoManager.List do
  use ToDoManager.Web, :model
  @derive {Poison.Encoder, only: [:id, :name, :tasks, :user_id]}

  schema "lists" do
    field :name, :string
    has_many :tasks, ToDoManager.Task
    belongs_to :user, ToDoManager.User

    timestamps
  end

  @required_fields ~w(name)
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
