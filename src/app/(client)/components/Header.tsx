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
    { label: "About Us", href: "/aboutus" },
    { label: "Offers", href: "/offers" },
    { label: "Best Selling", href: "/best-selling" },
    { label: "Orders", href: "/account/orders" },
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
          <li className="text-brown-300 underline-offset-4 transition-all hover:cursor-pointer hover:text-brown-900 hover:underline">
            {session.status === "authenticated" ? (
              <button onClick={() => signOut()}>Logout</button>
            ) : (
              <Link href="/api/auth/signin"> Sign in</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
