"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CircleHelp, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="py-6 relative">
      <div
        className="border border-neutral-600 hover:border-neutral-400 rounded-lg
        duration-300 md:w-[80vw] w-[90vw] lg:w-[60vw] flex flex-row 
        justify-between px-4 py-4 h-14 items-center z-50
        backdrop-blur-3xl"
      >
        <div className="flex justify-between">
          <Link href="/">
           <Button variant={"secondary"} className="cursor-pointer">Logo</Button>
          </Link>
          {/* Desktop */}
        </div>
        <div className="flex md:gap-4 gap-1 items-center space-x-2 font-semibold">
          
          <Link href="/help">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="cursor-pointer">
                  <div className="flex gap-2 items-center">
                    <CircleHelp className="w-5 h-5"/>
                    <div className="text-sm md:text-lg">Help</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Contact Us</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <Link href="/account">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="cursor-pointer">
                  <div className="flex gap-2 items-center">
                    <User className="w-5 h-5"/>
                    <div className="text-sm md:text-lg">Account</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      className={`
        px-3 py-1 text-md relative inline-block
        ${
          isActive
            ? ""
            : "hover:text-neutral-600 dark:hover:text-neutral-400 duration-200"
        }
        after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
        after:w-0 after:h-0.5 after:bg-neutral-500 
        after:transition-all after:duration-300
        hover:after:w-3/4
      `}
      onClick={onClick}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </Link>
  );
}

export default Navbar;
