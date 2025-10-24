import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Settings, Shield, Users, BarChart3 } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import CommandPalette from "./CommandPalette";

interface HeaderProps {
  onToggleSidebar: () => void;
  onNavigate?: (path: string) => void;
  yearSelector?: React.ReactNode;
  onExportData?: () => void;
}

export default function Header({
  onToggleSidebar,
  onNavigate,
  yearSelector,
  onExportData,
}: HeaderProps) {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur">
      <div className="flex items-center gap-2 px-4 py-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold tracking-tight">Administration</h1>
        {/* Desktop/tablet actions */}
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" /> User Management
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onNavigate?.("/users")}>
                Manage Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.("/roles")}>
                Roles & Permissions
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => onNavigate?.("/analytics")}
          >
            <BarChart3 className="h-4 w-4" /> Analytics
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => onNavigate?.("/security")}
          >
            <Shield className="h-4 w-4" /> Security Center
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => onNavigate?.("/settings")}
          >
            <Settings className="h-4 w-4" /> System Settings
          </Button>
          {yearSelector}
          <Button variant="default" onClick={onExportData}>
            Export Data
          </Button>
          <Button variant="ghost" onClick={() => setCmdOpen(true)}>
            CTRL + K
          </Button>
          <ProfileDropdown />
        </div>
        {/* Mobile compressed actions */}
        <div className="ml-auto sm:hidden flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Menu className="h-4 w-4" /> Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onNavigate?.("/users")}>
                Manage Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.("/roles")}>
                Roles & Permissions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.("/analytics")}>
                Analytics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.("/security")}>
                Security Center
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.("/settings")}>
                System Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportData}>
                Export Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCmdOpen(true)}>
                Open Command Palette
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ProfileDropdown />
        </div>
      </div>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </header>
  );
}
