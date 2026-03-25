import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IdCard, Mail, Pencil, User, UserRound } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type AuthUser, getAuthUser, logout, updateProfile } from "@/lib/auth";

const ProfilePage = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  const [nameDraft, setNameDraft] = useState("");
  const [passwordDraft, setPasswordDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  useEffect(() => {
    setEditMode(searchParams.get("edit") === "1");
  }, [searchParams]);

  const roleLabel = useMemo(() => {
    if (!user) return "";
    return user.role === "admin" ? "Admin" : "Client";
  }, [user]);

  useEffect(() => {
    if (user) setNameDraft(user.name);
  }, [user]);

  const onSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);

    try {
      const next = await updateProfile({ name: nameDraft, password: passwordDraft || undefined });
      setUser(next);
      setPasswordDraft("");
      setEditMode(false);
      navigate("/profile");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur de mise à jour";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-3xl py-8">
        {user ? (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-2xl font-bold">Mon profil</h1>
                <p className="mt-1 text-sm text-muted-foreground">{roleLabel}</p>
              </div>
            </div>

            {!editMode ? (
              <>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-semibold">Nom</p>
                    </div>
                    <p className="mt-2 break-words text-sm">{user.name}</p>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-semibold">Email</p>
                    </div>
                    <p className="mt-2 break-words text-sm">{user.email}</p>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-4 sm:col-span-2">
                    <div className="flex items-center gap-2">
                      <IdCard className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-semibold">Identifiant</p>
                    </div>
                    <p className="mt-2 break-all text-sm">{user.id}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/profile?edit=1")}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Modifier mon profil
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      logout();
                      setUser(null);
                    }}
                  >
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-6">
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <h2 className="font-display text-lg font-bold">Modifier mes informations</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Vous pouvez changer votre nom. Le mot de passe est optionnel.
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label className="text-sm font-semibold">Nom</label>
                      <Input
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="text-sm font-semibold">Nouveau mot de passe (optionnel)</label>
                      <Input
                        type="password"
                        value={passwordDraft}
                        onChange={(e) => setPasswordDraft(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button type="button" onClick={onSave} disabled={saving}>
                      {saving ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={saving}
                      onClick={() => {
                        setEditMode(false);
                        setError(null);
                        navigate("/profile");
                      }}
                    >
                      Annuler
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        logout();
                        setUser(null);
                      }}
                      disabled={saving}
                    >
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!editMode ? (
              <div className="mt-4">
                <Button type="button" variant="secondary" asChild>
                  <Link to="/dashboard">Retour au Dashboard</Link>
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h1 className="font-display text-2xl font-bold">Connexion requise</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Connecte-toi pour voir tes informations de profil.
            </p>
            <div className="mt-6">
              <Button type="button" variant="secondary" asChild>
                <Link to="/dashboard">Aller au Dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

