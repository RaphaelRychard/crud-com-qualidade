import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";
import { todosRepository } from "@server/repository/todos";
import { HttpNotFoundError } from "@server/infra/errors";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;

  const page = Number(query.page);
  const limit = Number(query.limit);

  if (query.page && isNaN(page)) {
    res.status(400).json({
      error: {
        message: "`page` must be a number",
      },
    });

    return;
  }

  if (query.limit && isNaN(limit)) {
    res.status(400).json({
      error: {
        message: "`limit` must be a number",
      },
    });

    return;
  }

  const output = todosRepository.get({
    page: Number(query.page),
    limit: Number(query.limit),
  });

  res.status(200).json({
    total: output.total,
    pages: output.pages,
    todos: output.todos,
  });
}

const TodoCreateBodySchema = schema.object({
  content: schema.string(),
});

async function create(req: NextApiRequest, res: NextApiResponse) {
  const body = TodoCreateBodySchema.safeParse(req.body);

  if (!body.success) {
    res.status(400).json({
      error: {
        massage: "You need to provider a content to create a TODO",
        description: body.error.issues,
      },
    });
    return;
  }

  const createdTodo = await todosRepository.createByContent(body.data.content);

  res.status(201).json({ todo: createdTodo });
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
