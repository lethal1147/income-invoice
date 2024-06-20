"use server";

export async function login(data: FormData) {
  console.log("server action");
  console.log(data);

  return {
    status: "success",
    message: `Welcome, ${data.get("email")}!`
  }
}
