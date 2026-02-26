import { DashboardLayout } from "@/components/DashboardLayout";
import { products, recommendations } from "@/data/mockData";
import { Sparkles, ArrowLeftRight } from "lucide-react";

const RecommendationsPage = () => {
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
              يتم حساب معدل التكرار (Frequency) لكل زوج من المنتجات التي تظهر في نفس الطلب.
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
          const recIds = recommendations[product.id] || [];
          const recs = recIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);

          return (
            <div key={product.id} className="glass-card rounded-xl p-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{product.image}</span>
                <div>
                  <p className="font-bold text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category} — {product.price} ر.س</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <ArrowLeftRight className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">يُشترى عادةً مع</span>
              </div>

              <div className="space-y-2">
                {recs.map((rec) => rec && (
                  <div key={rec.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/50">
                    <span className="text-xl">{rec.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{rec.name}</p>
                      <p className="text-xs text-muted-foreground">{rec.price} ر.س</p>
                    </div>
                    <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                      مقترح
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default RecommendationsPage;
