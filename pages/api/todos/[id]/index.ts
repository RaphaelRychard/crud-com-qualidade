import { NextApiRequest, NextApiResponse } from "next";
import { todoController } from "@server/controller/todo";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === "DELETE") {
    todoController.deleteById(request, response);
    return;
  }

  response.status(404).json({
    error: {
      message: "Method not allowed",
    },
  });
}
