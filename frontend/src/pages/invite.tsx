import { useNavigate, useParams } from "@solidjs/router";
import { createEffect, JSX } from "solid-js";
import { fetchProfile } from "src/helpers/profile";

export function Invite(): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();

  createEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      (async () => {
        try {
          await fetchProfile();
          navigate(`/?code=${params.code}`);
        } catch (err) {
          localStorage.removeItem("access_token");
          navigate(`/signin?code=${params.code}`);
        }
      })();
    } else {
      navigate(`/signin?code=${params.code}`);
    }
  });

  return null;
}
