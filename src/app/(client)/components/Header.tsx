"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/DarkMode";

function Header() {
  const pathname = usePathname();
  const session = useSession();
  //console.log("session", session);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/Aboutus" },
    { label: "Offers", href: "/Offers" },
    { label: "Orders", href: "/Orders" },
  ];

  return (
    <header className="relative shadow-lg shadow-amber-700 ">
      <div className="fixed z-10 right-6 top-5">
        <ThemeToggle />
      </div>
      <nav className="flex h-14 items-center justify-center">
        <ul className="flex items-center justify-center gap-6">
          {navItems.map((item) => (
            <li
              key={item.href}
              className={cn(
                "text-brown-300 underline-offset-4 transition-all hover:cursor-pointer hover:text-brown-900 hover:underline",
                pathname === item.href &&
                  "font-semibold text-brown-900 underline"
              )}
            >
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
          <li className="text-brown-300 underline-offset-4 transition-all hover:cursor-pointer hover:text-brown-900 hover:shadow-lg ">
            {session.status === "authenticated" ? (
              <button onClick={() => signOut()} className="px-4 py-1 rounded-lg hover:shadow-lg hover:shadow-red-700 transition-shadow">Logout</button>
            ) : (
              <Link href="/api/auth/signin" className="px-4 py-1 rounded-lg hover:shadow-lg hover:shadow-green-700 transition-shadow">Sign in</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
