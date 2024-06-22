import { SignedIn, UserButton } from "@clerk/nextjs";

export default function CustomUserButton() {
  return (
    <>
      <SignedIn>
        <UserButton
          showName={true}
          appearance={{
            elements: {
              userButtonBox: "ml-2",
              userButtonAvatarBox: "w-10 h-10",
            },
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
    </>
  );
}
