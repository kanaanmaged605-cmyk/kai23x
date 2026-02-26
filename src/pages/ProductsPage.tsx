import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Edit, Trash2, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductForm } from "@/components/ProductForm";
import { useToast } from "@/hooks/use-toast";

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [deleteProduct, setDeleteProduct] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*, categories(name)");
      return data ?? [];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("id, name");
      return data ?? [];
    },
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ["product_recommendations"],
    queryFn: async () => {
      const { data } = await supabase
        .from("product_recommendations")
        .select("*, recommended:products!product_recommendations_recommended_product_id_fkey(id, name, emoji, price)")
        .order("frequency", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = products.filter((p) => {
    const catName = (p as any).categories?.name ?? "";
    return p.name.includes(search) || catName.includes(search);
  });

  const getRecommendations = (productId: string) => {
    return recommendations.filter((r) => r.product_id === productId).map((r) => r.recommended).filter(Boolean);
  };

  const handleEdit = (product: any) => {
    setEditProduct(product);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("products").delete().eq("id", deleteProduct.id);
      if (error) throw error;
      toast({ title: "تم الحذف", description: `تم حذف "${deleteProduct.name}" بنجاح` });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteProduct(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="إدارة المنتجات">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

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
        <Button className="gap-2" onClick={() => { setEditProduct(null); setFormOpen(true); }}>
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
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <span className="text-2xl">{product.emoji}</span>
                    )}
                    <span className="font-medium text-foreground">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="bg-secondary px-2.5 py-1 rounded-full text-xs text-muted-foreground">
                    {(product as any).categories?.name ?? "—"}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-foreground">{product.price} ر.س</TableCell>
                <TableCell>
                  {Number(product.discount) > 0 ? (
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
                        <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="المنتجات المقترحة">
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
                          {getRecommendations(product.id).map((rec: any) => (
                            <div key={rec.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                              <span className="text-2xl">{rec.emoji}</span>
                              <div>
                                <p className="font-medium text-foreground text-sm">{rec.name}</p>
                                <p className="text-xs text-muted-foreground">{rec.price} ر.س</p>
                              </div>
                            </div>
                          ))}
                          {getRecommendations(product.id).length === 0 && (
                            <p className="text-muted-foreground text-sm text-center py-4">لا توجد توصيات بعد</p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <button onClick={() => handleEdit(product)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors" title="تعديل">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteProduct(product)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors" title="حذف">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Product Form Dialog */}
      <ProductForm
        open={formOpen}
        onOpenChange={(v) => { setFormOpen(v); if (!v) setEditProduct(null); }}
        product={editProduct}
        categories={categories}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProduct} onOpenChange={(v) => { if (!v) setDeleteProduct(null); }}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المنتج</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف "{deleteProduct?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ProductsPage;
