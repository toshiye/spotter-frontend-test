"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flight } from "@/types/flight";
import FlightCard from "./FlightCard";

type Props = {
    flights: Flight[];
};

export default function FlightList({ flights }: Props) {
    if (flights.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center border-2 border-dashed border-card-border rounded-lg"
            >
                <p className="text-app-fg opacity-60">
                    No flights found. Try different dates or routes.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div 
            layout
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-2"
        >
            <AnimatePresence mode='popLayout'>
                {flights.map((flight, index) => (
                    <motion.div
                        key={`${flight.id}-${index}`}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ 
                            duration: 0.4, 
                            delay: index * 0.05,
                            ease: "easeOut" 
                        }}
                    >
                        <FlightCard flight={flight} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}