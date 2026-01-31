import { Flight, FlightSearchParams } from "@/types/flight";

const AMADEUS_BASE_URL = "https://test.api.amadeus.com";

let accessToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  const response = await fetch(
    `${AMADEUS_BASE_URL}/v1/security/oauth2/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_API_KEY!,
        client_secret: process.env.AMADEUS_API_SECRET!,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to authenticate with Amadeus API");
  }

  const data = await response.json();

  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  return accessToken as string;
}

export async function searchFlights(
  params: FlightSearchParams
): Promise<Flight[]> {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults = 1,
  } = params;

  const token = await getAccessToken();

  const url = new URL(
    `${AMADEUS_BASE_URL}/v2/shopping/flight-offers`
  );

  url.searchParams.set("originLocationCode", origin);
  url.searchParams.set("destinationLocationCode", destination);
  url.searchParams.set("departureDate", departureDate);
  url.searchParams.set("adults", adults.toString());
  url.searchParams.set("max", "20");

  if (returnDate) {
    url.searchParams.set("returnDate", returnDate);
  }

  console.log("Amadeus params:", params);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Amadeus error:", response.status, errorText);
    throw new Error(`Amadeus API error (${response.status})`);
  }

  const data = await response.json();

  return normalizeFlights(data);
}

function durationToMinutes(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

  const hours = Number(match?.[1] ?? 0);
  const minutes = Number(match?.[2] ?? 0);

  return hours * 60 + minutes;
}
function normalizeFlights(apiResponse: any): Flight[] {
  if (!apiResponse?.data) return [];

  return apiResponse.data.map((offer: any) => {
    const itinerary = offer.itineraries[0];
    const segments = itinerary.segments;

    const durationMinutes = durationToMinutes(itinerary.duration);

    return {
      id: offer.id,
      airline: segments[0].carrierCode,
      price: Number(offer.price.total),
      stops: segments.length - 1,
      departureTime: segments[0].departure.at,
      arrivalTime: segments[segments.length - 1].arrival.at,
      duration: itinerary.duration,
      durationMinutes,
    };
  });
}
