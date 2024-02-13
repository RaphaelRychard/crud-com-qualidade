import { todoController } from "@server/controller/todo";

export async function GET(request: Request) {
  return await todoController.get(request);
}

export async function POST(request: Request) {
  return await todoController.create(request);
}

// import { NextApiRequest, NextApiResponse } from "next";
// import { todoController } from "@server/controller/todo";
//
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method === "GET") {
//     await todoController.get(req, res);
//     return;
//   }
//
//   if (req.method === "POST") {
//     await todoController.create(req, res);
//     return;
//   }
//
//   res.status(405).json({
//     message: "Method not allowed",
//   });
// }
