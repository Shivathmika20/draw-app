"use server";
import { SigninSchema, SignupSchema } from "@repo/common-types";
import { z } from "zod";
import { cookies } from "next/headers";

export const SignupAction = async (values: z.infer<typeof SignupSchema>) => {
	try {
		const res = await fetch("http://localhost:3001/auth/signup", {
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
		const res = await fetch("http://localhost:3001/auth/signin", {
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
