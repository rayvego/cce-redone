import Image from "next/image";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<main className={"flex min-h-screen w-full justify-center items-center"}>
			{children}
		</main>
	);
}