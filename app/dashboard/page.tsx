"use client";

import { useEffect, useState, useCallback } from "react";
import { Gauge } from "@/components/Gauge";
import { EvolutionChart } from "@/components/EvolutionChart";
import { WhatsAppShare } from "@/components/WhatsAppShare";

type Valeur = { id: string; valeur: number; date: string; note: string | null };
type Indicateur = { id: string; nom: string; cible: number; unite: string | null; valeurs: Valeur[] };
type Objectif = { id: string; titre: string; indicateurs: Indicateur[] };
type Organization = {
  id: string; name: string; slug: string; plan: string; objectifs: Objectif[];
};

function latest(ind: Indicateur) {
  if (!ind.valeurs.length) return null;
  return [...ind.valeurs].sort((a, b) => a.date.localeCompare(b.date)).at(-1)!;
}
function pctOf(ind: Indicateur) {
  const l = latest(ind);
  if (!l || !ind.cible) return 0;
  return (l.valeur / ind.cible) * 100;
}

export default function DashboardPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [openHist, setOpenHist] = useState<Record<string, boolean>>({});
  const [modal, setModal] = useState<null | { type: "objectif" } | { type: "indicateur"; objectifId: string } | { type: "valeur"; indicateurId: string }>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/objectifs");
    if (res.ok) {
      const data = await res.json();
      setOrg(data.organization);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function upgradeToPro() {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Impossible de démarrer le paiement.");
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-inksoft font-mono">Chargement…</div>;
  }
  if (!org) {
    return <div className="min-h-screen flex items-center justify-center text-rust">Espace introuvable.</div>;
  }

  const totalInd = org.objectifs.reduce((s, o) => s + o.indicateurs.length, 0);
  const avgPct = totalInd
    ? Math.round(org.objectifs.reduce((s, o) => s + o.indicateurs.reduce((s2, i) => s2 + Math.min(pctOf(i), 100), 0), 0) / totalInd)
    : 0;

  const resumeText = org.objectifs
    .map((o) => `• ${o.titre} : ${o.indicateurs.map((i) => {
      const l = latest(i); return `${i.nom} ${l ? l.valeur : "—"}/${i.cible}`;
    }).join(", ")}`)
    .join("\n");

  return (
    <main className="min-h-screen bg-bg text-ink px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-wrap justify-between items-end gap-6 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-ochre mb-2 flex items-center gap-2">
              Carnet Suivi & Évaluation
              <span className="text-[10px] normal-case bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-inksoft">
                Plan {org.plan === "pro" ? "Pro" : "Gratuit"}
              </span>
            </div>
            <h1 className="font-serif text-3xl">{org.name}</h1>
          </div>
          <div className="flex gap-3">
            <div className="bg-panel border border-white/10 rounded-lg px-4 py-2 text-center">
              <div className="font-mono text-xl text-teal">{org.objectifs.length}</div>
              <div className="text-[10px] uppercase text-inksoft">Objectifs</div>
            </div>
            <div className="bg-panel border border-white/10 rounded-lg px-4 py-2 text-center">
              <div className="font-mono text-xl text-teal">{totalInd}</div>
              <div className="text-[10px] uppercase text-inksoft">Indicateurs</div>
            </div>
            <div className="bg-panel border border-white/10 rounded-lg px-4 py-2 text-center">
              <div className="font-mono text-xl text-teal">{avgPct}%</div>
              <div className="text-[10px] uppercase text-inksoft">Progression</div>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-3 mb-8">
          <a href="/api/export/excel" className="text-xs px-3 py-1.5 rounded-md border border-white/10 hover:border-teal hover:text-teal transition">⇩ Export Excel</a>
          <a href="/api/export/pdf" className="text-xs px-3 py-1.5 rounded-md border border-white/10 hover:border-teal hover:text-teal transition">⇩ Rapport PDF</a>
          <WhatsAppShare orgName={org.name} resumeText={resumeText} />
          {org.plan !== "pro" && (
            <button onClick={upgradeToPro} className="text-xs px-3 py-1.5 rounded-md bg-ochre text-[#231703] font-semibold">
              ⚡ Passer au plan Pro
            </button>
          )}
        </div>

        {org.objectifs.length === 0 && (
          <div className="text-center py-16 text-inksoft">
            <div className="font-serif text-3xl text-ochre mb-3">✎</div>
            Aucun objectif pour l&apos;instant.
          </div>
        )}

        {org.objectifs.map((obj) => (
          <section key={obj.id} className="mb-10">
            <div className="flex items-center gap-3 border-l-2 border-ochre pl-4 mb-4">
              <h2 className="font-serif text-xl flex-1">{obj.titre}</h2>
              <button
                onClick={async () => {
                  if (!confirm("Supprimer cet objectif ?")) return;
                  await fetch(`/api/objectifs/${obj.id}`, { method: "DELETE" });
                  load();
                }}
                className="text-inksoft hover:text-rust text-sm"
              >
                🗑
              </button>
            </div>

            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {obj.indicateurs.map((ind) => {
                const l = latest(ind);
                const pct = pctOf(ind);
                return (
                  <div key={ind.id} className="bg-panel border border-white/10 rounded-lg p-4 flex flex-col gap-2.5">
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-semibold text-sm">{ind.nom}</div>
                      <button
                        onClick={async () => {
                          if (!confirm("Supprimer cet indicateur ?")) return;
                          await fetch(`/api/indicateurs/${ind.id}`, { method: "DELETE" });
                          load();
                        }}
                        className="text-inksoft hover:text-rust text-xs"
                      >
                        🗑
                      </button>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xl text-teal">{l ? l.valeur : "—"}</span>
                      <span className="font-mono text-xs text-inksoft">/ {ind.cible} {ind.unite}</span>
                    </div>
                    <Gauge pct={pct} />
                    <div className="flex justify-between text-xs">
                      <button
                        onClick={() => setOpenHist((s) => ({ ...s, [ind.id]: !s[ind.id] }))}
                        className="text-teal hover:underline"
                      >
                        Évolution
                      </button>
                      <button
                        onClick={() => setModal({ type: "valeur", indicateurId: ind.id })}
                        className="text-teal hover:underline"
                      >
                        + Mettre à jour
                      </button>
                    </div>
                    {openHist[ind.id] && <EvolutionChart valeurs={ind.valeurs} cible={ind.cible} />}
                  </div>
                );
              })}
              <button
                onClick={() => setModal({ type: "indicateur", objectifId: obj.id })}
                className="border border-dashed border-white/15 rounded-lg min-h-[96px] text-inksoft hover:text-teal hover:border-teal transition text-sm"
              >
                + Ajouter un indicateur
              </button>
            </div>
          </section>
        ))}

        <button
          onClick={() => setModal({ type: "objectif" })}
          className="w-full border border-dashed border-white/15 rounded-lg py-4 text-inksoft hover:text-teal hover:border-teal transition text-sm"
        >
          + Ajouter un objectif
        </button>
      </div>

      {modal && (
        <Modal onClose={() => setModal(null)}>
          {modal.type === "objectif" && (
            <ObjectifForm onDone={() => { setModal(null); load(); }} />
          )}
          {modal.type === "indicateur" && (
            <IndicateurForm objectifId={modal.objectifId} onDone={() => { setModal(null); load(); }} />
          )}
          {modal.type === "valeur" && (
            <ValeurForm indicateurId={modal.indicateurId} onDone={() => { setModal(null); load(); }} />
          )}
        </Modal>
      )}
    </main>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50" onClick={onClose}>
      <div className="bg-paper text-[#20281F] rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ObjectifForm({ onDone }: { onDone: () => void }) {
  const [titre, setTitre] = useState("");
  return (
    <div>
      <h3 className="font-serif text-lg mb-4">Nouvel objectif</h3>
      <input
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        placeholder="Ex. : Améliorer l'accès à l'eau potable"
        className="w-full border border-[#C9C2AD] rounded-md px-3 py-2 text-sm mb-4"
      />
      <button
        onClick={async () => {
          if (!titre.trim()) return;
          const res = await fetch("/api/objectifs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titre }),
          });
          const data = await res.json();
          if (!res.ok) { alert(data.error); return; }
          onDone();
        }}
        className="w-full bg-[#2F6B4F] text-[#F4EFE3] rounded-md py-2 text-sm font-semibold"
      >
        Enregistrer
      </button>
    </div>
  );
}

function IndicateurForm({ objectifId, onDone }: { objectifId: string; onDone: () => void }) {
  const [nom, setNom] = useState("");
  const [cible, setCible] = useState("");
  const [unite, setUnite] = useState("");
  return (
    <div>
      <h3 className="font-serif text-lg mb-4">Nouvel indicateur</h3>
      <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom de l'indicateur" className="w-full border border-[#C9C2AD] rounded-md px-3 py-2 text-sm mb-3" />
      <input value={cible} onChange={(e) => setCible(e.target.value)} type="number" placeholder="Cible" className="w-full border border-[#C9C2AD] rounded-md px-3 py-2 text-sm mb-3" />
      <input value={unite} onChange={(e) => setUnite(e.target.value)} placeholder="Unité (ménages, %, FCFA...)" className="w-full border border-[#C9C2AD] rounded-md px-3 py-2 text-sm mb-4" />
      <button
        onClick={async () => {
          if (!nom.trim() || !cible) return;
          const res = await fetch("/api/indicateurs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ objectifId, nom, cible, unite }),
          });
          const data = await res.json();
          if (!res.ok) { alert(data.error); return; }
          onDone();
        }}
        className="w-full bg-[#2F6B4F] text-[#F4EFE3] rounded-md py-2 text-sm font-semibold"
      >
        Enregistrer
      </button>
    </div>
  );
}

function ValeurForm({ indicateurId, onDone }: { indicateurId: string; onDone: () => void }) {
  const [valeur, setValeur] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  return (
    <div>
      <h3 className="font-serif text-lg mb-4">Mettre à jour la valeur</h3>
      <input value={valeur} onChange={(e) => setValeur(e.target.value)} type="number" placeholder="Nouvelle valeur" className="w-full border border-[#C9C2AD] rounded-md px-3 py-2 text-sm mb-3" />
      <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full border border-[#C9C2AD] rounded-md px-3 py-2 text-sm mb-3" />
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optionnel)" className="w-full border border-[#C9C2AD] rounded-md px-3 py-2 text-sm mb-4" />
      <button
        onClick={async () => {
          if (!valeur || !date) return;
          const res = await fetch(`/api/indicateurs/${indicateurId}/valeurs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valeur, date, note }),
          });
          const data = await res.json();
          if (!res.ok) { alert(data.error); return; }
          onDone();
        }}
        className="w-full bg-[#2F6B4F] text-[#F4EFE3] rounded-md py-2 text-sm font-semibold"
      >
        Enregistrer
      </button>
    </div>
  );
}
