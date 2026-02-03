"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

const TooltipProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(function TooltipTrigger({ className, children, asChild, ...props }, ref) {
  const ctx = React.useContext(TooltipContext);
  const [show, setShow] = React.useState(false);

  const child = React.isValidElement(children) ? children : <div>{children}</div>;
  const trigger = React.cloneElement(child as React.ReactElement<{ ref?: React.Ref<unknown>; onMouseEnter?: () => void; onMouseLeave?: () => void }>, {
    ref,
    onMouseEnter: () => {
      setShow(true);
      ctx?.setOpen(true);
    },
    onMouseLeave: () => {
      setShow(false);
      ctx?.setOpen(false);
    },
  });

  return <div className={cn("inline-block", className)} {...props}>{trigger}</div>;
});

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { side?: "top" | "bottom" | "left" | "right" }
>(function TooltipContent({ className, side = "top", ...props }, ref) {
  const [visible, setVisible] = React.useState(false);
  const ctx = React.useContext(TooltipContext);

  React.useEffect(() => {
    const t = setTimeout(() => setVisible(!!ctx?.open), 0);
    return () => clearTimeout(t);
  }, [ctx?.open]);

  if (!visible && !ctx?.open) return null;

  const positionClass = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      ref={ref}
      role="tooltip"
      className={cn(
        "absolute z-50 rounded-lg border border-gray-200 bg-gray-900 px-3 py-2 text-xs text-white shadow-md",
        positionClass[side],
        className
      )}
      {...props}
    />
  );
});

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
