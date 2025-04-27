import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { AdminValidToken } from "@/Utiles/ValidateToken";
import { getSupabaseClient } from "@/SupabaseClient";

function useChartColors() {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const colorVars = [
      "--chart-1",
      "--chart-2",
      "--chart-3",
      "--chart-4",
      "--chart-5",
    ];

    const resolvedColors = colorVars.map((v) =>
      style.getPropertyValue(v).trim()
    );
    setColors(resolvedColors);
  }, []);

  return colors;
}

const summary = [
  { title: "Total Products", value: 1250 },
  { title: "Total Sellers", value: 75 },
  { title: "Approved", value: 1100 },
  { title: "Pending", value: 100 },
  { title: "Rejected", value: 50 },
];

const COLORS = ["#22c55e", "#facc15", "#ef4444", "#3b82f6"];

const approvalData = [
  { name: "Approved", value: 100 },
  { name: "Pending", value: 100 },
  { name: "Rejected", value: 50 },
  { name: "Under Review", value: 200 },
];

const monthlyAdditions = [
  { month: "Jan", Sellers: 120 },
  { month: "Feb", Sellers: 200 },
  { month: "Mar", Sellers: 150 },
  { month: "Apr", Sellers: 300 },
];

const topSellers = [
  { name: "Seller A", products: 320 },
  { name: "Seller B", products: 280 },
  { name: "Seller C", products: 250 },
];

const topCategories = [
  { name: "Nike", products: 250 },
  { name: "Adidas", products: 200 },
  { name: "Zara", products: 180 },
  { name: "H&M", products: 150 },
  { name: "Roadstar", products: 100 },
];

const CATEGORY_COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#6366F1"]; // blue, amber, green

export default function Pdashboard() {
  // const COLORS = useChartColors();
  const [summary, setSummary] = useState([
    { title: "Total Products", value: 0 },
    { title: "Total Sellers", value: 0 },
    { title: "Approved", value: 0 },
    { title: "Pending", value: 0 },
    { title: "Rejected", value: 0 },
  ]);

  const [approvalData, setApprovalData] = useState([
    { name: "Approved", value: 0 },
    { name: "Pending", value: 0 },
    { name: "Rejected", value: 0 },
    // { name: "Under Review", value: 0 },
  ]);

  const [loading, setloading] = useState(false)

  useEffect(() => {
    
    async function fetchSummary() {
      // Fetch Products
      setloading(true)
      const token = await AdminValidToken();

      if (!token) {
        return;
      }
      const supabase = getSupabaseClient(token);

      const { count: totalProducts } = await supabase
        .from("Product")
        .select("*", { count: "exact", head: true });

      // Fetch Sellers
      const { data: sellers } = await supabase.from("Product").select("*");
      console.log(sellers)

      if (sellers) {
        const approved = sellers.filter((s) => s.status === "Approved").length;
        const pending = sellers.filter((s) => s.status === "Pending").length;
        const rejected = sellers.filter((s) => s.status === "Rejected").length;
        // const underReview = sellers.filter(
        //   (s) => s.status === "under_review"
        // ).length;

        const sellerIds = sellers.map((s) => s.sellerId); // 👈 Extract seller_id
        const uniqueIds = Array.from(new Set(sellerIds));

        setSummary([
          { title: "Total Products", value: totalProducts || 0 },
          { title: "Total Sellers", value: uniqueIds.length },
          { title: "Approved", value: approved },
          { title: "Pending", value: pending },
          { title: "Rejected", value: rejected },
        ]);

        setApprovalData([
          { name: "Approved", value: approved },
          { name: "Pending", value: pending },
          { name: "Rejected", value: rejected },
          // { name: "Under Review", value: underReview },
        ]);
      }
      setloading(false)
    }

    fetchSummary();

    
  }, []);
  return (
    <div className="p-6 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {summary.map((item, idx) => (
          <Card key={idx} className="text-center">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {item.value}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Approval Status</CardTitle>
          </CardHeader>
          <CardContent className="h-73">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={415}>
                {" "}
                // 👈 Added margin bottom!
                <Pie
                  data={approvalData}
                  cx="50%"
                  cy="46%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {approvalData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  margin={{ top: 20 }}
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="">Monthly Sellers Additions</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyAdditions}
                barSize={40} // 👈 Slightly thicker bars
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }} // 👈 Good breathing space
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false} // 👈 Hide bottom axis line
                  tickLine={false} // 👈 Hide ticks
                  tickMargin={10}
                  tick={{ fontSize: 15, fill: "#64748b" }} // 👈 Softer color text
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 15, fill: "#64748b" }}
                />
                <Tooltip
                  //   cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} // 👈 Soft blue on hover
                  cursor={false} // 👈 No cursor
                  contentStyle={{
                    borderRadius: 8,
                    backgroundColor: "white",
                    borderColor: "#e2e8f0",
                  }}
                  itemStyle={{ color: "#3b82f6" }}
                />
                <Bar
                  dataKey="Sellers"
                  fill="url(#colorUv)" // 👈 Use gradient fill
                  radius={[8, 8, 0, 0]} // 👈 Bigger curve
                />

                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Sellers</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width={"100%"} height={"100%"}>
              <BarChart
                data={topSellers}
                barSize={40}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                {/* Gradient must come here */}

                {/* Grid, Axes, etc. */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 15, fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 15, fill: "#64748b" }}
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    borderRadius: 8,
                    backgroundColor: "white",
                    borderColor: "#e2e8f0",
                  }}
                  itemStyle={{ color: "#8B5CF6" }}
                />

                {/* Bar */}
                <Bar
                  dataKey="products"
                  fill="url(#colorUvv)" // 👉 this will now correctly use the gradient
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorUvv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" stopOpacity={1} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Brands</CardTitle>
          </CardHeader>
          <CardContent className="h-73">
            <ResponsiveContainer width={"100%"} height={"100%"}>
              <PieChart width={400} height={415}>
                <Pie
                  data={topCategories}
                  cx="50%"
                  cy="46%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="products"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {topCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {loading && (
          <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50">
            <div className="loader"></div>
          </div>
        )}
    </div>
  );
}
