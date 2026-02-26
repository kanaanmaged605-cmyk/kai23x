import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { products, recommendations, type Product } from "@/data/mockData";
import { Search, Plus, Edit, Trash2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = products.filter((p) =>
    p.name.includes(search) || p.category.includes(search)
  );

  const getRecommendations = (productId: number) => {
    const recIds = recommendations[productId] || [];
    return recIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];
  };

  return (
    <DashboardLayout title="إدارة المنتجات">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 bg-card border-border"
          />
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة منتج
        </Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="text-right">المنتج</TableHead>
              <TableHead className="text-right">الفئة</TableHead>
              <TableHead className="text-right">السعر</TableHead>
              <TableHead className="text-right">الخصم</TableHead>
              <TableHead className="text-right">المخزون</TableHead>
              <TableHead className="text-right">المبيعات</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id} className="hover:bg-secondary/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{product.image}</span>
                    <span className="font-medium text-foreground">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="bg-secondary px-2.5 py-1 rounded-full text-xs text-muted-foreground">{product.category}</span>
                </TableCell>
                <TableCell className="font-medium text-foreground">{product.price} ر.س</TableCell>
                <TableCell>
                  {product.discount > 0 ? (
                    <span className="text-success font-medium text-sm">{product.discount}%</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={product.stock <= 5 ? "text-destructive font-bold" : "text-foreground"}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="text-foreground">{product.sold}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          title="المنتجات المقترحة"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent dir="rtl" className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            منتجات مقترحة لـ {product.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 mt-4">
                          {getRecommendations(product.id).map((rec) => (
                            <div key={rec.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                              <span className="text-2xl">{rec.image}</span>
                              <div>
                                <p className="font-medium text-foreground text-sm">{rec.name}</p>
                                <p className="text-xs text-muted-foreground">{rec.price} ر.س</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;
