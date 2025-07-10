import { useNavigate, useParams } from "@solidjs/router";

export function Invite() {
  const navigate = useNavigate();
  const params = useParams();

  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    navigate(`/?code=${params.code}`);
  } else {
    navigate(`/signin/?code=${params.code}`);
  }

  return <div></div>;
}
