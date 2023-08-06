import { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";

type ButtonProps = PropsWithChildren<{
  className?: string;
  onClick: () => void;
  selected?: boolean;
  variant: "icon" | "token" | "card";
}>;

const variants = ({ selected }: { selected?: boolean }) => ({
  icon: cn("h-9 rounded-md bg-slate-100 px-3 text-slate-900", selected && "bg-slate-300/70"),
  token:
    "bg-slate-50 hover:bg-slate-200 border border-slate-200 hover:text-slate-900 h-10 px-4 py-2",
  card: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2",
});

export const Button = ({ className, children, onClick, selected, variant }: ButtonProps) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium",
      variants({ selected })[variant],
      className
    )}
    onClick={() => onClick()}
  >
    {children}
  </button>
);
