import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');

    if (!keyword || keyword.length < 2) return NextResponse.json([]);

    try {
        // 1. Get Access Token (In a real app, cache this!)
        const authResponse = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `grant_type=client_credentials&client_id=${process.env.AMADEUS_API_KEY}&client_secret=${process.env.AMADEUS_API_SECRET}`,
        });
        const { access_token } = await authResponse.json();

        // 2. Fetch Airports
        const response = await fetch(
            `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${keyword}&page[limit]=10&sort=analytics.travelers.score`,
            { headers: { Authorization: `Bearer ${access_token}` } }
        );
        const data = await response.json();

        // 3. Return simplified data
        return NextResponse.json(data.data || []);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch airports" }, { status: 500 });
    }
}