import { z as schema } from "zod";
import { todosRepository } from "@server/repository/todos";
import { HttpNotFoundError } from "@server/infra/errors";

async function get(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = {
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  };

  const page = Number(query.page);
  const limit = Number(query.limit);

  if (query.page && isNaN(page)) {
    return new Response(
      JSON.stringify({
        error: {
          message: "`page` must be a number",
        },
      }),
      {
        status: 400,
      },
    );
  }

  if (query.limit && isNaN(limit)) {
    return new Response(
      JSON.stringify({
        error: {
          message: "`limit` must be a number",
        },
      }),
      {
        status: 400,
      },
    );
  }

  try {
    const output = await todosRepository.get({
      page: Number(query.page),
      limit: Number(query.limit),
    });

    return new Response(
      JSON.stringify({
        total: output.total,
        pages: output.pages,
        todos: output.todos,
      }),
      {
        status: 200,
      },
    );
  } catch {
    return new Response(
      JSON.stringify({
        error: {
          message: "Failed to fetch TODOs",
        },
      }),
      {
        status: 400,
      },
    );
  }
}

const TodoCreateBodySchema = schema.object({
  content: schema.string(),
});

async function create(req: Request) {
  const body = TodoCreateBodySchema.safeParse(await req.json());

  if (!body.success) {
    return new Response(
      JSON.stringify({
        error: {
          massage: "You need to provider a content to create a TODO",
          description: body.error.issues,
        },
      }),
      {
        status: 400,
      },
    );
  }

  try {
    const createdTodo = await todosRepository.createByContent(
      body.data.content,
    );
    return new Response(
      JSON.stringify({
        todo: createdTodo,
      }),
      {
        status: 201,
      },
    );
  } catch {
    return new Response(
      JSON.stringify({
        error: {
          message: "Failed to create todo",
        },
      }),
      {
        status: 400,
      },
    );
  }
}

async function toggleDone(req: Request, id: string) {
  const todoId = id;

  if (!todoId || typeof todoId !== "string") {
    return new Response(
      JSON.stringify({
        error: {
          message: "You must to provide a string ID",
        },
      }),
      {
        status: 400,
      },
    );
  }

  try {
    const updatedTodo = await todosRepository.toggleDone(todoId);
    return new Response(
      JSON.stringify({
        todo: updatedTodo,
      }),
      {
        status: 202,
      },
    );
  } catch (err) {
    if (err instanceof Error) {
      return new Response(
        JSON.stringify({
          error: {
            message: err.message,
          },
        }),
        {
          status: 403,
        },
      );
    }
  }
}

async function deleteById(req: Request, id: string) {
  const query = {
    id,
  };
  const QuerySchema = schema.object({
    id: schema.string().trim().uuid().min(1),
  });

  const parsedQuey = QuerySchema.safeParse(query);

  if (!parsedQuey.success) {
    return new Response(
      JSON.stringify({
        error: {
          message: `You must to providers a valid id`,
        },
      }),
      {
        status: 400,
      },
    );
  }
  try {
    const todoId = parsedQuey.data.id;
    await todosRepository.deleteByd(todoId);
    return new Response(null, {
      status: 204,
    });
  } catch (err) {
    if (err instanceof HttpNotFoundError) {
      return new Response(
        JSON.stringify({
          error: {
            message: err.message,
          },
        }),
        {
          status: err.status,
        },
      );
    }
    return new Response(
      JSON.stringify({
        error: {
          message: `Internal server error`,
        },
      }),
      {
        status: 500,
      },
    );
  }
}

export const todoController = {
  get,
  create,
  toggleDone,
  deleteById,
};
