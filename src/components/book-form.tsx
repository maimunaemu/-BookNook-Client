"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { ImagePlus, LoaderCircle, Save, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BookCover from "@/components/book-cover";
import { apiRequest, ApiError } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { bookCategories, type Book, type BookCategory } from "@/lib/types";

interface BookFormProps {
  book?: Book;
  onComplete?: () => void;
  onCancel?: () => void;
}

interface ImageUploadResponse {
  success: boolean;
  data?: { url: string };
  error?: { message?: string };
}

export default function BookForm({ book, onComplete, onCancel }: BookFormProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [category, setCategory] = useState<BookCategory>(book?.category ?? "Fiction");
  const [coverImage, setCoverImage] = useState(book?.coverImage ?? "");
  const [description, setDescription] = useState(book?.description ?? "");
  const [totalCopies, setTotalCopies] = useState(String(book?.totalCopies ?? 1));
  const [addedAt, setAddedAt] = useState(book?.addedAt.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);
  const isEditing = Boolean(book);

  async function uploadCover(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file for the book cover.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Cover images must be smaller than 10 MB.");
      return;
    }
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("Image upload isn't configured yet. Add the imgbb API key to the client environment.");
      return;
    }

    setBusy(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        body: formData,
      });
      const payload = await response.json() as ImageUploadResponse;
      if (!response.ok || !payload.success || !payload.data?.url) {
        throw new Error(payload.error?.message ?? "The image host couldn't save this cover.");
      }
      setCoverImage(payload.data.url);
      toast.success("Cover uploaded.");
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "The cover couldn't be uploaded. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const copies = Number(totalCopies);
    if (!Number.isInteger(copies) || copies < 1 || copies > 1000) {
      toast.error("Enter a whole number of copies between 1 and 1,000.");
      return;
    }
    if (description.trim().length < 20) {
      toast.error("Add a little more detail to the description (at least 20 characters).");
      return;
    }
    if (!session) {
      toast.error("Please log in again before saving this book.");
      return;
    }

    setBusy(true);
    try {
      const body = {
        title: title.trim(),
        author: author.trim(),
        category,
        coverImage: coverImage.trim(),
        description: description.trim(),
        totalCopies: copies,
        ...(!isEditing ? { addedAt: new Date(`${addedAt}T00:00:00.000Z`).toISOString() } : {}),
      };
      if (book) {
        await apiRequest(`/books/${encodeURIComponent(book.id)}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        toast.success("Your book details have been updated.");
      } else {
        await apiRequest("/books", { method: "POST", body: JSON.stringify(body) });
        toast.success("Your book has found a place on the shelf.");
      }
      if (onComplete) onComplete();
      else router.push("/my-books");
    } catch (reason) {
      toast.error(reason instanceof ApiError ? reason.message : "We couldn't save this book. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Book title <span className="text-[#bd7158]">*</span>
          <input className="field mt-1.5" required minLength={1} maxLength={140} value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Author <span className="text-[#bd7158]">*</span>
          <input className="field mt-1.5" required maxLength={100} value={author} onChange={(event) => setAuthor(event.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Category <span className="text-[#bd7158]">*</span>
          <select className="field mt-1.5" value={category} onChange={(event) => setCategory(event.target.value as BookCategory)}>
            {bookCategories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Total copies <span className="text-[#bd7158]">*</span>
          <input className="field mt-1.5" type="number" min={1} max={1000} step={1} required value={totalCopies} onChange={(event) => setTotalCopies(event.target.value)} />
          {book && <span className="mt-1 block text-xs font-normal text-[#80877e]">Currently available: {book.availableCopies}</span>}
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="cover-upload" className="block text-sm font-medium">
            Book cover <span className="text-xs font-normal text-[#8a9188]">(Optional)</span>
          </label>
          <span className="text-xs text-[#8a9188]">JPG, PNG or WebP · up to 10 MB</span>
        </div>
        <div className="mt-2 grid gap-4 rounded-xl border border-dashed border-[#d4d8ce] bg-[#f7f6f0] p-4 sm:grid-cols-[112px_1fr] sm:p-5">
          <BookCover src={coverImage} title={title || "Your book"} className="aspect-[3/4] w-28 rounded-lg" />
          <div className="flex flex-col justify-center">
            <label htmlFor="cover-upload" className="button-secondary w-fit cursor-pointer !rounded-lg">
              <UploadCloud size={16} /> Choose a cover
            </label>
            <input id="cover-upload" type="file" accept="image/*" className="sr-only" onChange={(event) => { void uploadCover(event.target.files?.[0]); event.currentTarget.value = ""; }} />
            <p className="mt-3 text-xs leading-5 text-[#788077]">
              A clear cover helps readers recognize your book. You can also paste a hosted image URL below.
            </p>
            <label className="mt-3 block text-xs font-medium text-[#606b61]">
              Cover image URL
              <span className="relative mt-1 block">
                <ImagePlus size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#899187]" />
                <input className="field !min-h-10 pl-9 text-xs" type="url" value={coverImage} onChange={(event) => setCoverImage(event.target.value)} placeholder="https://…" />
              </span>
            </label>
          </div>
        </div>
      </div>

      <label className="block text-sm font-medium">
        A little about the book <span className="text-[#bd7158]">*</span>
        <textarea className="field mt-1.5 min-h-36 resize-y !leading-6" required minLength={20} maxLength={5000} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What might a reader want to know?" />
        <span className="mt-1 block text-right text-xs font-normal text-[#899087]">{description.length}/5,000</span>
      </label>

      {!isEditing && (
        <label className="block max-w-xs text-sm font-medium">
          Date added <span className="text-[#bd7158]">*</span>
          <input className="field mt-1.5" type="date" required value={addedAt} onChange={(event) => setAddedAt(event.target.value)} />
        </label>
      )}

      <div className="grid gap-4 rounded-xl bg-[#efeee7] p-4 sm:grid-cols-2 sm:p-5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-[#81887f]">
          Shared by
          <input className="field mt-2 !text-sm font-normal" value={session?.user.name ?? ""} readOnly disabled aria-label="Your name" />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wide text-[#81887f]">
          Owner email
          <input className="field mt-2 !text-sm font-normal" value={session?.user.email ?? ""} readOnly disabled aria-label="Your email" />
        </label>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-[#e7e4db] pt-5">
        <button type="submit" disabled={busy} className="button-primary min-w-40">
          {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
          {busy ? "Saving…" : isEditing ? "Save changes" : "Add to the shelf"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="button-secondary">
            <X size={15} /> Cancel
          </button>
        )}
      </div>
    </form>
  );
}
