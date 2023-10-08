import { verifyTokenMiddleware } from '@/utils/verifyToken';
import prisma from '../../../../prisma/client'

export async function POST(req: Request) {
  const body = await req.json() as { postId: number, content: string };
  const userId = verifyTokenMiddleware(req);

  if (!userId) {
    return new Response(JSON.stringify({ msg: "not logged in, login to reply" }), { status: 401 })
  }

  const reply = prisma.reply.create({
    data: {
      postId: body.postId,
      content: body.content,
      userId: userId,
    }
  })

  return new Response(JSON.stringify({ msg: "reply created successfully", reply }), { status: 200 })
}
