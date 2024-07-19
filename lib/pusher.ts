import PusherClient from "pusher-js";
import PusherServer from "pusher";

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: "ap2",
  useTLS: true,
});

export const pusherClient = new PusherClient(process.env.PUSHER_APP_KEY!, {
  cluster: "ap2", // Your Pusher cluster
});