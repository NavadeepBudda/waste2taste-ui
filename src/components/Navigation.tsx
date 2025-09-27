import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navigation() {
  return (
    <nav className="flex items-center gap-1">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
            "hover:bg-surface-elevated hover:text-foreground",
            isActive
              ? "bg-surface-elevated text-foreground shadow-sm"
              : "text-foreground-muted"
          )
        }
      >
        Today
      </NavLink>
      <NavLink
        to="/recommendations"
        className={({ isActive }) =>
          cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
            "hover:bg-surface-elevated hover:text-foreground",
            isActive
              ? "bg-surface-elevated text-foreground shadow-sm"
              : "text-foreground-muted"
          )
        }
      >
        Recommendations
      </NavLink>
    </nav>
  );
}