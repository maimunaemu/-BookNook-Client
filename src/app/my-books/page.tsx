import type { Metadata } from "next";
import MyBooks from "@/components/my-books";
import ProtectedPage from "@/components/protected-page";

export const metadata: Metadata = { title: "My Books" };

export default function MyBooksPage() {
  return <ProtectedPage><MyBooks /></ProtectedPage>;
}
