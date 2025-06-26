import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/src/context/AuthContext";
interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
        <Header />
        <Toaster />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
} 