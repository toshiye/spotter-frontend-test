import { Flight } from "@/types/flight";

type Props = {
    flight: Flight;
};

export default function FlightCard({ flight }: Props) {

    function formatTime(date: string) {
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function formatDuration(duration: string) {
        return duration
            .replace("PT", "")
            .replace("H", "h ")
            .replace("M", "m");
    }
    return (
        <div className="border p-4 rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white">
            <div className="font-semibold text-gray-900 dark:text-white">
                {formatTime(flight.departureTime)} → {formatTime(flight.arrivalTime)}
                <span className="text-gray-500 dark:text-gray-400">
                    {" • "}{formatDuration(flight.duration)}
                </span>
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-300">
                {flight.departureTime} → {flight.arrivalTime} ({flight.duration})
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
                Stops: {flight.stops}
            </div>

            <div className="font-bold text-gray-900 dark:text-white mt-1">
                €{flight.price}
            </div>
        </div>
    );
}