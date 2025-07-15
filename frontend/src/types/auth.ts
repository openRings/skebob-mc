export interface SignInCredentials {
  nickname: string;
  password: string;
}

export interface SignUpCredentials {
  nickname: string;
  password: string;
  password_repeat: string;
}

export interface SignInResponse {
  accessToken: string;
}

export interface ProfileResponse {
  nickname: string;
  maxInvites: number;
  createdAt: Date;
  invited: Date | null;
}

export interface InviteResponse {
  name: string;
  code: string;
  created_at: Date;
  used_by: string | null;
}

export interface InviteCodeInfoResponse {
  created_by: string;
  used_by: string;
}
