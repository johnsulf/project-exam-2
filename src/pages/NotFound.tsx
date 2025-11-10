import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import { routes } from "@/router/routes";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CircleQuestionMark, Home } from "lucide-react";

export default function NotFound() {
  const breadcrumbs = [
    { label: "Home", to: routes.home },
    { label: "Not found" },
  ];
  return (
    <div className="mx-auto max-w-screen-xl space-y-6">
      <PageBreadcrumbs items={breadcrumbs} />
      <div className="border rounded-lg bg-card">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CircleQuestionMark />
            </EmptyMedia>
            <EmptyTitle>Page not found</EmptyTitle>
            <EmptyDescription>
              We couldn’t find what you’re looking for.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link to="/">
                <Home />
                Go Home
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
}
