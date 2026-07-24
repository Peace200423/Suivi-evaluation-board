"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [code, setCode] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "create"
            ? { action: "create", name, code, notifyEmail }
            : { action: "join", slug, code }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg text-ink px-6">
      <div className="max-w-md w-full bg-panel border border-white/10 rounded-2xl p-8">
        <div className="font-mono text-xs tracking-[0.16em] uppercase text-ochre mb-2">
          KRÉA.AI · Suivi & Évaluation
        </div>
        <h1 className="font-serif text-2xl mb-6">
          {mode === "create" ? "Créer votre espace" : "Rejoindre un espace"}
        </h1>

        <div className="flex gap-2 mb-6 text-sm">
          <button
            onClick={() => setMode("create")}
            className={`px-3 py-1.5 rounded-md border ${
              mode === "create"
                ? "border-teal text-teal"
                : "border-white/10 text-inksoft"
            }`}
          >
            Nouvelle association
          </button>
          <button
            onClick={() => setMode("join")}
            className={`px-3 py-1.5 rounded-md border ${
              mode === "join"
                ? "border-teal text-teal"
                : "border-white/10 text-inksoft"
            }`}
          >
            J&apos;ai déjà un espace
          </button>
        </div>

        {mode === "create" ? (
          <div className="space-y-4">
            <Field label="Nom de l'association">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. : Association Espoir Cotonou" />
            </Field>
            <Field label="Code d'accès (à partager avec votre équipe)">
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Choisissez un code" type="password" />
            </Field>
            <Field label="Email de notification (optionnel)">
              <input value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} placeholder="contact@association.org" />
            </Field>
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Identifiant de l'espace (fourni à la création)">
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="ex-association-espoir-a1b2" />
            </Field>
            <Field label="Code d'accès">
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code partagé par votre équipe" type="password" />
            </Field>
          </div>
        )}

        {error && <p className="text-rust text-sm mt-4">{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full mt-6 bg-teal text-[#0E1A14] font-semibold rounded-lg py-2.5 disabled:opacity-50"
        >
          {loading ? "…" : mode === "create" ? "Créer l'espace" : "Entrer"}
        </button>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-inksoft mb-1.5">
        {label}
      </span>
      <div className="[&_input]:w-full [&_input]:bg-white/5 [&_input]:border [&_input]:border-white/10 [&_input]:rounded-md [&_input]:px-3 [&_input]:py-2 [&_input]:text-ink [&_input]:text-sm">
        {children}
      </div>
    </label>
  );
}
