"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { signOutAction } from "@/app/actions/auth";
import NavMenuUserDetail from "./navMenuUserDetail";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import NavDialogForm from "./navDialogForm";
import useWalletStore from "@/stores/walletStore";
import { useSession } from "next-auth/react";

export default function NavMenu() {
  const location = usePathname();
  const { data: session } = useSession();
  const { getWalletList, walletDropdown, wallet, selectWallet } =
    useWalletStore();
  useEffect(() => {
    const getWalletListHandler = async () => {
      if (!session?.user?.id) return;
      getWalletList(session?.user?.id);
    };
    getWalletListHandler();
  }, [session?.user?.id]);

  return (
    <aside className="min-h-screen bg-gray-200 w-52 p-5 flex flex-col gap-3">
      <div className="w-full">
        <NavMenuUserDetail />
      </div>
      <div className="my-5">
        <NavDialogForm />
        <Select onValueChange={(val) => selectWallet(val)} value={wallet?.id}>
          <SelectTrigger className="bg-transparent">
            <SelectValue placeholder="Wallet" />
          </SelectTrigger>
          <SelectContent>
            {walletDropdown.map((opt) => (
              <SelectItem key={opt.value} value={opt.value.toString()}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {}
      </div>

      <Link
        className={cn(
          "px-5 py-3 rounded-md transition hover:bg-gray-300 w-full",
          {
            "bg-green-main text-white hover:bg-green-main":
              location.startsWith("/dashboard"),
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
            "bg-green-main text-white hover:bg-green-main":
              location.startsWith("/expense"),
          }
        )}
        href={"/expense"}
      >
        Transactions
      </Link>

      <form className="mt-auto px-0 mx-auto " action={signOutAction}>
        <Button
          className="text-red-500 transition"
          variant={"link"}
          type="submit"
        >
          Sign out
        </Button>
      </form>
    </aside>
  );
}
