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
    return <div>Error loading data</div>;
  }

  if (isLoading) return <ComponentLoader />;

  if (!monthlyData.length) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
        <p className="text-gray-500">No activity data available.</p>
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
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded shadow-md p-5 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">
            Active Users (This Month)
          </p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {currentMonth?.activeUsers ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">{currentMonth?.month}</p>
        </div>
        <div className="bg-white rounded shadow-md p-5 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Previous Month</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {previousMonth?.activeUsers ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {previousMonth?.month ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded shadow-md p-5 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Change</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-gray-800">
              {percentChange > 0 ? "+" : ""}
              {percentChange.toFixed(1)}%
            </p>
            {percentChange > 0 ? (
              <span className="text-green-500 text-xl">↑</span>
            ) : percentChange < 0 ? (
              <span className="text-red-500 text-xl">↓</span>
            ) : null}
          </div>
          <p className="text-xs text-gray-400 mt-1">compared to last month</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {["line", "bar", "area"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedChart(type)}
            className={`px-3 py-1.5 text-sm rounded transition capitalize ${
              selectedChart === type
                ? "bg-yellow-400 text-black"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {type} Chart
          </button>
        ))}
      </div>

      <div className="bg-white rounded shadow-md p-5 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
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

      <div className="bg-white rounded shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Monthly Activity Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previous Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...monthlyData].reverse().map((item, idx) => {
                const change = calculatePercentageChange(
                  item.activeUsers,
                  item.previousMonth,
                );
                return (
                  <tr key={item.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.activeUsers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
