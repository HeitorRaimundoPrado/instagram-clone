
import prisma from "../../../../prisma/client"
import bcrypt from 'bcryptjs'
import { createHash } from 'node:crypto'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

const generateToken = (userId: number) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY_NEXT, { expiresIn: '1h' })
  return token;
}

const setTokenCookie = (res: Response, token: string) => {
  res.headers.set(
    "Set-Cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      maxAge: 60 * 60,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    })
  )
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json() as { username: string, email: string, password: string }
    if (!email || !password) {
      return new Response(JSON.stringify({ msg: "All fields should be filled" }), { status: 400 })
    }


    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })


    if (!user) {
      return new Response(JSON.stringify({ msg: "Email is not registered" }), { status: 404 })
    }

    try {
      const match = await new Promise((resolve, reject) => {
        bcrypt.compare(password, user.passwordHash, function(err: any, r: any): any {
          if (err) {
            reject(err)
          }
          if (r == true) {
            resolve(r)
          }
        })
      })

      if (match) {
        const res = new Response(JSON.stringify({ msg: "Successfull login" }), { status: 200 })
        setTokenCookie(res, generateToken(user.id));
        return res;
      }

      return new Response(JSON.stringify({ msg: "incorrect password" }), { status: 401 });

    } catch (e) {
      return new Response(e as string, { status: 500 })
    }


  } catch (e) {
    return new Response(e as string, { status: 500 })
  }
}
