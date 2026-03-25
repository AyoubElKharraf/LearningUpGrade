import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type AuthUser } from "@/lib/auth";

type AuthMode = "login" | "register";

export function AuthDialog({
  open,
  onOpenChange,
  mode,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: AuthMode;
  onSuccess: (user: AuthUser) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setIsLoading(false);
  }, [open]);

  const title = useMemo(() => (mode === "login" ? "Connexion" : "S'inscrire"), [mode]);
  const description = useMemo(
    () =>
      mode === "login"
        ? "Connecte-toi pour accéder à ton compte."
        : "Crée un compte (prototype local : admin si email `ayoub.ek@gmail.com`, sinon client).",
    [mode],
  );

  const submit = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const { login, register } = await import("@/lib/auth");
      const user =
        mode === "login"
          ? await login({ email, password })
          : await register({ email, password });
      onSuccess(user);
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="ex: you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="password">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button type="button" className="flex-1" onClick={submit} disabled={isLoading}>
              {isLoading ? "..." : title}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

