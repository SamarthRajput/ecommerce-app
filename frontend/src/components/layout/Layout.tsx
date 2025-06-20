import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from 'react-hot-toast';
interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Toaster />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
} 