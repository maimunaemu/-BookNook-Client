import type { Metadata } from "next";
import AllBooks from "@/components/all-books";

export const metadata: Metadata = { title: "All Books" };

export default async function BooksPage({ searchParams }: PageProps<"/books">) {
  const { category } = await searchParams;
  return <AllBooks initialCategory={typeof category === "string" ? category : ""} />;
}
