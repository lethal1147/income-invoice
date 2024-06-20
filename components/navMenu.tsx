"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import defaultUserImage from "@/public/userDefault.png";

export default function NavMenu() {
  const location = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session || !session.user) {
      router.push("/");
    }
  }, [router, session]);

  const image = session?.user?.image || "";

  return (
    <aside className="min-h-screen bg-gray-200 w-52 p-5 flex flex-col gap-3">
      <div className="w-full">
        <Avatar className="size-40">
          <AvatarImage className="size-40" src={image} alt="user's profile" />
          <AvatarFallback>
            <Image src={defaultUserImage} alt="user default image" />
          </AvatarFallback>
        </Avatar>
        <p className="text-lg my-3">{session?.user?.name}</p>
      </div>
      <Link
        className={cn(
          "px-5 py-3 rounded-md transition hover:bg-gray-300 w-full",
          {
            "bg-gray-400 hover:bg-gray-400": location.startsWith("/dashboard"),
          }
        )}
        href={"/dashboard"}
      >
        Dashboard
      </Link>
      <Link
        className={cn(
          "px-5 py-3 rounded-md transition hover:bg-gray-300 w-full",
          {
            "bg-gray-400 hover:bg-gray-400": location.startsWith("/expense"),
          }
        )}
        href={"/expense"}
      >
        Expense
      </Link>

      <Button
        className="mt-auto px-0 mx-auto text-red-500 transition"
        variant={"link"}
        onClick={() => signOut()}
      >
        Sign out
      </Button>
    </aside>
  );
}
