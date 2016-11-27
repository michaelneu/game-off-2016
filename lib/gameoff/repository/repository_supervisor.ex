defmodule Gameoff.Repository.RepositorySupervisor do
  use Supervisor

  def start_link do
    Supervisor.start_link(__MODULE__, [], name: :repository_supervisor)
  end

  def start_repository(repository) do
    Supervisor.start_child(:chat_supervisor, [repository])
  end

  def init(_) do
    children = [
      worker(Gameoff.Repository.Repository, [])
    ]

    supervise(children, strategy: :simple_one_for_one)
  end
end
