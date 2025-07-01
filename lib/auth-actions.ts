"use server"
import { signIn, signOut } from "@/auth"

export const login = async() => {
    console.log("Aadad")
    await signIn("github", { redirectTo:"/"})
}


export const logOut =  async() =>{
    await signOut({redirectTo: "/"})
}  