import type { Metadata } from "next";
import ProtectedPage from "@/components/protected-page";
import Profile from "@/components/profile";

export const metadata: Metadata = { title: "My Profile" };

export default function ProfilePage() {
  return <ProtectedPage><Profile /></ProtectedPage>;
}
