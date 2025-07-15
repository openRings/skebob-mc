import {
  InviteCodeInfoResponse,
  InviteResponse,
  ProfileResponse,
} from "src/types/auth";
import { request } from "./api";

export const fetchProfile = async () => {
  try {
    const response = await request<ProfileResponse>("/api/profile");
    return response;
  } catch (err) {
    throw err;
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
