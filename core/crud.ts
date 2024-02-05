import fs from "fs"; //ES6
import { v4 as uuidv4 } from "uuid";

const DB_FILE_PATH = "./core/db.json";
// console.log("[CRUD]");

type UUID = string;

interface Todo {
  id: UUID;
  date: string;
  content: string;
  done: boolean;
}

function create(content: string): Todo {
  const todo: Todo = {
    id: uuidv4(),
    date: new Date().toISOString(),
    content: content,
    done: false,
  };

  // le tudo que foi feito e explalha
  const todos: Array<Todo> = [...read(), todo];

  // value = recebe o array
  // replace -> null -> quer dizer que não quero fazer nenhum faind replace
  // quebra em dois epaços
  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
        dogs: [],
      },
      null,
      2,
    ),
  );

  return todo;
}

function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");

  if (!db.todos) {
    return [];
  }

  return db.todos;
}

//  todo: Partial<Todo> -> partianl todo siginifica que vai receber alguma coisa de Todo
function update(id: UUID, partialTodo: Partial<Todo>): Todo {
  let updateTodo;
  const todos = read();
  todos.forEach((currentTodo) => {
    const isToUpdate = currentTodo.id === id;
    if (isToUpdate) {
      updateTodo = Object.assign(currentTodo, partialTodo);
    }
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2,
    ),
  );

  if (!updateTodo) {
    throw new Error("Please, provide another ID!");
  }

  return updateTodo;
}

function updateContentById(id: UUID, content: string) {
  return update(id, {
    content,
  });
}

function deleteById(id: UUID) {
  const todos = read();

  const todosWithoutOne = todos.filter((todo) => {
    if (id === todo.id) {
      return false;
    }
    return true;
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos: todosWithoutOne,
      },
      null,
      2,
    ),
  );
}

function CLEAR_DB() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

CLEAR_DB();
create("Primeira Todo");
const secondTodo = create("Segunda Todo");
deleteById(secondTodo.id);
const thirdTodo = create("Terceiro Todo");

// update(thirdTodo.id, {
// 	content: 'Atualizada',
// 	done: true
// })

updateContentById(thirdTodo.id, "Atualizado");

// update(DE quem, O que)
// update(terceiroId.id, O que)
// console.log(read());
