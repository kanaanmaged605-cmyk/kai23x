import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, ArrowLeftRight, Loader2 } from "lucide-react";

const RecommendationsPage = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*, categories(name)");
      return data ?? [];
    },
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ["product_recommendations_full"],
    queryFn: async () => {
      const { data } = await supabase
        .from("product_recommendations")
        .select("*, recommended:products!product_recommendations_recommended_product_id_fkey(id, name, emoji, price)")
        .order("frequency", { ascending: false });
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout title="نظام التوصيات">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="نظام التوصيات">
      {/* Algorithm Info */}
      <div className="glass-card rounded-xl p-6 mb-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg mb-1">خوارزمية التوصية</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              يعتمد النظام على تحليل سجل المشتريات لاستخراج المنتجات الأكثر شراءً معاً
              باستخدام <span className="text-primary font-medium">Association Rules</span> و
              <span className="text-primary font-medium"> Cosine Similarity</span>.
              البيانات محفوظة في قاعدة البيانات الحقيقية.
            </p>
          </div>
        </div>
      </div>

      {/* SQL Preview */}
      <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in">
        <h4 className="font-bold text-foreground mb-3 text-sm">استعلام التوصية (SQL)</h4>
        <pre className="bg-secondary/80 rounded-lg p-4 text-xs text-foreground font-mono overflow-x-auto" dir="ltr">
{`SELECT p1.product_id, p2.product_id, COUNT(*) as frequency
FROM order_items p1
JOIN order_items p2 
  ON p1.order_id = p2.order_id 
  AND p1.product_id <> p2.product_id
GROUP BY p1.product_id, p2.product_id
ORDER BY frequency DESC;`}
        </pre>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => {
          const recs = recommendations
            .filter((r) => r.product_id === product.id)
            .map((r) => ({ ...r.recommended, frequency: r.frequency, similarity_score: r.similarity_score }));

          return (
            <div key={product.id} className="glass-card rounded-xl p-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{product.emoji}</span>
                <div>
                  <p className="font-bold text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{(product as any).categories?.name ?? "—"} — {product.price} ر.س</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <ArrowLeftRight className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">يُشترى عادةً مع</span>
              </div>

              <div className="space-y-2">
                {recs.length > 0 ? recs.map((rec: any) => (
                  <div key={rec.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/50">
                    <span className="text-xl">{rec.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{rec.name}</p>
                      <p className="text-xs text-muted-foreground">{rec.price} ر.س</p>
                    </div>
                    <div className="text-left">
                      <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                        {rec.frequency}×
                      </span>
                      {rec.similarity_score && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          تشابه: {(Number(rec.similarity_score) * 100).toFixed(0)}%
                        </p>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-sm text-center py-2">لا توجد توصيات</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default RecommendationsPage;
