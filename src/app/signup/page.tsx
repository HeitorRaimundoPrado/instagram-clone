"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as React from 'react'

export default function SignUp() {
  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const { push } = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/signup", { method: "POST", body: JSON.stringify(form) }).
      then(res => {
        if (res.status === 200) {
          push("/login")
        }
      })
  }

  const inputFieldStyle = "m-1 p-2 rounded-md w-full";
  return (
    <div className="flex justify-center items-center h-full w-full">
      <form onSubmit={handleSubmit} className="text-black flex flex-col w-2/5 items-center">
        <input type="text"
          placeholder="username"
          onChange={(e) => { setForm({ ...form, username: e.target.value }) }}
          className={inputFieldStyle} />

        <input type="email"
          placeholder="email"
          onChange={(e) => { setForm({ ...form, email: e.target.value }) }}
          className={inputFieldStyle} />

        <input type="password"
          placeholder="password"
          onChange={(e) => { setForm({ ...form, password: e.target.value }) }}
          className={inputFieldStyle} />

        <button className="text-white bg-neutral-800 mt-2 p-3 rounded-lg w-2/5">Sign Up</button>
      </form>

    </div>
  )
}
