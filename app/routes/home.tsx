import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function getRandomValue() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);

  return array;
}

function toHexString(byteArray: Uint8Array) {
  return Array.from(byteArray, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

function generateNonce() {
  const randomValue = getRandomValue();

  return toHexString(randomValue);
}

export function loader({ context }: Route.LoaderArgs) {
  const nonce = generateNonce();

  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE, nonce };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome message={loaderData.message} nonce={loaderData.nonce} />;
}
