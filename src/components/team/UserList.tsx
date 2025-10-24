import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export interface RegisteredUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  department?: string;
  status?: "active" | "inactive";
}

interface UserListProps {
  users: RegisteredUser[];
  isLoading?: boolean;
  onHover?: (user: RegisteredUser | null) => void;
  onUserClick?: (user: RegisteredUser, rect: DOMRect) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  isLoading,
  onHover,
  onUserClick,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!isLoading && users.length === 0) {
    return (
      <div className="p-6 rounded-lg border border-[#A7967E]/20 bg-white text-center">
        <p className="text-sm text-muted-foreground">No team members found.</p>
        <p className="text-xs text-accent mt-1">
          Try adjusting filters or inviting colleagues.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {users.map((user, index) => (
        <motion.button
          key={user.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          className="text-left p-4 rounded-lg border border-[#A7967E]/20 hover:border-[#A7967E]/40 hover:shadow-sm bg-white"
          onMouseEnter={(e) => {
            onHover?.(user);
          }}
          onMouseLeave={() => onHover?.(null)}
          onClick={(e) => {
            const rect = (
              e.currentTarget as HTMLButtonElement
            ).getBoundingClientRect();
            onUserClick?.(user, rect);
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#142E54]">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Badge
              variant="secondary"
              className={`${user.role === "admin" ? "bg-[#142E54] text-white" : "bg-[#A7967E] text-white"}`}
            >
              {user.role}
            </Badge>
          </div>
          {user.department && (
            <p className="text-xs text-accent mt-2">{user.department}</p>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default UserList;
