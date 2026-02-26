import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: {
    id: string;
    name: string;
    category_id: string | null;
    price: number;
    stock: number;
    discount: number;
    emoji: string | null;
    image_url: string | null;
  } | null;
  categories: { id: string; name: string }[];
}

export function ProductForm({ open, onOpenChange, product, categories }: ProductFormProps) {
  const isEdit = !!product;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [discount, setDiscount] = useState(product?.discount?.toString() ?? "0");
  const [emoji, setEmoji] = useState(product?.emoji ?? "📦");
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setName(product?.name ?? "");
    setCategoryId(product?.category_id ?? "");
    setPrice(product?.price?.toString() ?? "");
    setStock(product?.stock?.toString() ?? "0");
    setDiscount(product?.discount?.toString() ?? "0");
    setEmoji(product?.emoji ?? "📦");
    setImageUrl(product?.image_url ?? "");
    setImageFile(null);
    setImagePreview(product?.image_url ?? null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "خطأ", description: "يرجى اختيار ملف صورة فقط", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "خطأ", description: "حجم الصورة يجب أن يكون أقل من 5MB", variant: "destructive" });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
    setUploading(false);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      toast({ title: "خطأ", description: "يرجى ملء الحقول المطلوبة", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const productData = {
        name: name.trim(),
        category_id: categoryId || null,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        discount: parseFloat(discount) || 0,
        emoji: emoji || "📦",
        image_url: finalImageUrl || null,
      };

      if (isEdit && product) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);
        if (error) throw error;
        toast({ title: "تم التحديث", description: `تم تحديث المنتج "${name}" بنجاح` });
      } else {
        const { error } = await supabase
          .from("products")
          .insert(productData);
        if (error) throw error;
        toast({ title: "تمت الإضافة", description: `تم إضافة المنتج "${name}" بنجاح` });
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
      resetForm();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm(); }}>
      <DialogContent dir="rtl" className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Image Upload */}
          <div>
            <Label className="mb-2 block">صورة المنتج</Label>
            <div className="flex items-start gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors bg-secondary/30 overflow-hidden shrink-0"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="معاينة" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                    <span className="text-[10px] text-muted-foreground">اختر صورة</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 w-full"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? "جارٍ الرفع..." : "رفع صورة"}
                </Button>
                {imagePreview && (
                  <Button type="button" variant="ghost" size="sm" onClick={removeImage} className="gap-2 w-full text-destructive hover:text-destructive">
                    <X className="h-4 w-4" />
                    إزالة الصورة
                  </Button>
                )}
                <p className="text-[10px] text-muted-foreground">JPG, PNG, WebP — أقصى حجم 5MB</p>
              </div>
            </div>
          </div>

          {/* Name + Emoji */}
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <div>
              <Label htmlFor="name">اسم المنتج *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: سماعات لاسلكية" required className="mt-1.5 bg-secondary/50 border-border" maxLength={100} />
            </div>
            <div>
              <Label htmlFor="emoji">الإيموجي</Label>
              <Input id="emoji" value={emoji} onChange={(e) => setEmoji(e.target.value)} className="mt-1.5 text-center text-xl bg-secondary/50 border-border" maxLength={4} />
            </div>
          </div>

          {/* Category */}
          <div>
            <Label>الفئة</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="mt-1.5 bg-secondary/50 border-border">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price + Discount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="price">السعر (ر.س) *</Label>
              <Input id="price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" required className="mt-1.5 bg-secondary/50 border-border" />
            </div>
            <div>
              <Label htmlFor="discount">الخصم (%)</Label>
              <Input id="discount" type="number" min="0" max="100" step="0.5" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" className="mt-1.5 bg-secondary/50 border-border" />
            </div>
          </div>

          {/* Stock */}
          <div>
            <Label htmlFor="stock">المخزون</Label>
            <Input id="stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" className="mt-1.5 bg-secondary/50 border-border" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1 gap-2" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "حفظ التعديلات" : "إضافة المنتج"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
