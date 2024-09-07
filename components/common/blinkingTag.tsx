import { cn } from "@/lib/utils";

type BlinkingTagProps = {
  className?: string;
  text: string;
};

export default function BlinkingTag({ className, text }: BlinkingTagProps) {
  return (
    <div className={cn("inline-block", className)}>
      <span className="inline-flex items-center rounded-md bg-red-500 px-1.5 py-1 text-xs text-white animate-blink">
        {text}
      </span>
    </div>
  );
}
