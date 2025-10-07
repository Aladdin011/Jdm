import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Search, Shield, Settings, Users, BarChart3 } from "lucide-react";
import { usersAPI } from "@/services/api";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const normalizeUsersResponse = (input: unknown): any[] => {
    if (Array.isArray(input)) return input;
    if (input && typeof input === "object") {
      const obj = input as { data?: unknown };
      if (Array.isArray(obj.data)) return obj.data as any[];
    }
    return [];
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    usersAPI.getAllUsers()
      .then((list: unknown) => {
        const result = normalizeUsersResponse(list);
        setUsers(result);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [open]);

  const filteredUsers = useMemo(() => {
    if (!query) return users.slice(0, 10);
    return users.filter((u) =>
      `${u.firstName || ""} ${u.lastName || ""} ${u.email || ""}`
        .toLowerCase()
        .includes(query.toLowerCase())
    ).slice(0, 10);
  }, [query, users]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Search commands, pages, or users..." onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>{loading ? "Loading..." : "No results found."}</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => navigate("/admin")}> <Search className="mr-2 h-4 w-4" /> Dashboard</CommandItem>
            <CommandItem onSelect={() => navigate("/users")}> <Users className="mr-2 h-4 w-4" /> User Management</CommandItem>
            <CommandItem onSelect={() => navigate("/analytics")}> <BarChart3 className="mr-2 h-4 w-4" /> Analytics</CommandItem>
            <CommandItem onSelect={() => navigate("/security")}> <Shield className="mr-2 h-4 w-4" /> Security Center</CommandItem>
            <CommandItem onSelect={() => navigate("/settings")}> <Settings className="mr-2 h-4 w-4" /> System Settings</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Users">
            {filteredUsers.map((u) => (
              <CommandItem key={u.id} onSelect={() => navigate(`/users?query=${encodeURIComponent(u.email)}`)}>
                <Users className="mr-2 h-4 w-4" /> {u.firstName} {u.lastName} – {u.email}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}