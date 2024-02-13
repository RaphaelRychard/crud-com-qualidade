export async function GET() {
  return new Response(JSON.stringify({ message: "message test" }), {
    status: 200,
  });
}

// import { NextApiRequest, NextApiResponse } from "next";
//
// export default function handler(
//   request: NextApiRequest,
//   response: NextApiResponse,
// ) {
//   response.status(200).json({
//     message: "Hello!",
//   });
// }
