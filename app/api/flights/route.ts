import { NextResponse } from "next/server";
import { searchFlights } from "@/services/amadeus";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const origin = searchParams.get("origin")?.trim();
    const destination = searchParams.get("destination")?.trim();
    const departureDate = searchParams.get("departureDate")?.trim();
    const returnDate = searchParams.get("returnDate")?.trim() || undefined;
    const adults = Number(searchParams.get("adults") ?? 1);

    if (!origin || !destination || !departureDate) {
        return NextResponse.json({ error: "Missing required query parameters." }, { status: 400 });
    }

    const depDate = new Date(departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (depDate < today) {
        return NextResponse.json(
            { error: "Departure date must be in the future." },
            { status: 400 }
        );
    }

    if (returnDate) {
        const retDate = new Date(returnDate);

        if (retDate <= depDate) {
            return NextResponse.json(
                { error: "Return date must be after departure date." },
                { status: 400 }
            );
        }
    }

    try {
        const flights = await searchFlights({
            origin,
            destination,
            departureDate,
            returnDate,
            adults: Number(adults),
        });

        return NextResponse.json({ flights }, { status: 200 });
    } catch (error) {
        console.error("Flight search failed:", error);

        /* return NextResponse.json({ error: "Failed to fetch flights." }, { status: 500 }); */
        return NextResponse.json(
            { error: String(error) },
            { status: 500 }
        );
    }
}