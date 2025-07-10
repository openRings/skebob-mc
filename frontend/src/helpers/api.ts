export const handleApiError = async (
  response: Response,
  retryCallback?: () => Promise<Response>,
): Promise<void> => {
  if (!response.ok) {
    const errorText = await response.text();
    let message: string;

    try {
      const { error: serverError } = JSON.parse(errorText);
      message = serverError || response.statusText;
    } catch {
      message = errorText || "Неизвестная ошибка";
    }

    if (response.status === 401) {
      if (retryCallback) {
        const tokenRenewed = await renewAccessToken();
        if (tokenRenewed) {
          const retryResponse = await retryCallback();
          if (retryResponse.ok) {
            return;
          }
          const retryErrorText = await retryResponse.text();
          try {
            const { error: retryError } = JSON.parse(retryErrorText);
            message = retryError || retryResponse.statusText;
          } catch {
            message =
              retryErrorText || "Неизвестная ошибка после обновления токена";
          }
        }
      }
      throw new Error("UNAUTHORIZED");
    }
    throw new Error(message);
  }
};

export const apiFetcher = async (
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0,
  maxRetries = 3,
): Promise<any> => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("Отсутствует токен авторизации");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(endpoint, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 401 && retryCount < maxRetries) {
      console.log("piska piska");
      const tokenRenewed = await renewAccessToken();
      if (tokenRenewed) {
        return await apiFetcher(endpoint, options, retryCount + 1, maxRetries);
      }
      throw new Error("Авторизуйтесь еще раз!");
    }

    await handleApiError(response);
    const contentType = response.headers.get("Content-Type");
    return contentType?.includes("application/json") ? response.json() : null;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Неизвестная ошибка");
  } finally {
    clearTimeout(timeoutId);
  }
};

const renewAccessToken = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/renewal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem("access_token", data.accessToken);
        console.log(data.accessToken);
        return true;
      }
      return false;
    }
    return false;
  } catch {
    return false;
  }
};
