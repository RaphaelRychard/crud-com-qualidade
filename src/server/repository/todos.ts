import {
  create,
  read,
  update,
  deleteById as dbDeleteById,
} from "@db-crud-todo";
import { HttpNotFoundError } from "@server/infra/errors";

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

function get({
  page,
  limit,
}: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput {
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const ALL_TODOS = read().reverse();

  const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);
  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit;
  const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);

  return {
    total: ALL_TODOS.length,
    todos: paginatedTodos,
    pages: totalPages,
  };
}

async function createByContent(content: string): Promise<Todo> {
  return create(content);
}

async function toggleDone(id: string): Promise<Todo> {
  const ALL_TODOS = read();
  const todo = ALL_TODOS.find((todo) => todo.id === id);

  if (!todo) throw new Error(`Todo with id ${id} not found!`);

  return update(todo.id, {
    done: !todo.done,
  });
}

async function deleteByd(id: string) {
  const ALL_TODOS = read();
  const todo = ALL_TODOS.find((todo) => todo.id === id);
  if (!todo) throw new HttpNotFoundError(`Todo with id "${id}" not found!`);

  dbDeleteById(id);
}

export const todosRepository = { get, createByContent, toggleDone, deleteByd };

//Model/Schema
interface Todo {
  id: string;
  content: string;
  date: string;
  done: boolean;
}
