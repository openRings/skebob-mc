interface SignInCredentials {
  nickname: string;
  password: string;
}

interface SignUpCredentials {
  nickname: string;
  password: string;
  password_repeat: string;
}

interface SignInResponse {
  accessToken: string;
}

interface ProfileResponse {
  nickname: string;
  maxInvites: number;
  createdAt: Date;
  invited: string;
}
