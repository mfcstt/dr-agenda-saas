"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { authClient } from "@/src/lib/auth-client";

const SignOutButton = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/authentication");
            },
          },
        });
      }}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
