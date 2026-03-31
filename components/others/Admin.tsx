"use client";
import React from "react";
import {
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

export type AdminDashboardData = {
  stats: {
    totalLedger: string | number;
    totalDebt: string | number;
    totalRecovery: string | number;
    remaining: number;
    totalCusumer: number;
  };
  chartData: {
    name: string;
    udhar: number;
    paid: number;
  }[];
  debtPayments: {
    customerName: string | undefined;
    date: Date;
    amount: number;
  }[];
  liveSales: {
    method: "CASH" | "CARD";
    amount: number;
    status: "pending" | "success" | "failed" | null;
    createdAt: Date;
  }[];
};

export default function Admin({ dashboardData }: { dashboardData: AdminDashboardData }) {
  const { stats, chartData, debtPayments, liveSales } = dashboardData;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Overview</h1>
            <p className="text-slate-500">Track your business credit and live sales in real-time.</p>
          </div>
          <Link href="/Debts">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
              + New Transaction
            </Button>
          </Link>
        </div>

        {/* --- 1. STATS CARDS --- */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Udhar Given"
            value={stats.totalLedger}
            icon={<ArrowUpRight className="text-red-500" />}
          />
          <StatCard
            title="Debt Recovered"
            value={stats.totalRecovery}
            icon={<ArrowDownLeft className="text-emerald-500" />}
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCusumer}
            icon={<Users className="text-blue-500" />}
          />
          <StatCard
            title="Remaining Balance"
            value={stats.remaining}
            icon={<Wallet className="text-orange-500" />}
          />
        </div>

        {/* --- 2. ANALYTICS CHART --- */}
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <CardTitle>Recovery Analytics</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar
                  dataKey="udhar"
                  fill="#ef4444"
                  name="Udhar Given"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
                <Bar
                  dataKey="paid"
                  fill="#10b981"
                  name="Recovery"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* --- 3. DUAL TABLES SECTION --- */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* DEBT PAYMENTS TABLE */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <History className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-slate-800">Debt Received</h2>
            </div>
            <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debtPayments.map((item, i) => (
                    <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-700">{item.customerName || "Walking Customer"}</TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {new Date(item.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        ₹{Number(item.amount).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>

          {/* LIVE SALES TABLE */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800">Live Purchases</h2>
            </div>
            <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveSales.map((lp, i) => (
                    <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={lp.method === "CARD" 
                            ? "bg-blue-50 text-blue-700 border-blue-100" 
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                          }
                        >
                          {lp.method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${lp.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="text-xs font-medium capitalize text-slate-600">{lp.status || 'pending'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-900">
                        ₹{Number(lp.amount).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">
          ₹{Number(value).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}