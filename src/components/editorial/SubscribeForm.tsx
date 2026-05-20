import type { ReactNode } from "react";

interface SubscribeFormProps {
  size?: "default" | "lg";
  placeholder?: string;
  socialProof?: ReactNode;
}

export function SubscribeForm({
  size = "default",
  placeholder = "you@yourbook.com",
  socialProof,
}: SubscribeFormProps) {
  const isLg = size === "lg";
  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex max-w-[520px] border border-foreground"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          placeholder={placeholder}
          required
          className={`flex-1 bg-transparent font-mono uppercase tracking-[0.05em] text-foreground outline-none placeholder:text-muted-foreground ${
            isLg ? "px-5 py-4 text-[13px]" : "px-4 py-3 text-[11px]"
          }`}
        />
        <button
          type="submit"
          className={`cursor-pointer bg-foreground font-mono uppercase tracking-[0.1em] text-background transition-colors duration-200 hover:bg-accent ${
            isLg ? "px-7 text-[12px]" : "px-5 text-[11px]"
          }`}
        >
          Subscribe →
        </button>
      </form>
      {socialProof ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {socialProof}
        </p>
      ) : null}
    </div>
  );
}
