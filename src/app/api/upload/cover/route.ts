import { auth } from "@/lib/auth";

const maxImageSize = 4 * 1024 * 1024;

interface ImgBBResponse {
  success?: boolean;
  data?: { url?: string };
  error?: { message?: string };
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Please sign in to upload a book cover." }, { status: 401 });
  }

  const apiKey = process.env.IMGBB_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { error: "Image upload isn't configured yet. Add IMGBB_API_KEY to the server environment." },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Choose an image file to upload." }, { status: 400 });
  }

  const image = formData.get("image");
  if (!(image instanceof File) || !image.type.startsWith("image/")) {
    return Response.json({ error: "Choose an image file for the book cover." }, { status: 400 });
  }
  if (image.size > maxImageSize) {
    return Response.json({ error: "Cover images must be 4 MB or smaller." }, { status: 413 });
  }

  const uploadData = new FormData();
  uploadData.append("image", image);

  let response: Response;
  try {
    response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      body: uploadData,
    });
  } catch {
    return Response.json({ error: "The image host couldn't be reached. Please try again." }, { status: 502 });
  }

  let payload: ImgBBResponse;
  try {
    payload = await response.json() as ImgBBResponse;
  } catch {
    return Response.json({ error: "The image host returned an invalid response." }, { status: 502 });
  }

  if (!response.ok || !payload.success || !payload.data?.url) {
    return Response.json(
      { error: payload.error?.message ?? "The image host couldn't save this cover." },
      { status: 502 },
    );
  }

  return Response.json({ url: payload.data.url });
}
