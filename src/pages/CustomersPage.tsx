import { DashboardLayout } from "@/components/DashboardLayout";
import { customers, products, recommendations } from "@/data/mockData";
import { Crown, Medal, Award, Star, Sparkles } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const tierConfig = {
  platinum: { label: "بلاتينيوم", icon: Crown, className: "bg-primary/10 text-primary" },
  gold: { label: "ذهبي", icon: Medal, className: "bg-warning/10 text-warning" },
  silver: { label: "فضي", icon: Award, className: "bg-muted text-muted-foreground" },
  bronze: { label: "برونزي", icon: Star, className: "bg-warning/5 text-warning" },
};

const CustomersPage = () => {
  // Simple recommendation: top-selling products the customer might like
  const getCustomerRecommendations = (customerId: number) => {
    // Simulate based on customer tier — in real app would use purchase history
    const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 3);
    return topProducts;
  };

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
              const tier = tierConfig[customer.tier];
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
                  <TableCell className="font-medium text-foreground">{customer.totalOrders}</TableCell>
                  <TableCell className="font-bold text-foreground">{customer.totalSpent.toLocaleString()} ر.س</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{customer.joinDate}</TableCell>
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
                          {getCustomerRecommendations(customer.id).map((p) => (
                            <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                              <span className="text-2xl">{p.image}</span>
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
