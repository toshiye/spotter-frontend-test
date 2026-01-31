'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!data.length || !mounted) return null;

    const isDark = resolvedTheme === 'dark';

    const colors = {
        text: isDark ? '#fafafa' : '#111827', 
        axis: isDark ? '#71717a' : '#9ca3af',
        bar: isDark ? '#3f3f46' : '#d1d5db',
        selected: isDark ? '#ffffff' : '#000000'
    };

    return (
        <div className="w-full h-80 bg-card-bg border border-card-border rounded-lg shadow p-4 transition-colors duration-300">
            <h2 className="text-lg font-semibold mb-2 text-app-fg">Price Distribution</h2>

            <ResponsiveContainer width="100%" height="100%">
                {type === "line" ? (
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                    >
                        <XAxis
                            dataKey="price"
                            tickFormatter={(v) => `€${Math.round(v)}`}
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            interval="preserveStartEnd" 
                            minTickGap={10}
                            stroke={colors.axis}
                            style={{ fontSize: '10px', fill: colors.text }}
                        />
                        <YAxis
                            allowDecimals={false}
                            stroke={colors.axis}
                            style={{ fontSize: '12px', fill: colors.text }}
                        />
                        <Tooltip
                            formatter={(v) => [v, "Flights"]}
                            contentStyle={{
                                backgroundColor: isDark ? '#18181b' : '#ffffff',
                                border: `1px solid ${colors.axis}`,
                                color: colors.text
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke={colors.selected}
                            strokeWidth={3}
                            dot={({ cx, cy, payload }) => {
                                const isSelected = payload.price === selectedPrice;
                                return (
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r={isSelected ? 7 : 4}
                                        fill={isSelected ? colors.selected : colors.axis}
                                    />
                                );
                            }}
                            activeDot={({ cx, cy, payload }) => (
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={8}
                                    fill={colors.selected}
                                    stroke={colors.selected}
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
                            stroke={colors.axis}
                            style={{ fontSize: '12px', fill: colors.text }}
                        />
                        <YAxis
                            allowDecimals={false}
                            stroke={colors.axis}
                            style={{ fontSize: '12px', fill: colors.text }}
                        />
                        <Tooltip
                            formatter={(v) => [v, "Flights"]}
                            contentStyle={{
                                backgroundColor: isDark ? '#18181b' : '#ffffff',
                                border: `1px solid ${colors.axis}`,
                                color: colors.text
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
                                        fill={isSelected ? colors.selected : colors.bar}
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