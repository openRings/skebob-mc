import { handleApiError } from "./api";

export const signup = async (
  nickname: string,
  password: string,
  repeatPassword: string,
) => {
  const response = await fetch("/api/signup", {
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
  await handleApiError(response);
  return response;
};

export const signin = async (nickname: string, password: string) => {
  const response = await fetch("/api/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname, password }),
  });
  await handleApiError(response);
  return response;
};
