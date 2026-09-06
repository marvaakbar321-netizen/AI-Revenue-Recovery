import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ error: "Please enter a search term with at least 2 characters." }, { status: 400 });
    }

    const apiKey = process.env.IMAGE_SEARCH_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Image search is not configured on the server." }, { status: 500 });
    }

    const trimmedQuery = query.trim();
    const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(trimmedQuery)}&per_page=6`;

    const response = await fetch(searchUrl, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Image search failed. Please try again or enter an image URL manually." }, { status: response.status });
    }

    const data = await response.json();
    const photos = Array.isArray(data.photos) ? data.photos : [];

    const results = photos
      .filter((photo: { src?: { medium?: string; large?: string; small?: string } }) => Boolean(photo.src?.medium || photo.src?.large || photo.src?.small))
      .map((photo: { src?: { medium?: string; large?: string; small?: string }; photographer?: string; url?: string }) => ({
        url: photo.src?.medium || photo.src?.large || photo.src?.small || "",
        photographer: photo.photographer || "",
        pageUrl: photo.url || "",
      }))
      .filter((item: { url: string }) => item.url);

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Image search failed. Please try again or enter an image URL manually." }, { status: 500 });
  }
}
