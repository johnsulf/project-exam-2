import { Link, NavLink, useLocation, type Location } from "react-router-dom";
import Logo from "@/assets/Logo.svg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, User } from "lucide-react";
import { useAuth } from "@/features/auth/store";
import { ProfileMenu } from "@/features/auth/ProfileMenu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { routes } from "@/router/routes";

export function Header() {
  const { token, profile } = useAuth();
  const isManager = !!profile?.venueManager;

  const location = useLocation();
  const fromState =
    (location.state as { from?: Location | string } | null | undefined)?.from ??
    location;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
      isActive
        ? "text-primary"
        : "text-foreground hover:text-primary focus-visible:text-primary"
    }`;

  return (
    <header className="w-full" role="banner">
      <div className="p-4 flex justify-between items-center max-w-[1280px] mx-auto">
        <section className="flex items-center gap-3">
          {/* Logo */}
          <NavLink
            to={routes.home}
            className="flex items-center gap-2 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Holidaze home"
          >
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
            aria-labelledby="primary-navigation-label"
            className="hidden md:flex items-center gap-4"
          >
            <span id="primary-navigation-label" className="sr-only">
              Primary navigation
            </span>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <NavLink to={routes.venues}>Venues</NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {isManager && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <NavLink to={routes.manage}>Manage</NavLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </section>

        {/* Right side */}
        <section className="flex gap-2 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-0">
              <SheetHeader className="p-4 pb-2">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav
                aria-labelledby="mobile-navigation-label"
                className="flex flex-col gap-1 px-4 pb-6"
              >
                <span id="mobile-navigation-label" className="sr-only">
                  Mobile navigation
                </span>
                <SheetClose asChild>
                  <NavLink to={routes.venues} className={navLinkClass}>
                    Venues
                  </NavLink>
                </SheetClose>
                {isManager && (
                  <SheetClose asChild>
                    <NavLink to={routes.manage} className={navLinkClass}>
                      Manage
                    </NavLink>
                  </SheetClose>
                )}
                {token ? (
                  <SheetClose asChild>
                    <NavLink to={routes.profile} className={navLinkClass}>
                      Profile
                    </NavLink>
                  </SheetClose>
                ) : (
                  <SheetClose asChild>
                    <Button
                      variant="secondary"
                      className="mt-2 justify-start"
                      asChild
                    >
                      <Link to={routes.auth.login} state={{ from: fromState }}>
                        <User className="mr-2 h-4 w-4" aria-hidden="true" />
                        Sign in
                      </Link>
                    </Button>
                  </SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          {token ? (
            <ProfileMenu />
          ) : (
            <Button
              variant="secondary"
              className="rounded-xl"
              aria-label="Sign in or register"
              asChild
            >
              <Link to={routes.auth.login} state={{ from: fromState }}>
                <User className="mr-2 h-4 w-4" aria-hidden="true" /> Sign in
              </Link>
            </Button>
          )}
        </section>
      </div>
    </header>
  );
}
