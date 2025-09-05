import { NavLink } from "react-router-dom";
import Logo from "../../assets/Logo.svg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { User } from "lucide-react";

export function Header() {
  return (
    <header className="w-full bg-sky-50">
      <div className="p-12 flex justify-between items-center">
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
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </section>

        {/* Profile icon */}
        <a
          href="/profile"
          aria-label="Go to profile"
          className="bg-neutral-200 p-2 rounded-xl"
        >
          <User />
        </a>
      </div>
    </header>
  );
}
