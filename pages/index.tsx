import { GlobalStyles } from "@ui/theme/GlobalStyles";
import * as url from "url";
import { NextURL } from "next/dist/server/web/next-url";
import { NEXT_URL } from "next/dist/client/components/app-router-headers";
import React, { useState } from "react";
import { todoController } from "@ui/controller/todos";

const bg = "/bg.jpeg";

interface HomeTodo {
  id: string;
  content: string,
}

export default function Page() {

  const [page, setPage] = useState(1);
  const [todos, setTodos] = useState<HomeTodo[]>([]);

  React.useEffect(() => {
    todoController.get()
      .then((todos) => {
        setTodos(todos);
      });
  }, []);

  return (
    <main>
      <GlobalStyles themeName="indigo" />
      <header
        style={{
          backgroundImage: `url('${bg}')`
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form>
          <input type="text" placeholder="Correr, Estudar..." />
          <button style={{ padding: 12 }} type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input type="text" placeholder="Filtrar lista atual, ex: Dentista" />
        </form>

        <table border={1}>
          <thead>
          <tr>
            <th align="left">
              <input type="checkbox" disabled />
            </th>
            <th align="left">Id</th>
            <th align="left">Conteúdo</th>
            <th />
          </tr>
          </thead>

          <tbody>
          {todos.map((todo) => {
            return (
              <tr key={todo.id}>
                <td><input type="checkbox" /></td>
                <td>{todo.id.substring(0, 4)}</td>
                <td>{todo.content}</td>
                <td align="right">
                  <button data-type="delete">Apagar</button>
                </td>
              </tr>
            );
          })}

          {/*<tr>*/}
          {/*  <td colSpan={4} align="center" style={{ textAlign: "center" }}>*/}
          {/*    Carregando...*/}
          {/*  </td>*/}
          {/*</tr>*/}

          {/*<tr>*/}
          {/*  <td colSpan={4} align="center">*/}
          {/*    Nenhum item encontrado*/}
          {/*  </td>*/}
          {/*</tr>*/}

          <tr>
            <td colSpan={4} align="center" style={{ textAlign: "center" }}>
              <button data-type="load-more" onClick={() => setPage(page + 1)}>
                Pagina {page} Carregar mais{" "}
                <span
                  style={{
                    display: "inline-block",
                    marginLeft: "4px",
                    fontSize: "1.2em"
                  }}
                >
                  ↓
                </span>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
