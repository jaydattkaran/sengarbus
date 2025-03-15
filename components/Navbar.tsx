"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  useUser,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

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
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, dropdownOpen]);

  return (
    <div className="relative">
      <div
        className="border-b
        w-[100vw] md:w-[90vw] flex flex-row 
        justify-between px-6 h-14 items-center z-50
        backdrop-blur-3xl"
      >
        <div className="flex justify-between">
          <Link href="/">
            <Button variant={"secondary"} className="cursor-pointer">
              Logo
            </Button>
          </Link>
       
        </div>
        <div className="flex md:gap-4 gap-1 items-center space-x-2 font-semibold">
          {isSignedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-4 py-2 bg-transparent rounded-md cursor-pointer border transition"
              >
                {user?.firstName || "User"}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2">
                  <Link
                  href="/account"
                  className="block px-4 py-1 text-gray-700 hover:bg-gray-100">
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
        </div>
      </div>
    </div>
  );
}

export default Navbar;
