// import { UserButton, currentUser } from "@clerk/nextjs";
import Link from "next/link";

type Props = {};

const Navbar = async (props: Props) => {
  // TODO - Fix this User From Clerk Auth
  const user = null;
  //   const user = await currentUser();
  return (
    <header className="fixed top-0 left-0 right-0 z-10  py-4 px-4 flex items-center bg-transparent justify-between">
      <aside className="flex items-center gap-[2px]">
        <p className="text-3xl font-bold text-slate-50">WorkFlow Builder</p>
      </aside>

      <aside className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            {user ? "Dashboard" : "Get Started"}
          </span>
        </Link>
        {/* {user ? <UserButton afterSignOutUrl="/" /> : null} */}
      </aside>
    </header>
  );
};

export default Navbar;
