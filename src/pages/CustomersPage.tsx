import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Crown, Medal, Award, Star, Sparkles, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const tierConfig: Record<string, { label: string; icon: any; className: string }> = {
  platinum: { label: "بلاتينيوم", icon: Crown, className: "bg-primary/10 text-primary" },
  gold: { label: "ذهبي", icon: Medal, className: "bg-warning/10 text-warning" },
  silver: { label: "فضي", icon: Award, className: "bg-muted text-muted-foreground" },
  bronze: { label: "برونزي", icon: Star, className: "bg-warning/5 text-warning" },
};

const CustomersPage = () => {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data } = await supabase.from("customers").select("*");
      return data ?? [];
    },
  });

  const { data: topProducts = [] } = useQuery({
    queryKey: ["top_products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("id, name, emoji, price, sold").order("sold", { ascending: false }).limit(3);
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout title="إدارة العملاء">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="إدارة العملاء">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(["platinum", "gold", "silver", "bronze"] as const).map((tier) => {
          const config = tierConfig[tier];
          const count = customers.filter((c) => c.tier === tier).length;
          const TierIcon = config.icon;
          return (
            <div key={tier} className="glass-card rounded-xl p-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <TierIcon className={`h-5 w-5 ${config.className.split(" ")[1]}`} />
                <span className="text-sm font-medium text-muted-foreground">{config.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">الطلبات</TableHead>
              <TableHead className="text-right">إجمالي الإنفاق</TableHead>
              <TableHead className="text-right">تاريخ الانضمام</TableHead>
              <TableHead className="text-right">التوصيات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => {
              const tier = tierConfig[customer.tier] ?? tierConfig.bronze;
              const TierIcon = tier.icon;
              return (
                <TableRow key={customer.id} className="hover:bg-secondary/30 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground text-sm">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${tier.className}`}>
                      <TierIcon className="h-3 w-3" />
                      {tier.label}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{customer.total_orders}</TableCell>
                  <TableCell className="font-bold text-foreground">{Number(customer.total_spent).toLocaleString()} ر.س</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{customer.join_date}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="عرض التوصيات">
                          <Sparkles className="h-4 w-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent dir="rtl" className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            منتجات مقترحة لـ {customer.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 mt-4">
                          {topProducts.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                              <span className="text-2xl">{p.emoji}</span>
                              <div className="flex-1">
                                <p className="font-medium text-foreground text-sm">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{p.price} ر.س — {p.sold} مبيع</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;
