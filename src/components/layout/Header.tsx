import { Link, NavLink, useLocation, type Location } from "react-router-dom";
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
  const { token } = useAuth();

  const location = useLocation();
  const fromState =
    (location.state as { from?: Location | string } | null | undefined)?.from ??
    location;

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border backdrop-blur supports-[backdrop-filter]:bg-background/70"
      role="banner"
    >
      <div className="p-4 flex justify-between items-center max-w-screen-xl mx-auto">
        <section className="flex items-center gap-4">
          {/* Logo */}
          <NavLink
            to={routes.home}
            className="flex items-center gap-2 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Holidaze home"
          >
            <div className="flex font-bold text-2xl">
              <span className="text-primary">holidaze</span>
              <span className="text-teal-600">&nbsp;.</span>
            </div>
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
                    <NavLink to={routes.home}>Home</NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <NavLink to={routes.venues}>Venues</NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <NavLink to={routes.about}>About</NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
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
                className="md:hidden"
                aria-label="Open navigation"
              >
                <Menu aria-hidden="true" />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              <SheetHeader className="p-4 pb-2">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav
                aria-labelledby="mobile-navigation-label"
                className="flex flex-col gap-4 px-4"
              >
                <span id="mobile-navigation-label" className="sr-only">
                  Mobile navigation
                </span>
                <SheetClose asChild>
                  <NavLink to={routes.home}>Home</NavLink>
                </SheetClose>
                <SheetClose asChild>
                  <NavLink to={routes.venues}>Venues</NavLink>
                </SheetClose>
                <SheetClose asChild>
                  <NavLink to={routes.about}>About</NavLink>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
          {token ? (
            <ProfileMenu />
          ) : (
            <Button variant="outline" aria-label="Sign in or register" asChild>
              <Link to={routes.auth.login} state={{ from: fromState }}>
                <User aria-hidden="true" /> Sign in
              </Link>
            </Button>
          )}
        </section>
      </div>
    </header>
  );
}
