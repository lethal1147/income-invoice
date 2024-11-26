"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function CopyButton() {
  const [text, setText] = useState("Share");
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    if (copying) {
      const timer = setTimeout(() => {
        console.log("test");
        setText("Share");
        setCopying(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [copying]);

  const onClickCopy = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setText("Copied!");
      setCopying(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Button
      type="button"
      className={cn("w-40 flex gap-3 transition-all", {
        "!bg-green-800": copying,
      })}
      onClick={onClickCopy}
    >
      <Link />
      {text}
    </Button>
  );
}
