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

export function ProfileMenu() {
  const { profile, signOut } = useAuth();
  const nav = useNavigate();
  const initials = profile?.name?.[0]?.toUpperCase() ?? "U";
  const accountLabel = profile?.name || profile?.email || "your account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl"
          aria-label={`Open profile menu for ${accountLabel}`}
          aria-haspopup="menu"
        >
          <span className="font-semibold">{initials}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        aria-label="Profile options"
      >
        <DropdownMenuLabel className="truncate">
          {profile?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => nav("/profile")}>
          Profile
        </DropdownMenuItem>
        {profile?.venueManager && (
          <DropdownMenuItem onSelect={() => nav("/manage")}>
            Manage venues
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => {
            signOut();
            nav("/");
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
