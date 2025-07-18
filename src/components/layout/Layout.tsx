import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "@/components/ui/BackToTop";
import ChatbotPlaceholder from "@/components/chat/ChatbotPlaceholder";

interface LayoutProps {
  children: ReactNode;
  hideDefaultHeader?: boolean;
}

export default function Layout({
  children,
  hideDefaultHeader = false,
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {!hideDefaultHeader && <Header />}
      <main className="flex-grow">{children}</main>
      <Footer />
      <BackToTop />
      <ChatbotPlaceholder />
    </div>
  );
}
