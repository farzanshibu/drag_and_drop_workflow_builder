"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import CustomUserButton from "./user-button";

type Props = {};

const Navbar = (props: Props) => {
  const { user } = useUser();
  useEffect(() => {
    if (!user) {
      if (localStorage.getItem("workflow-storage"))
        localStorage.removeItem("workflow-storage");
    }
  }, [user]);

  return (
    <header className="fixed top-0 left-0 right-0 z-10  py-4 px-4 flex items-center bg-transparent justify-between">
      <aside className="flex items-center gap-[2px]">
        <p className="text-3xl font-bold text-slate-50">WorkFlow Builder</p>
      </aside>

      <aside className="flex items-center gap-4">
        <Link
          href={user ? "/dashboard" : "/sign-up"}
          className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            {user ? "Dashboard" : "Get Started"}
          </span>
        </Link>
        {!user ? (
          <Link
            href="/sign-in"
            className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Login
            </span>
          </Link>
        ) : null}
        <CustomUserButton />
      </aside>
    </header>
  );
};

export default Navbar;
