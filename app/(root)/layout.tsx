import { redirect } from "next/navigation";
import {getUserInfo} from "@/lib/actions/user.actions";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const loggedIn = await getUserInfo();

	if (!loggedIn) {
		redirect("/sign-in");
	}

	return (
		<main className={"flex w-full h-screen"}>
			{children}
		</main>
	);
}