"use client"
import { API } from "@/lib/axios"
import { User } from "@/types/user"
import { useRouter } from "next/navigation"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface AuthTypes {
  user: User[]
  handleRegister: (data: User) => Promise<void>
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthTypes)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUSer] = useState<User[]>([])
  const [password, setPassword] = useState("")
  const router = useRouter()

  async function handleRegister(data: User) {
    try {
      await API.post("auth/register", data)
    } catch (error) {
      console.error("Error registering user:", error)
    }
  }

  return(
    <AuthContext.Provider
    value={{
      user,
      handleRegister,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

