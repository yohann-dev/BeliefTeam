import { useTwitterLogin } from "../hooks/useTwitterAuth";

export default function TwitterLoginButton() {
  const { login } = useTwitterLogin();

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={login}
    >
      Login with Twitter
    </button>
  );
}