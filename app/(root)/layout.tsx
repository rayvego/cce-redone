import { redirect } from "next/navigation";
import { getUserInfo } from "@/lib/actions/user.actions";
import Nav from "@/components/Nav";
import Image from "next/image";
import Link from "next/link";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const loggedIn = await getUserInfo();

  if (!loggedIn) {
    redirect("/sign-in");
  }

  return (
    <main className={"flex w-full h-screen"}>
      <div className={"flex flex-col size-full"}>
        <div className={"root-layout"}>
          <Link href="/">
            <Image src={"/icons/logo.svg"} width={100} height={100} alt={"logo"} />
          </Link>
          <div>
            <Nav />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}