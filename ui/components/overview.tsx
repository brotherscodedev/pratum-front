"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 1000) + 1000,
  },
  {
    name: "Fev",
    total: Math.floor(Math.random() * 1000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 1000) + 1000,
  },
  {
    name: "Abr",
    total: Math.floor(Math.random() * 1000) + 1000,
  },
  {
    name: "Mai",
    total: Math.floor(Math.random() * 1000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 1000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 1000) + 1000,
  },
  {
    name: "Ago",
    total: Math.floor(Math.random() * 1000) + 1000,
  },
  {
    name: "Set",
    total: Math.floor(Math.random() * 1000) + 1000,
  },
  {
    name: "Out",
    total: Math.floor(Math.random() * 1000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 1000) + 1000,
  },
  {
    name: "Dez",
    total: Math.floor(Math.random() * 1000) + 1000,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer height={350}>
      <BarChart data={data} maxBarSize={3000}>
        <XAxis
          dataKey="name"
          stroke="#FCFCFC"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#FCFCFC"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} className={`fill-greenSecundary`}/>
      </BarChart>
    </ResponsiveContainer>
  );
}
