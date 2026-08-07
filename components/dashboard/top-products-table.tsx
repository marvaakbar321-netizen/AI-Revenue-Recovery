import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TopProduct } from "@/lib/dashboard-data";

export function TopProductsTable({ products }: { products: TopProduct[] }) {
  return (
    <Card className="border border-[var(--border)]">
      <CardHeader>
        <div>
          <CardTitle>Top revenue drivers</CardTitle>
          <p className="text-sm text-[var(--muted)]">The products and categories contributing most to revenue this quarter.</p>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-5">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
          <thead>
            <tr>
              <th className="pb-3 font-semibold text-[var(--muted)]">Product</th>
              <th className="pb-3 font-semibold text-[var(--muted)]">Category</th>
              <th className="pb-3 font-semibold text-[var(--muted)]">Revenue</th>
              <th className="pb-3 font-semibold text-[var(--muted)]">Change</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.name} className="rounded-[1.5rem] bg-[var(--surface)] shadow-[0_16px_30px_-22px_rgba(15,23,42,0.08)]">
                <td className="py-4 pr-6 font-semibold text-[var(--text)]">{product.name}</td>
                <td className="py-4 pr-6 text-[var(--muted)]">{product.category}</td>
                <td className="py-4 pr-6 font-semibold text-[var(--text)]">{product.revenue}</td>
                <td className="py-4 text-[var(--muted)]">
                  <Badge variant={product.trend === "positive" ? "success" : "danger"}>{product.change}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
