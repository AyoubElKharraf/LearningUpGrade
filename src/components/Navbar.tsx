import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, GraduationCap, BarChart3, MessageCircle, User, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthDialog } from "@/components/AuthDialog";
import { getAuthUser, logout, type AuthUser } from "@/lib/auth";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: BookOpen },
  { label: "My Courses", path: "/courses", icon: GraduationCap },
  { label: "Progress", path: "/progress", icon: BarChart3 },
];

export const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 md:px-4">
      <div className="container flex max-w-[1400px] flex-col gap-0">
        {/* Barre type aperçu (image 2) : fond sombre, coins sup. arrondis, marque LearningUpgrade */}
        <div className="flex h-14 items-center justify-between gap-3 rounded-t-2xl border border-white/10 bg-[#1e293b] px-3 shadow-lg shadow-black/20 md:h-[3.25rem] md:px-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src="/learnspark-logo.png"
              alt="LearningUpgrade"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-2xl object-cover shadow-sm"
            />
            <span className="truncate font-sans text-base font-semibold tracking-tight text-white md:text-[17px]">
              LearningUpgrade
            </span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isProgress = item.path === "/progress";
              const isDashboardStyle = item.path === "/dashboard" || item.path === "/courses";
              const linkClass =
                isProgress && isActive
                  ? "flex items-center gap-2 rounded-full bg-[#fff4ed] px-4 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/15 transition-colors duration-150 hover:bg-[#ffefe4] hover:text-primary"
                  : isDashboardStyle && isActive
                    ? "flex items-center gap-2 rounded-full bg-[#4a4a4a] px-4 py-2 text-sm font-semibold text-white shadow-inner transition-colors duration-150 hover:bg-[#555555]"
                    : isActive
                      ? "flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition-colors duration-150"
                      : "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors duration-150 hover:bg-white/10 hover:text-white";
              return (
                <Link key={item.path} to={item.path} className={linkClass}>
                  <item.icon className="h-4 w-4 shrink-0 opacity-90" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-zinc-300 hover:bg-white/10 hover:text-white"
              aria-label="Messages"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-2 px-3 text-zinc-300 hover:bg-white/10 hover:text-white"
                  aria-label="Compte"
                >
                  <User className="h-5 w-5" />
                  {user ? (
                    <span className="max-w-[120px] truncate text-sm font-medium">
                      {user.name}{" "}
                      <span className="text-xs font-semibold text-zinc-400">
                        ({user.role === "admin" ? "Admin" : "Client"})
                      </span>
                    </span>
                  ) : null}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[240px] bg-[#0b1220] text-white border border-white/10"
              >
                {!user ? (
                  <>
                    <DropdownMenuLabel>Compte</DropdownMenuLabel>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={(e) => {
                        e.preventDefault();
                        openAuth("login");
                      }}
                    >
                      Connexion
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={(e) => {
                        e.preventDefault();
                        openAuth("register");
                      }}
                    >
                      S&apos;inscrire
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="flex flex-col items-start gap-0.5">
                      <span className="truncate font-semibold leading-tight">{user.name}</span>
                      <span className="truncate text-xs text-zinc-400">{user.email}</span>
                      <span className="truncate text-[11px] font-semibold text-zinc-300">
                        {user.role === "admin" ? "Admin" : "Client"}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.role === "admin" ? (
                      <>
                        <DropdownMenuItem asChild className="cursor-pointer focus:text-white">
                          <Link to="/admin" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Admin
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    ) : null}
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer focus:text-white"
                    >
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Voir le profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onSelect={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Liseret sous la barre pour raccorder au contenu clair */}
        <div className="h-px w-full bg-border/60" aria-hidden />
      </div>
      </header>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        mode={authMode}
        onSuccess={(u) => setUser(u)}
      />
    </>
  );
};
