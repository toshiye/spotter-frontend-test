'use client';

import { useTheme } from '@/app/providers';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

type ChartType = "line" | "bar";

type PriceChartPoint = {
    price: number;
    count: number;
};

type Props = {
    data: PriceChartPoint[];
    selectedPrice?: number;
    onSelectPrice?: (price: number) => void;
    type: ChartType;
};

export default function PriceChart({ data, selectedPrice, onSelectPrice, type }: Props) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    if (!data.length) return null;

    const textColor = isDark ? '#e5e7eb' : '#000000';
    const axisColor = isDark ? '#9ca3af' : '#666666';
    const barColor = isDark ? '#d1d5db' : '#bbb';
    const selectedColor = isDark ? '#ffffff' : '#000000';

    return (
        <div className="w-full h-80 bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">Price Distribution</h2>

            <ResponsiveContainer width="100%" height="100%">
                {type === "line" ? (
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                    >
                        <XAxis
                            dataKey="price"
                            tickFormatter={(v) => `€${v}`}
                            angle={-30}
                            textAnchor="end"
                            height={60}
                            stroke={axisColor}
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                            allowDecimals={false} 
                            stroke={axisColor}
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip 
                            formatter={(v) => [v, "Flights"]}
                            contentStyle={{
                                backgroundColor: isDark ? '#27272a' : '#ffffff',
                                border: `1px solid ${isDark ? '#3f3f46' : '#e5e7eb'}`,
                                color: textColor
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke={selectedColor}
                            strokeWidth={3}
                            dot={({ cx, cy, payload }) => {
                                const isSelected = payload.price === selectedPrice;

                                return (
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r={isSelected ? 7 : 4}
                                        fill={isSelected ? selectedColor : axisColor}
                                    />
                                );
                            }}
                            activeDot={({ cx, cy, payload }) => (
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={8}
                                    fill={selectedColor}
                                    stroke={selectedColor}
                                    strokeWidth={2}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => onSelectPrice?.(payload.price)}
                                />
                            )}
                        />
                    </LineChart>
                ) : (
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                    >
                        <XAxis
                            dataKey="price"
                            tickFormatter={(v) => `€${v}`}
                            angle={-30}
                            textAnchor="end"
                            height={60}
                            stroke={axisColor}
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                            allowDecimals={false}
                            stroke={axisColor}
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip 
                            formatter={(v) => [v, "Flights"]}
                            contentStyle={{
                                backgroundColor: isDark ? '#27272a' : '#ffffff',
                                border: `1px solid ${isDark ? '#3f3f46' : '#e5e7eb'}`,
                                color: textColor
                            }}
                        />

                        <Bar
                            dataKey="count"
                            shape={({ x, y, width, height, payload }) => {
                                const isSelected = payload.price === selectedPrice;

                                return (
                                    <rect
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        fill={isSelected ? selectedColor : barColor}
                                        onClick={() => onSelectPrice?.(payload.price)}
                                        style={{ cursor: "pointer" }}
                                    />
                                );
                            }}
                        />
                    </BarChart>
                )}
            </ResponsiveContainer>

        </div>
    );
}