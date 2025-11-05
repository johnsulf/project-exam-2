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
  label: string;
  to?: string;
  icon?: ReactNode;
};

type Props = {
  items: Item[];
  className?: string;
};

export function PageBreadcrumbs({ items, className }: Props) {
  if (!items.length) return null;

  return (
    <Breadcrumb className={cn("hidden sm:block", className)}>
      <BreadcrumbList>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <Fragment key={`${item.label}-${idx}`}>
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
