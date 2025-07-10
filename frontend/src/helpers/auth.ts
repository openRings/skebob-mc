export const signup = async (
  nickname: string,
  password: string,
  passwordRepeat: string,
) => {
  return await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nickname,
      password,
      password_repeat: passwordRepeat,
    }),
  });
};

export const signin = async (nickname: string, password: string) => {
  return await fetch("/api/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname, password }),
  });
};

export const handleApiError = async (response: Response): Promise<void> => {
  if (!response.ok) {
    const errorText = await response.text();
    let message;
    try {
      const { error: serverError } = JSON.parse(errorText);
      message = serverError || response.statusText;
    } catch {
      message = errorText || "Неизвестная ошибка";
    }
    if (response.status === 401) {
      throw new Error("Авторизуйтесь еще раз!");
    }
    throw new Error(message);
  }
};
