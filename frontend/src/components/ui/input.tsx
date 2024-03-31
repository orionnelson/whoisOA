import { MutableRefObject, forwardRef, useEffect, useState } from "react";

import { cn } from "../../lib/utils";
import { CgClose } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [expanded, setExpanded] = useState(false);

    const internalRef = ref as MutableRefObject<HTMLInputElement>;

    useEffect(() => {
      if (expanded && ref && internalRef.current) {
        internalRef.current?.focus();
      }
    }, [expanded, ref, internalRef]);

    return expanded ? (
      // if expanded
      <div className="relative">
        <div className="absolute top-3 right-2">
          <CgClose
            className="hover:text-violet-500 hover:cursor-pointer text-white"
            onClick={() => setExpanded(false)}
          />
        </div>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-3xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-7",
            className
          )}
          ref={internalRef}
          {...props}
        />
      </div>
    ) : (
      // if not expanded
      <div
        onClick={() => {
          setExpanded(true);
        }}
        className="size-10 flex flex-row items-center justify-center dark rounded-3xl border-violet-600 hover:border-2 hover:cursor-pointer"
      >
        <FaSearch className="text-white text-sm" />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
