import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

type Item = {
  key?: string;
  label: string;
  to?: string;
  icon?: ReactNode;
};

type Props = {
  items: Item[];
  className?: string;
};

/**
 * Renders a responsive breadcrumb trail using shadcn primitives.
 * @param items - Ordered breadcrumb items describing the current navigation path.
 * @param className - Optional wrapper class name.
 */
export function PageBreadcrumbs({ items, className }: Props) {
  if (!items.length) return null;

  return (
    <Breadcrumb className={cn("hidden sm:block", className)}>
      <BreadcrumbList>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const itemKey = item.key ?? item.to ?? item.label;
          return (
            <Fragment key={itemKey}>
              <BreadcrumbItem>
                {item.to && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link
                      to={item.to}
                      className="inline-flex items-center gap-1 text-sm"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="inline-flex items-center gap-1 text-sm">
                    {item.icon}
                    <span>{item.label}</span>
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
