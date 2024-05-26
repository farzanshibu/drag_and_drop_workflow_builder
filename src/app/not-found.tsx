import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link
        className="mt-4 shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
        href="/"
      >
        Return Home
      </Link>
    </div>
  );
}
