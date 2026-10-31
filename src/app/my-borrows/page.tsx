import type { Metadata } from "next";
import MyBorrows from "@/components/my-borrows";
import ProtectedPage from "@/components/protected-page";

export const metadata: Metadata = { title: "My Borrows" };

export default function MyBorrowsPage() {
  return <ProtectedPage><MyBorrows /></ProtectedPage>;
}
