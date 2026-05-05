import {prisma} from "@/lib/prisma"
import bcrypt from 'bcrypt'

export async function POST(request: Request, response: Response) {
    const data = await request.json()
    const { email, name, address, cpf, phone } = data

    if (!email || !name) {
        console.log("Missing required fields")
        return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if(existingUser) {
        console.log("User already exists")
        return Response.json({ error: "User already exists" }, { status: 400 })
    }

    //const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email,
            name,
            //password: hashedPassword,
            address,
            cpf,
            phone
        }
    })

    return Response.json(user)
}