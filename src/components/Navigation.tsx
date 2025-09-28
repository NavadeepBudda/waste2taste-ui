import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navigation() {
  return (
    <nav className="flex items-center gap-1 rounded-full border border-white/50 bg-[hsla(var(--surface-glass))] px-1 py-1 backdrop-blur-md shadow-card dark:border-white/10">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-350 ease-smooth",
            "text-foreground-muted hover:text-foreground",
            "hover:bg-[hsla(var(--surface-glass))]",
            isActive && "text-foreground bg-[hsla(var(--surface-glass))] shadow-sm"
          )
        }
      >
        Today
      </NavLink>
      <NavLink
        to="/recommendations"
        className={({ isActive }) =>
          cn(
            "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-350 ease-smooth",
            "text-foreground-muted hover:text-foreground",
            "hover:bg-[hsla(var(--surface-glass))]",
            isActive && "text-foreground bg-[hsla(var(--surface-glass))] shadow-sm"
          )
        }
      >
        Recommendations
      </NavLink>
      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          cn(
            "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-350 ease-smooth",
            "text-foreground-muted hover:text-foreground",
            "hover:bg-[hsla(var(--surface-glass))]",
            isActive && "text-foreground bg-[hsla(var(--surface-glass))] shadow-sm"
          )
        }
      >
        Analytics
      </NavLink>
    </nav>
  );
}
