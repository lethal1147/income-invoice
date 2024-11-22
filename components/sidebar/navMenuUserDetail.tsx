"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import defaultUserImage from "@/public/userDefault.png";
import { useSession } from "next-auth/react";

export default function NavMenuUserDetail() {
  const { data: session } = useSession();
  return (
    <>
      <Avatar className="size-40">
        <AvatarImage
          className="size-40"
          src={session?.user?.image || ""}
          alt="user's profile"
        />
        <AvatarFallback>
          <Image src={defaultUserImage} alt="user default image" />
        </AvatarFallback>
      </Avatar>
      <p className="text-lg my-3 text-center">{session?.user?.name}</p>
    </>
  );
}
