import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "@/components/ui/BackToTop";
import Chatbot from "@/components/chat/Chatbot";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <BackToTop />
      <Chatbot />
    </div>
  );
}
