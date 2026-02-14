import Link from "next/link";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import { CartCount } from "@/components/cart/CartCount";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationButton } from "@/components/notifications/NotificationButton";
import { PushNotificationManager } from "@/components/notifications/PushNotificationManager";

// Extend the session user type to include role
interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  role?: string;
}

// ... imports stay same

export async function Header() {
  const session = await auth();

  return (
    <>
      <PushNotificationManager />
      <header className="sticky top-0 z-50 w-full mb-8">
        <div className="mx-4 mt-4 rounded-2xl border border-white/10 bg-background/70 backdrop-blur-xl shadow-2xl supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-heading font-bold tracking-tighter bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent group-hover:from-primary group-hover:to-purple-400 transition-all duration-300">
                STELLA.TECH
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              {['Products', 'New Arrivals', 'Deals', 'Support'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="relative hover:text-foreground transition-colors py-2 group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block group">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="search"
                  placeholder="Search gear..."
                  className="h-9 w-64 rounded-full border border-input bg-background/50 pl-9 pr-4 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:w-72"
                />
              </div>

              <div className="pl-4 flex items-center gap-2 border-l border-border/50">
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary">
                    <ShoppingCart className="h-5 w-5" />
                    <CartCount />
                  </Button>
                </Link>

                <NotificationButton />
                <ThemeToggle />

                {session?.user ? (
                  <UserMenu 
                    user={{
                      name: session.user.name,
                      email: session.user.email,
                      role: (session.user as ExtendedUser).role,
                    }}
                  />
                ) : (
                  <Button asChild variant="default" size="sm" className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                    <Link href="/login">Sign In</Link>
                  </Button>
                )}
              </div>

              <button className="md:hidden p-2 hover:bg-accent rounded-md">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
