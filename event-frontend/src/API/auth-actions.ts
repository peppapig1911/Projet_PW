import type { LoginResponse, User } from "../utils/types.ts";


const API_BASE_URL = "http://localhost:5143";

export async function login(username: string, password: string): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        throw new Error("Invalid credentials");
    }
    const data: LoginResponse = await res.json();
    localStorage.setItem("token", data.token);

    return data.token;
}

export async function validateToken(): Promise<User> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("no token");

    const cleanToken = token.replace(/^"|"$/g, '');

    const res = await fetch("http://localhost:5143/api/me", {
        method: "GET", // Précise bien la méthode
        headers: {
            "Authorization": `Bearer ${cleanToken}`,
            "Content-Type": "application/json"
        },
    });

    if (!res.ok) {
        throw new Error("Invalid token");
    }

    return await res.json();
}