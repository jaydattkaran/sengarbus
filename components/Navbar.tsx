"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { ModeToggle } from "./ui/theme";
import Image from "next/image";

export function Navbar() {
  const { isSignedIn, user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const closeMenu = () => setIsMenuOpen(false);
  const closeDropdown = () => setDropdownOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(target)) {
        closeMenu();
      }
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, dropdownOpen]);

  return (
    <div className="relative mt-4">
      <div
        className="border-b
        w-[95vw] md:w-[90vw] flex flex-row 
        justify-between px-2 h-10 items-center z-50
        backdrop-blur-3xl pb-2"
      >
        <div className="flex justify-between">
          <Link href="/">
            <Image
              src="/download.png"
              alt="Logo"
              width={40}
              height={40}
               className="invert-0 dark:invert"
            />
          </Link>
        </div>
        <div className="flex md:gap-4 gap-1 items-center space-x-2 font-semibold">
          {isSignedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-2 py-1 text-sm md:text-md bg-transparent rounded cursor-pointer border transition"
              >
                {user?.firstName || "User"}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2">
                  <Link
                    href="/account"
                    className="block px-4 py-1 text-gray-700 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <SignOutButton>
                    <button className="block w-full text-left px-4 py-1 text-gray-700 hover:bg-gray-100">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              )}
            </div>
          ) : (
            <SignInButton mode="modal" />
          )}
          <div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
