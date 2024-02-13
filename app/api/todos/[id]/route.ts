import { todoController } from "@server/controller/todo";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  return new Response(`Eu sou o id: ${id}`, {
    status: 200,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  return await todoController.deleteById(request, params.id);
}

// import { NextApiRequest, NextApiResponse } from "next";
// import { todoController } from "@server/controller/todo";
//
// export default async function handler(
//   request: NextApiRequest,
//   response: NextApiResponse,
// ) {
//   if (request.method === "DELETE") {
//     await todoController.deleteById(request, response);
//     return;
//   }
//
//   response.status(404).json({
//     error: {
//       message: "Method not allowed",
//     },
//   });
// }
