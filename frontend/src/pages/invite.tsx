import { useNavigate, useParams } from "@solidjs/router";
import { createEffect } from "solid-js";

export function Invite() {
  const navigate = useNavigate();
  const params = useParams();

  createEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      navigate(`/?code=${params.code}`);
    } else {
      navigate(`/signin/?code=${params.code}`);
    }
  }, [navigate, params.code]);

  return null;
}
