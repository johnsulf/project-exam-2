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

export function PageBreadcrumbs({ items }: Props) {
  if (!items.length) return null;
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            const itemKey = item.key ?? item.to ?? item.label;
            return (
              <Fragment key={itemKey}>
                <BreadcrumbItem>
                  {item.to && !isLast ? (
                    <BreadcrumbLink asChild>
                      <Link to={item.to} className="">
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="font-medium">
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
    </>
  );
}
