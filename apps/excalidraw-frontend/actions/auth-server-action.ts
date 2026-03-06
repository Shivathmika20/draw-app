"use server";
import { SigninSchema, SignupSchema } from "@repo/common-types";
import { z } from "zod";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_HTTP_BACKEND

export const SignupAction = async (values: z.infer<typeof SignupSchema>) => {
	try {
		const res = await fetch(`${BACKEND_URL}/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const data = await res.json();
		console.log(data);
		if (!res.ok) {
			return { success: false, message: data.message };
		}
		return { success: true, message: data.message };
	} catch (e) {
		return { success: false, message: "Failed to signup" };
	}
};

export const SigninAction = async (values: z.infer<typeof SigninSchema>) => {
	console.log("SERVER ACTION CALLED");
	try {
		const res = await fetch(`${BACKEND_URL}/auth/signin`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const data = await res.json();
		console.log(data);
		if (!res.ok) {
			return { success: false, message: data.message };
		}

		const cookieStore = await cookies();

		cookieStore.set({
			name: "token",
			value: data.token,
			httpOnly: true,
			secure: false,
			maxAge: 60 * 60 * 24 * 30,
			path: "/",
		});
		console.log("COOKIE SET", cookieStore.get("token"));
		return { success: true, message: data.message };
	} catch (e) {
		return { success: false, message: "Failed to signin" };
	}
};
