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
        <div className="border border-card-border p-4 rounded-lg bg-card-bg text-app-fg transition-colors duration-300">
            
            <div className="font-semibold">
                {formatTime(flight.departureTime)} → {formatTime(flight.arrivalTime)}
                <span className="text-zinc-500 dark:text-zinc-400 font-normal">
                    {" • "}{formatDuration(flight.duration)}
                </span>
            </div>

            <div className="text-sm opacity-80">
                {flight.departureTime} → {flight.arrivalTime} ({flight.duration})
            </div>

            <div className="text-sm text-zinc-500 dark:text-zinc-400">
                Stops: {flight.stops}
            </div>

            <div className="font-bold text-lg mt-1">
                €{flight.price}
            </div>
        </div>
    );
}