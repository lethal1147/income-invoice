"use client";

import PreviewImageUploader from "@/components/common/previewImageUploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterSchemaType, registerSchema } from "@/schema/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { CornerUpLeft } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { register } from "@/app/actions/authen";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useStatus from "@/hooks/useStatus";
import { apiStatus } from "@/constant/status";
import LoaderOverLay from "@/components/common/loaderOverlay";
import { useRouter } from "next/navigation";

export default function Register() {
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });
  const { isPending, setStatus } = useStatus(apiStatus.IDLE);
  const router = useRouter();

  const image = form.watch("image");

  const action = form.handleSubmit(async (data: RegisterSchemaType) => {
    try {
      setStatus(apiStatus.PENDING);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("password", data.password);
      formData.append("image", data.image as File);
      formData.append("email", data.email);
      const res = await register(formData);
      if (res.error) throw new Error(res.message);
      setStatus(apiStatus.SUCCESS);
      router.push("/");
    } catch (err) {
      setStatus(apiStatus.ERROR);
    }
  });

  return (
    <main className="h-screen w-screen flex justify-center items-center loginBackGround text-gray-800">
      {isPending && <LoaderOverLay />}
      <Form {...form}>
        <form
          onSubmit={action}
          className="min-w-[450px] grid grid-cols-3 bg-white border shadow-xl p-10 rounded-xl gap-3"
        >
          <div className="col-span-1">
            <Link
              role="button"
              href="/"
              className="size-8 rounded-full transition flex justify-center items-center hover:bg-gray-200 cursor-pointer"
            >
              <CornerUpLeft />
            </Link>
          </div>
          <h1 className="col-span-1 text-center text-2xl font-semibold">
            Register
          </h1>
          <FormField
            name="image"
            control={form.control}
            render={() => (
              <FormItem className="col-span-3 flex justify-center my-3">
                <FormControl className="size-[140px]">
                  <div>
                    <label className="size-full" htmlFor="image">
                      <div className="relative size-full">
                        <PreviewImageUploader image={image} />
                      </div>
                    </label>
                    <Input
                      className="hidden"
                      id="image"
                      type="file"
                      onChange={(e) => {
                        const { files } = e.target;
                        if (files && files[0]) {
                          form.setValue("image", files[0]);
                        }
                      }}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="example@email.com"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button className="mt-5" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}
