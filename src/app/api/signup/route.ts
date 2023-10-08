/* eslint @typescript-eslint/no-var-requires: "off" */
import prisma from "../../../../prisma/client"
const bcrypt = require("bcryptjs")

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json() as { username: string, email: string, password: string }
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ msg: "All fields should be filled" }), { status: 400 })
    }


    const user = await prisma.user.findFirst({
      where: {
        OR: [{
          username,
          email
        }
        ]
      }
    })

    if (user) {
      return new Response(JSON.stringify({ msg: "A user with that username or email already exists" }))
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash
      }
    });

    return new Response(JSON.stringify({ msg: "Successfull signup", newUser }), { status: 200 })
  } catch (e) {
    return new Response(e as string, { status: 500 })
  }
}
