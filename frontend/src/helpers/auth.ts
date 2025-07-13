import { request } from "./api";

export const signup = async (
  nickname: string,
  password: string,
  repeatPassword: string,
) => {
  await request("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nickname,
      password,
      password_repeat: repeatPassword,
    }),
  });
};

export interface SigninResponse {
  accessToken: string;
}

export const signin = async (nickname: string, password: string) => {
  try {
    const { accessToken } = await request<SigninResponse>("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, password }),
    });
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }
  } catch (err) {
    throw new Error("Ошибка при входе");
  }
};
