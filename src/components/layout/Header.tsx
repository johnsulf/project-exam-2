// src/components/layout/Header.tsx
import { Link, NavLink, useLocation, type Location } from "react-router-dom";
import Logo from "@/assets/Logo.svg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { User } from "lucide-react";
import { useAuth } from "@/features/auth/store";
import { ProfileMenu } from "@/features/auth/ProfileMenu";
import { Button } from "@/components/ui/button";

export function Header() {
  const { token, profile } = useAuth();
  const isManager = !!profile?.venueManager;

  const location = useLocation();
  const fromState =
    (location.state as { from?: Location | string } | null | undefined)?.from ??
    location;

  return (
    <header className="w-full border-b border-b-neutral-200 bg-white">
      <div className="p-4 flex justify-between items-center max-w-[1280px] mx-auto">
        <section className="flex gap-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <img
              src={Logo}
              alt="Holidaze logo"
              width={74}
              height={74}
              className="rounded-xl"
            />
          </NavLink>

          {/* Nav */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-4"
          >
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <NavLink to="/venues">Venues</NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {isManager && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <NavLink to="/manage">Manage</NavLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </section>

        {/* Right side */}
        <section>
          {token ? (
            <ProfileMenu />
          ) : (
            <Button
              variant="secondary"
              className="rounded-xl"
              aria-label="Sign in or register"
              asChild
            >
              <Link to="/login" state={{ from: fromState }}>
                <User className="mr-2 h-4 w-4" /> Sign in
              </Link>
            </Button>
          )}
        </section>
      </div>
    </header>
  );
}
