import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, BarChart3 } from "lucide-react";
import { format, subDays, subMonths, startOfWeek, startOfMonth, parseISO } from "date-fns";

type Period = "weekly" | "monthly";
type ChartType = "bar" | "area";

interface DataPoint {
  label: string;
  amount: number;
  count: number;
}

export function DonationTrendChart() {
  const [period, setPeriod] = useState<Period>("weekly");
  const [chartType, setChartType] = useState<ChartType>("area");
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      const since = period === "weekly"
        ? subDays(new Date(), 12 * 7) // last 12 weeks
        : subMonths(new Date(), 12);   // last 12 months

      const { data: donations } = await supabase
        .from("donations")
        .select("amount, created_at")
        .eq("payment_status", "success")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: true });

      if (!donations) {
        setData([]);
        setIsLoading(false);
        return;
      }

      const grouped = new Map<string, { amount: number; count: number }>();

      donations.forEach((d) => {
        const date = parseISO(d.created_at);
        const key = period === "weekly"
          ? format(startOfWeek(date, { weekStartsOn: 1 }), "dd MMM")
          : format(startOfMonth(date), "MMM yyyy");

        const existing = grouped.get(key) || { amount: 0, count: 0 };
        grouped.set(key, {
          amount: existing.amount + Number(d.amount),
          count: existing.count + 1,
        });
      });

      setData(Array.from(grouped.entries()).map(([label, v]) => ({ label, ...v })));
      setIsLoading(false);
    };

    fetchDonations();
  }, [period]);

  const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(value >= 1000 ? 1 : 0)}k`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Donation Trends
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <Button
              variant={chartType === "area" ? "default" : "outline"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setChartType("area")}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Area
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setChartType("bar")}
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Bar
            </Button>
            <div className="w-px h-5 bg-border mx-1" />
            <Button
              variant={period === "weekly" ? "default" : "outline"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setPeriod("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={period === "monthly" ? "default" : "outline"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setPeriod("monthly")}
            >
              Monthly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
            No donation data for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            {chartType === "area" ? (
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Amount"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#donationGradient)"
                />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Amount"]}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
