import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground">Administration</p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => {/* navigate to profile */}}>
          <User className="mr-2 h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {/* navigate to settings */}}>
          <Settings className="mr-2 h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}