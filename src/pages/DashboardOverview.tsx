import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { salesData, categoryData, products, orders } from "@/data/mockData";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const DashboardOverview = () => {
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  return (
    <DashboardLayout title="لوحة التحكم">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي المبيعات" value="271,700 ر.س" change="12.5% من الشهر الماضي" changeType="up" icon={DollarSign} />
        <StatCard title="الطلبات" value="3,162" change="8.2% من الشهر الماضي" changeType="up" icon={ShoppingCart} />
        <StatCard title="العملاء" value="1,284" change="4.1% من الشهر الماضي" changeType="up" icon={Users} />
        <StatCard title="المنتجات النشطة" value="156" change="2 منتج جديد" changeType="up" icon={Package} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              المبيعات الشهرية
            </h3>
            <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">2024</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fill="url(#salesGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="glass-card rounded-xl p-5 animate-fade-in">
          <h3 className="font-bold text-foreground mb-4">التصنيفات</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.fill }} />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
                <span className="font-medium text-foreground">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="glass-card rounded-xl p-5 animate-fade-in">
          <h3 className="font-bold text-foreground mb-4">المنتجات الأكثر مبيعاً</h3>
          <div className="space-y-3">
            {[...products].sort((a, b) => b.sold - a.sold).slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <span className="text-2xl">{p.image}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.price} ر.س</p>
                </div>
                <span className="text-sm font-bold text-foreground">{p.sold} مبيع</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="glass-card rounded-xl p-5 animate-fade-in">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            تنبيهات المخزون
          </h3>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
                  <span className="text-2xl">{p.image}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-warning font-medium">متبقي {p.stock} قطع فقط</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">لا توجد تنبيهات حالياً</p>
          )}

          {/* Recent Orders */}
          <h3 className="font-bold text-foreground mt-6 mb-4">آخر الطلبات</h3>
          <div className="space-y-2">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.id}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">{order.total} ر.س</p>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-warning/10 text-warning",
    processing: "bg-info/10 text-info",
    shipped: "bg-primary/10 text-primary",
    delivered: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };
  const labels: Record<string, string> = {
    pending: "قيد الانتظار",
    processing: "قيد التجهيز",
    shipped: "تم الشحن",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default DashboardOverview;
