import { API_BASE_URL } from "../config";

interface LoginCredentials {
  name: string;
  email: string;
}

export async function login(credentials: LoginCredentials): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return true;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function logout(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}
