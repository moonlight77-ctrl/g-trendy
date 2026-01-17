// src/app/page.tsx
import { redirect } from "next/navigation";

export const metadata = {
  title: "Rejoins la waitlist",
  description: "Inscris-toi pour être parmi les premiers.",
};

export default function Home() {
  redirect("\waitlist"); // 307 côté Next — propre et réversible
}