import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

const isWebhookRoute = createRouteMatcher(["/api/webhooks/(.*)"]);

export default clerkMiddleware((auth, request) => {
	if (!isPublicRoute(request) && !isWebhookRoute(request)) {
		auth().protect();
	}
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};