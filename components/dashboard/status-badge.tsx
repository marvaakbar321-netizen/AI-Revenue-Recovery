import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { HTMLAttributes } from "react";

const statusVariants: Record<string, BadgeProps["variant"]> = {
  Paid: "success",
  Pending: "warning",
  Failed: "danger",
  Processing: "info",
  Shipped: "default",
  Completed: "success",
  Delivered: "success",
  Cancelled: "danger",
};

export function StatusBadge({ status, className, ...props }: HTMLAttributes<HTMLSpanElement> & { status: string }) {
  return (
    <Badge variant={statusVariants[status] ?? "default"} className={className} {...props}>
      {status}
    </Badge>
  );
}
