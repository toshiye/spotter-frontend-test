import { Flight } from "@/types/flight";
import FlightCard from "./FlightCard";

type Props = {
    flights: Flight[];
};

export default function FlightList({ flights }: Props) {
    if(flights.length === 0) {
        return (
            <p className="text-gray-500 dark:text-gray-400">
                No flights found. Try different dates or routes.
            </p>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
            ))}
        </div>
    );
}