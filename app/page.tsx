"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginBodySchemaType, loginBodySchema } from "@/schema/login";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import "./globals.css";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { login } from "./actions/user";

export default function Home() {
  const form = useForm<LoginBodySchemaType>({
    resolver: zodResolver(loginBodySchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    const test = await login(formData);
  });

  return (
    <main className=" h-screen w-screen flex justify-center items-center loginBackGround text-gray-800">
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="w-96 bg-white border shadow-xl p-10 rounded-xl flex flex-col gap-3"
        >
          <h1 className="text-2xl font-semibold">Login</h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {/* <div className="flex justify-between"> */}
          {/* <div className="flex items-center space-x-2">
              <Checkbox id="persists" />
              <Label htmlFor="persists">Remember me</Label>
            </div> */}
          <Button className="self-end px-0 underline" variant="link">
            Forget your password
          </Button>
          {/* </div> */}
          <Button>Login</Button>
          <div className="relative flex items-center my-2">
            <div className="h-0.5 w-full bg-gray-200" />
            <span className="text-gray-200 bg-white absolute left-1/2 transform -translate-x-1/2 px-1">
              OR
            </span>
          </div>
          <Button variant="outline">Login with Google</Button>
          <div className="flex items-center gap-1 justify-center">
            <span>Don&apos;t have an account?</span>
            <Button className="underline px-0" variant="link">
              Sign up
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
