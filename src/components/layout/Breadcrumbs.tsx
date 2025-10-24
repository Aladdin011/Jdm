import { useLocation, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  path?: string;
}

const labelMap: Record<string, string> = {
  admin: "Administration",
  users: "User Management",
  analytics: "Analytics",
  security: "Security Center",
  settings: "System Settings",
  staff: "Staff",
};

export default function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = parts.map((p, i) => ({
    label:
      labelMap[p] ||
      p.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    path: "/" + parts.slice(0, i + 1).join("/"),
  }));

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="px-6 py-2">
      <ol className="flex items-center text-sm text-muted-foreground gap-2">
        {crumbs.map((c, idx) => (
          <li key={c.path} className="flex items-center">
            {idx < crumbs.length - 1 ? (
              <Link to={c.path!} className="hover:text-foreground">
                {c.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{c.label}</span>
            )}
            {idx < crumbs.length - 1 && (
              <ChevronRight className="mx-2 h-4 w-4" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
