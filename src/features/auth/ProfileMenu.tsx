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
          aria-label="Open profile menu"
          aria-haspopup="menu"
        >
          <User />
          Profile
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="px-4 py-2"
        aria-label="Profile options"
      >
        <DropdownMenuLabel className="truncate">
          <div className="flex my-2">
            <p>{profile?.name}</p>
            {profile?.venueManager && (
              <span className="mx-2 rounded-full bg-teal-100 text-teal-950 px-2 py-0.5 text-xs font-medium">
                Venue Manager
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{profile?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => nav(routes.profile)}>
          Go to Profile
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
