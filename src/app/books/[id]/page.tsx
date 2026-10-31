import type { Metadata } from "next";
import BookDetails from "@/components/book-details";
import ProtectedPage from "@/components/protected-page";

export const metadata: Metadata = { title: "Book Details" };

export default async function BookDetailsPage({ params }: PageProps<"/books/[id]">) {
  const { id } = await params;
  return <ProtectedPage><BookDetails id={id} /></ProtectedPage>;
}
