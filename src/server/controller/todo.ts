import { NextApiRequest, NextApiResponse } from "next";
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

async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
  const todoId = req.query.id;

  if (!todoId || typeof todoId !== "string") {
    res.status(400).json({
      error: {
        message: "You must to provide a string ID",
      },
    });

    return;
  }

  try {
    const updatedTodo = await todosRepository.toggleDone(todoId);
    res.status(202).json({
      todo: updatedTodo,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({
        error: {
          message: err.message,
        },
      });
    }
  }
}

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
  const QuerySchema = schema.object({
    id: schema.string().trim().uuid().min(1),
  });

  const parsedQuey = QuerySchema.safeParse(req.query);

  if (!parsedQuey.success) {
    res.status(400).json({
      error: {
        message: `You must to providers a valid id`,
      },
    });
    return;
  }
  try {
    const todoId = parsedQuey.data.id;
    await todosRepository.deleteByd(todoId);
    res.status(204).end();
  } catch (err) {
    if (err instanceof HttpNotFoundError) {
      res.status(err.status).json({
        error: {
          message: err.message,
        },
      });
    }
    res.status(500).json({
      error: {
        message: `Internal server error`,
      },
    });
  }
}

export const todoController = {
  get,
  create,
  toggleDone,
  deleteById,
};
