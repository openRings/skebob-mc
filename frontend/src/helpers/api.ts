export async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!response.ok) {
      let errorMessage: string = "Что-то пошло не так :(";
      if (response.status === 401) {
        try {
          const newToken = await renewToken();

          return await request<T>(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        } catch (err) {
          throw err;
        }
      }
      throw new Error(`Ошибка ${response.status}: ${errorMessage}`);
    }
    return (await response.json()) as T;
  } catch (err) {
    throw err;
  }
}

async function renewToken(): Promise<string> {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  try {
    const response = await fetch(`${BASE_URL}/api/renewal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error("Не удалось обновить токен");
    }

    const data = await response.json();
    const newToken = data.accessToken;
    localStorage.setItem("access_token", newToken);
    return newToken;
  } catch (err) {
    throw err;
  }
}
