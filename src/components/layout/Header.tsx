import { NavLink } from "react-router-dom";
import Logo from "../../assets/Logo.svg";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";

export function Header() {
  return (
    <header className="w-full border-b bg-sky-50 text-card-foreground">
      <div className="mx-auto max-w-[1280px] px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          {/* TODO: add logo */}
          <span
            className="inline-block h-6 w-6 rounded-full bg-secondary"
            aria-hidden
          >
            <img src={Logo} alt="Holidaze logo" />
          </span>
          <span className="font-semibold">holidaze</span>
        </NavLink>

        {/* Nav */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Profile icon placeholder */}
        <button
          aria-label="Open profile menu"
          className="h-9 w-9 rounded-full border bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </header>
  );
}
