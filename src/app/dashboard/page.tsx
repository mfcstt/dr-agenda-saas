import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/src/lib/auth";

import SignOutButton from "./components/sign-out-button";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  {
    if (!session?.user) {
      redirect("/authentication");
    }
    return (
      <div className="flex flex-col items-center justify-center h-screen p-y-8">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg">Welcome to your dashboard!</p>
        <h1>{session?.user?.name}</h1>
        <SignOutButton />
      </div>
    );
  }
};

export default DashboardPage;
