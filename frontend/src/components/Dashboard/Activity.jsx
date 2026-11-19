import { useGetActivityQuery } from "@/redux/services/user/userApi";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import ComponentLoader from "../Loader/ComponentLoader";

const Activity = () => {
  const [selectedChart, setSelectedChart] = useState("line");

  const { data: rawData = [], isLoading, isError } = useGetActivityQuery();

  const monthlyData = rawData.map((item, index) => ({
    ...item,
    previousMonth:
      index > 0 ? rawData[index - 1].activeUsers : item.activeUsers,
  }));

  if (isError) {
    return <div className="rounded-2xl border border-rose-200 bg-white p-6 text-sm text-rose-700">Activity data couldn’t be loaded.</div>;
  }

  if (isLoading) return <ComponentLoader />;

  if (!monthlyData.length) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
        <p className="text-sm text-stone-500">No activity data available yet.</p>
      </div>
    );
  }

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];

  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const percentChange = currentMonth
    ? calculatePercentageChange(
        currentMonth.activeUsers,
        currentMonth.previousMonth,
      )
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Active Users (This Month)
          </p>
          <p className="mt-3 font-serif text-4xl text-stone-900">
            {currentMonth?.activeUsers ?? 0}
          </p>
          <p className="mt-1 text-xs text-stone-500">{currentMonth?.month}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Previous Month</p>
          <p className="mt-3 font-serif text-4xl text-stone-900">
            {previousMonth?.activeUsers ?? 0}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            {previousMonth?.month ?? "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Change</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="font-serif text-4xl text-stone-900">
              {percentChange > 0 ? "+" : ""}
              {percentChange.toFixed(1)}%
            </p>
            {percentChange > 0 ? (
              <span className="text-green-500 text-xl">↑</span>
            ) : percentChange < 0 ? (
              <span className="text-red-500 text-xl">↓</span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-stone-500">compared to last month</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {["line", "bar", "area"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedChart(type)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition capitalize ${
              selectedChart === type
                ? "bg-stone-900 text-white"
                : "border border-stone-200 bg-[#fffdf9] text-stone-600 hover:bg-amber-50"
            }`}
          >
            {type} Chart
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 shadow-sm sm:p-6">
        <h3 className="mb-4 font-serif text-xl text-stone-900">
          Monthly Active Users Trend
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          {selectedChart === "line" && (
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#d97706", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={{ fill: "#fbbf24", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
                name="Active Users"
              />
            </LineChart>
          )}
          {selectedChart === "bar" && (
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="activeUsers"
                fill="#fbbf24"
                radius={[4, 4, 0, 0]}
                name="Active Users"
              />
            </BarChart>
          )}
          {selectedChart === "area" && (
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="activeUsers"
                stroke="#fbbf24"
                fill="#fbbf24"
                fillOpacity={0.3}
                name="Active Users"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf9] shadow-sm">
        <div className="border-b border-stone-200 bg-[#faf7f0] px-6 py-4">
          <h3 className="font-serif text-xl text-stone-900">
            Monthly Activity Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Active Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Previous Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {[...monthlyData].reverse().map((item, idx) => {
                const change = calculatePercentageChange(
                  item.activeUsers,
                  item.previousMonth,
                );
                return (
                  <tr key={idx} className="transition hover:bg-[#faf7f0]">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-stone-900">
                      {item.month}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-700">
                      {item.activeUsers}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-500">
                      {item.previousMonth}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center gap-1 ${
                          change > 0
                            ? "text-green-600"
                            : change < 0
                              ? "text-red-600"
                              : "text-gray-500"
                        }`}
                      >
                        {change !== 0 && (change > 0 ? "↑" : "↓")}{" "}
                        {change !== 0 ? Math.abs(change).toFixed(1) : 0}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Activity;
