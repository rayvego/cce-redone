import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
	}

	// Get the headers
	const headerPayload = headers();
	const svix_id = headerPayload.get("svix-id");
	const svix_timestamp = headerPayload.get("svix-timestamp");
	const svix_signature = headerPayload.get("svix-signature");

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error occurred in clerk webhook -- no svix headers", {
			status: 400,
		});
	}

	// Get the body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	// Create a new Svix instance with your secret.
	const wh = new Webhook(WEBHOOK_SECRET);

	let evt: WebhookEvent; // typescript hai na...

	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.error("Error verifying clerk webhook:", err);
		return new Response("Error occurred in clerk webhook", {
			status: 400,
		});
	}

	// Do something with the payload
	// // For this guide, you simply log the payload to the console
	// const { id } = evt.data;
	// const eventType = evt.type;
	// console.log(`Clerk Webhook with and ID of ${id} and type of ${eventType}`);
	// console.log("Clerk Webhook body:", body);

	const eventType = evt.type;

	if (eventType === "user.created") {
		let user;
		try {
			await connectToDatabase();
			const email = payload.data.email_addresses[0]?.email_address;
			let githubUsername = payload.data.external_accounts[0]?.username;

			if (githubUsername) {
				const username = payload.data.username + "@github";
				user = new User({
					externalId: payload.data.id,
					username,
					githubUsername,
					imageUrl: payload.data.image_url,
				});
			} else if (email) {
				user = new User({
					externalId: payload.data.id,
					username: payload.data.username,
					email,
					imageUrl: payload.data.image_url,
				});
			} else {
				throw new Error("No email or GitHub username provided");
			}
			await user.save();
			console.log("User created:", user);
		} catch (error) {
			console.error("Error saving user to the database:", error);
			return new Response("Database error", {
				status: 500,
			});
		}
	}

	if (eventType === "user.deleted") {
		try {
			await connectToDatabase()
			const externalId = payload.data.id;
			const user = await User.findOne({ externalId });
			if (!user) {
				throw new Error("User not found");
			}
			await user.deleteOne()
			console.log("User deleted:", user)
		} catch (error : any) {
			console.error("Error deleting user:", error);
			return new Response("Database error", {
				status: 500
			})
		}
	}

	if (eventType === "user.updated") {
		try {
			await connectToDatabase()
			const externalId = payload.data.id;
			const user = await User.findOne({ externalId });
			if (!user) {
				throw new Error("User not found");
			}
			user.imageUrl = payload.data.image_url;
			user.username = payload.data.username;
			await user.save()
			console.log("User updated:", user)
		} catch (error : any) {
			console.error("Error updating user:", error);
			return new Response("Database error", {
				status: 500
			})
		}
	}

	return new Response("", { status: 200 });
}