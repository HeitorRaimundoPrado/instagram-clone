import { verifyTokenMiddleware } from 'src/utils/verifyToken'
import prisma from "prisma/client"

export async function POST(req: Request) {
  const body = await req.json() as { content: string, file: string };
  const userId = verifyTokenMiddleware(req);

  if (!userId) {
    return new Response(JSON.stringify({ msg: "login to post" }), { status: 401 })
  }

  const post = await prisma.post.create({
    data: {
      userId,
      content: body.content,
      attachedFile: body.file

    }
  })

  return new Response(JSON.stringify({ msg: "post created successfully", post }), { status: 200 })
}
