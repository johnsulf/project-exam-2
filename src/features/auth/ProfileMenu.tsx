import { useAuth } from "@/features/auth/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { routes } from "@/router/routes";
import { User } from "lucide-react";

export function ProfileMenu() {
  const { profile, signOut } = useAuth();
  const nav = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl"
          aria-label="Open profile menu"
          aria-haspopup="menu"
        >
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        aria-label="Profile options"
      >
        <DropdownMenuLabel className="truncate">
          {profile?.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => nav(routes.profile)}>
          Profile
        </DropdownMenuItem>
        {profile?.venueManager && (
          <DropdownMenuItem onSelect={() => nav(routes.manage)}>
            Manage venues
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => {
            signOut();
            nav(routes.home);
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
