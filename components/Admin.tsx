"use client";
import React from "react";
import {
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  LayoutDashboard,
  History,
  Package,
  ShoppingCart,
  Bell,
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

type AdminProps = {
  adminInfo: {
    totalLedger: string | number;
    totalDebt: string | number;
    totalRecovery: string | number;
    remaining: number;
    totalCusumer: number;
  };
  data: {
    name: string;
    udhar: number;
    paid: number;
  }[];
  pay: {
    customerName: string | undefined;
    date: Date;
    amount: number;
  }[];
};

export default function Admin({ adminInfo, data, pay }: AdminProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation */}

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
          <div className="flex gap-3">
            <Button variant="outline" size="icon">
              <Bell size={20} />
            </Button>
            <Link href="/Debts">
              <Button>+ New Transaction</Button>
            </Link>
          </div>
        </div>

        {/* 1️⃣ Quick Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* <StatCard title="Total Customers" value=`${adminInfo.}` icon={<Users className="text-muted-foreground"/>} /> */}
          <StatCard
            title="Total Udhar Given"
            value={adminInfo.totalLedger}
            icon={<ArrowUpRight className="text-red-500" />}
          />

          <StatCard
            title="Total Paid Amount"
            value={adminInfo.totalRecovery}
            icon={<ArrowDownLeft className="text-green-500" />}
          />

          <StatCard
            title="Total Customer"
            value={adminInfo.totalCusumer}
            icon={<ArrowDownLeft className="text-green-500" />}
          />

          <StatCard
            title="Remaining Balance"
            value={adminInfo.remaining}
            icon={<Wallet className="text-blue-500" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          {/* 6️⃣ Analytics Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Monthly Recovery Rate</CardTitle>
            </CardHeader>
            <CardContent className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="udhar"
                    fill="#ef4444"
                    name="Udhar Given"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="paid"
                    fill="#22c55e"
                    name="Payment Received"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 3️⃣ Recent Transactions */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>data</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pay.map((item,i)=>(

                  <TableRow>
                    <TableCell className="font-medium">{item.customerName}</TableCell>
                    <TableCell>
                    {item.date.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">₹{item.amount}</TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
