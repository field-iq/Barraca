import { NextRequest, NextResponse } from "next/server";

const ORIGIN = "Sáenz Peña 1213, Tigre, Buenos Aires, Argentina";
const MAPS_URL = "https://maps.googleapis.com/maps/api/distancematrix/json";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");

  if (!address || address.trim().length === 0) {
    return NextResponse.json(
      { distanceKm: null, error: "Dirección vacía" },
      { status: 400 },
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === "REEMPLAZAR_CON_TU_KEY") {
    console.warn(
      "[La Barraca] GOOGLE_MAPS_API_KEY no configurada — usando fallback de envío",
    );
    return NextResponse.json({ distanceKm: null, error: "API key no configurada" });
  }

  const params = new URLSearchParams({
    origins: ORIGIN,
    destinations: address.trim(),
    key: apiKey,
    language: "es",
  });

  try {
    const response = await fetch(`${MAPS_URL}?${params}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[La Barraca] Error HTTP de Google Maps:", response.status);
      return NextResponse.json({
        distanceKm: null,
        error: "Error al contactar Google Maps",
      });
    }

    const data = await response.json();

    const element = data?.rows?.[0]?.elements?.[0];
    if (!element || element.status !== "OK") {
      console.warn(
        "[La Barraca] Google Maps no pudo resolver la dirección:",
        address,
        element?.status,
      );
      return NextResponse.json({ distanceKm: null, error: "Dirección no encontrada" });
    }

    const meters: number = element.distance.value;
    const distanceKm = Math.round((meters / 1000) * 10) / 10;

    return NextResponse.json({ distanceKm });
  } catch (err) {
    console.error("[La Barraca] Error inesperado en /api/distance:", err);
    return NextResponse.json({ distanceKm: null, error: "Error interno" });
  }
}
