import { redirect } from "next/navigation";
import {getUserInfo} from "@/lib/actions/user.actions";
import Nav from "@/components/Nav";
import Image from "next/image";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const loggedIn = await getUserInfo();

	if (!loggedIn) {
		redirect("/sign-in");
	}

	return (
		<main className={"flex w-full h-screen"}>
			<div className={"flex flex-col size-full"}>
				<div className={"root-layout"}>
					<Image src={"/icons/logo.svg"} width={100} height={100} alt={"logo"} />
					<div>
						<Nav/>
					</div>
				</div>
				{children}
			</div>
		</main>
	);
}