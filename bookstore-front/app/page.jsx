import { redirect } from "next/navigation";

export default function RootRedirect() {
  redirect("/home"); // 302 por defecto
}
