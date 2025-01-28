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
import { useForm } from "react-hook-form";
import "./globals.css";
import { login } from "./actions/authen/";
import { signIn } from "next-auth/react";
import Link from "next/link";
import useStatus from "@/hooks/useStatus";
import { apiStatus } from "@/constant/status";
import Loader from "@/components/common/loader";
import LoaderOverLay from "@/components/common/loaderOverlay";
import ErrorCard from "@/components/common/errorCard";

export default function Home() {
  const form = useForm<LoginBodySchemaType>({
    resolver: zodResolver(loginBodySchema),
  });
  const { isPending, isError, setStatus } = useStatus(apiStatus.IDLE);

  const onSubmit = form.handleSubmit(async (data) => {
    setStatus(apiStatus.PENDING);
    const response = await login(data);
    if (response?.error) {
      setStatus(apiStatus.ERROR);
    } else {
      setStatus(apiStatus.SUCCESS);
    }
  });

  const onCloseError = () => {
    setStatus(apiStatus.IDLE);
  };

  return (
    <main className=" h-screen w-screen flex justify-center items-center loginBackGround text-gray-800">
      {/* {isPending && <LoaderOverLay />} */}
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
          <Button disabled className="self-end px-0 underline" variant="link">
            Forget your password
          </Button>
          {isError && (
            <ErrorCard
              errorText="Incorrect email or password."
              onClose={onCloseError}
            />
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Loging in..." : "Login"}
          </Button>
          <div className="relative flex items-center my-2">
            <div className="h-0.5 w-full bg-gray-200" />
            <span className="text-gray-200 bg-white absolute left-1/2 transform -translate-x-1/2 px-1">
              OR
            </span>
          </div>
          <Button
            disabled={isPending}
            type="button"
            onClick={() => signIn("google")}
            variant="outline"
          >
            Login with Google
          </Button>
          <Button
            disabled={isPending}
            type="button"
            onClick={() => signIn("github")}
            variant="outline"
          >
            Login with Github
          </Button>
          <div className="flex items-center gap-1 justify-center">
            <span>Don&apos;t have an account?</span>
            <Button asChild className="underline px-0" variant="link">
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
