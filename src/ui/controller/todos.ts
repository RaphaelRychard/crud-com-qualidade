import { todoRepository } from "@ui/repository/todos";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

interface TodoControolerGetParams {
  page: number;
}

async function get(params: TodoControolerGetParams) {
  return todoRepository.get({
    page: params.page,
    limit: 2,
  });
}

function filterTodosByContent<Todo>(
  search: string,
  todos: Array<Todo & { content: string }>,
): Array<Todo> {
  return todos.filter((todo) => {
    const searchNormalized = search.toLowerCase();
    const contentNormalized = todo.content.toLowerCase();
    return contentNormalized.includes(searchNormalized);
  });
}

interface TodoControllerCreateParams {
  content?: string;
  onError: (customMessage?: string) => void;
  onSuccess: (todo: Todo) => void;
}

function create({ content, onSuccess, onError }: TodoControllerCreateParams) {
  const parsedParms = schema.string().trim().min(1).safeParse(content);

  if (!parsedParms.success) {
    onError("Você precisa prover um conteúdo!");
    return;
  }

  todoRepository
    .createByContent(parsedParms.data)
    .then((newTodo) => {
      onSuccess(newTodo);
    })
    .catch(() => {
      onError();
    });
}

interface TodoControllerToggleParams {
  id: string;
  updateTodoOnScreen: () => void;
  onError: () => void;
}

function toggleDone({
  id,
  updateTodoOnScreen,
  onError,
}: TodoControllerToggleParams) {
  todoRepository
    .toggleDone(id)
    .then(() => {
      updateTodoOnScreen();
    })
    .catch(() => {
      onError();
    });
}

async function deleteById(id: string): Promise<void> {
  await todoRepository.deleteById(id);
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
  toggleDone,
  deleteById,
};
