import { request } from "./api";

interface ProfileResponse {
  nickname: string;
  maxInvites: number;
  createdAt: Date;
  invited: string | null;
}

interface InviteResponse {
  name: string;
  code: string;
  created_at: Date;
  used_by: string | null;
}

interface InviteCodeInfoResponse {
  created_by: string;
  used_by: string;
}

export const fetchProfile = async () => {
  try {
    const response = await request<ProfileResponse>("/api/profile");
    return response;
  } catch (err) {
    throw new Error("Не удалось загрузить профиль");
  }
};

export const fetchInvites = async () => {
  try {
    const response = await request<InviteResponse[]>("/api/invites");
    return response;
  } catch (err) {
    throw new Error("Не удалось загрузить приглашения");
  }
};

export const createInvite = async (name: string) => {
  try {
    const response = await request("/api/invites", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    return response;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

export const acceptInvite = async (inviteCode: string) => {
  try {
    const response = await request(`/api/invites/${inviteCode}`, {
      method: "POST",
    });
    return response;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

export const getInviteCodeInfo = async (
  inviteCode: string,
): Promise<InviteCodeInfoResponse> => {
  try {
    const response = await request(`/api/invites/${inviteCode}`);
    return response as InviteCodeInfoResponse;
  } catch (err) {
    throw new Error(`Код недоступен`);
  }
};
