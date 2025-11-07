import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import { routes } from "@/router/routes";

export default function NotFound() {
  const navigate = useNavigate();
  const breadcrumbs = [
    { label: "Home", to: routes.home },
    { label: "Not found" },
  ];
  return (
    <div className="mx-auto max-w-[720px] py-16 px-5 space-y-4">
      <PageBreadcrumbs items={breadcrumbs} />
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          We couldn’t find what you’re looking for.
        </p>
        <Button onClick={() => navigate(routes.home)}>Go home</Button>
      </div>
    </div>
  );
}
