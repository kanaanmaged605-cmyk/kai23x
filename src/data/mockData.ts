// Mock data for the admin dashboard

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  image: string;
  discount: number;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
}

export const products: Product[] = [
  { id: 1, name: "سماعات لاسلكية Pro", category: "إلكترونيات", price: 299, stock: 45, sold: 312, image: "🎧", discount: 10 },
  { id: 2, name: "ساعة ذكية Ultra", category: "إلكترونيات", price: 599, stock: 23, sold: 189, image: "⌚", discount: 0 },
  { id: 3, name: "حقيبة جلدية فاخرة", category: "أزياء", price: 189, stock: 67, sold: 245, image: "👜", discount: 15 },
  { id: 4, name: "عطر مسك الليل", category: "عطور", price: 150, stock: 5, sold: 520, image: "🧴", discount: 0 },
  { id: 5, name: "نظارة شمسية كلاسيك", category: "إكسسوارات", price: 120, stock: 89, sold: 178, image: "🕶️", discount: 20 },
  { id: 6, name: "حذاء رياضي Air", category: "أحذية", price: 350, stock: 3, sold: 432, image: "👟", discount: 5 },
  { id: 7, name: "كاميرا ديجيتال 4K", category: "إلكترونيات", price: 1200, stock: 12, sold: 87, image: "📷", discount: 0 },
  { id: 8, name: "قميص قطني Premium", category: "أزياء", price: 89, stock: 120, sold: 356, image: "👔", discount: 0 },
];

export const orders: Order[] = [
  { id: "ORD-2024-001", customer: "أحمد محمد", email: "ahmed@mail.com", date: "2024-12-15", total: 599, status: "delivered", items: 2 },
  { id: "ORD-2024-002", customer: "سارة علي", email: "sara@mail.com", date: "2024-12-16", total: 338, status: "shipped", items: 3 },
  { id: "ORD-2024-003", customer: "خالد عبدالله", email: "khaled@mail.com", date: "2024-12-17", total: 1200, status: "processing", items: 1 },
  { id: "ORD-2024-004", customer: "نورا حسن", email: "noura@mail.com", date: "2024-12-17", total: 269, status: "pending", items: 2 },
  { id: "ORD-2024-005", customer: "محمد يوسف", email: "m.youssef@mail.com", date: "2024-12-18", total: 750, status: "delivered", items: 4 },
  { id: "ORD-2024-006", customer: "فاطمة أحمد", email: "fatima@mail.com", date: "2024-12-18", total: 189, status: "cancelled", items: 1 },
  { id: "ORD-2024-007", customer: "عمر خالد", email: "omar@mail.com", date: "2024-12-19", total: 470, status: "shipped", items: 2 },
  { id: "ORD-2024-008", customer: "ليلى سعيد", email: "layla@mail.com", date: "2024-12-19", total: 899, status: "processing", items: 3 },
];

export const customers: Customer[] = [
  { id: 1, name: "أحمد محمد", email: "ahmed@mail.com", totalOrders: 15, totalSpent: 4520, joinDate: "2024-01-15", tier: "platinum" },
  { id: 2, name: "سارة علي", email: "sara@mail.com", totalOrders: 8, totalSpent: 2100, joinDate: "2024-03-20", tier: "gold" },
  { id: 3, name: "خالد عبدالله", email: "khaled@mail.com", totalOrders: 12, totalSpent: 3800, joinDate: "2024-02-10", tier: "gold" },
  { id: 4, name: "نورا حسن", email: "noura@mail.com", totalOrders: 5, totalSpent: 890, joinDate: "2024-06-05", tier: "silver" },
  { id: 5, name: "محمد يوسف", email: "m.youssef@mail.com", totalOrders: 22, totalSpent: 7200, joinDate: "2023-11-01", tier: "platinum" },
  { id: 6, name: "فاطمة أحمد", email: "fatima@mail.com", totalOrders: 3, totalSpent: 450, joinDate: "2024-08-15", tier: "bronze" },
];

export const salesData = [
  { month: "يناير", sales: 12400, orders: 145 },
  { month: "فبراير", sales: 15800, orders: 178 },
  { month: "مارس", sales: 18200, orders: 210 },
  { month: "أبريل", sales: 16500, orders: 192 },
  { month: "مايو", sales: 21000, orders: 245 },
  { month: "يونيو", sales: 19800, orders: 230 },
  { month: "يوليو", sales: 24500, orders: 285 },
  { month: "أغسطس", sales: 22100, orders: 260 },
  { month: "سبتمبر", sales: 26800, orders: 310 },
  { month: "أكتوبر", sales: 28400, orders: 332 },
  { month: "نوفمبر", sales: 31200, orders: 365 },
  { month: "ديسمبر", sales: 35000, orders: 410 },
];

export const categoryData = [
  { name: "إلكترونيات", value: 35, fill: "hsl(var(--chart-1))" },
  { name: "أزياء", value: 28, fill: "hsl(var(--chart-2))" },
  { name: "عطور", value: 18, fill: "hsl(var(--chart-3))" },
  { name: "إكسسوارات", value: 12, fill: "hsl(var(--chart-4))" },
  { name: "أحذية", value: 7, fill: "hsl(var(--chart-5))" },
];

export const recommendations: Record<number, number[]> = {
  1: [2, 5], // سماعات → ساعة ذكية + نظارة
  2: [1, 7], // ساعة → سماعات + كاميرا
  3: [5, 8], // حقيبة → نظارة + قميص
  4: [3, 5], // عطر → حقيبة + نظارة
  5: [3, 1], // نظارة → حقيبة + سماعات
  6: [8, 5], // حذاء → قميص + نظارة
  7: [2, 1], // كاميرا → ساعة + سماعات
  8: [3, 6], // قميص → حقيبة + حذاء
};
