import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-[720px] py-16 px-5 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        We couldn’t find what you’re looking for.
      </p>
      <Button onClick={() => navigate("/")}>Go home</Button>
    </div>
  );
}
