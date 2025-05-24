import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  className?: string;
}

export default function ServiceCard({
  title,
  description,
  icon,
  href,
  className,
}: ServiceCardProps) {
  return (
    <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
      <Card
        className={cn(
          "h-full border-none shadow-lg hover:shadow-xl transition-shadow",
          className,
        )}
      >
        <CardHeader className="pb-3">
          <div className="w-12 h-12 rounded-md bg-accent/10 text-accent flex items-center justify-center mb-4">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base text-muted-foreground">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent text-accent hover:text-accent/80 font-medium"
            asChild
          >
            <a href={href}>Learn More</a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
