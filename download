import Link from "next/link";

const FEATURES = [
  {
    title: "Objectifs & indicateurs",
    text: "Structurez vos objectifs, définissez des cibles claires et suivez chaque indicateur en temps réel.",
  },
  {
    title: "Graphiques d'évolution",
    text: "Visualisez la progression de chaque indicateur dans le temps, avec la cible en repère.",
  },
  {
    title: "Rapports Excel & PDF",
    text: "Exportez des rapports propres et brandés en un clic, prêts à envoyer à vos bailleurs.",
  },
  {
    title: "Partage WhatsApp",
    text: "Partagez l'état d'avancement de vos indicateurs directement dans vos groupes WhatsApp.",
  },
  {
    title: "Notifications email",
    text: "Recevez une notification à chaque mise à jour importante, sans avoir à ouvrir l'outil.",
  },
  {
    title: "Multi-structures",
    text: "Chaque association dispose de son propre espace sécurisé, isolé des autres.",
  },
];

export default function LandingPage() {
  return (
    <main className="bg-bg text-ink">
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-ochre mb-6">
          KRÉA.AI · Suivi & Évaluation
        </div>
        <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">
          Le tableau de bord qui prouve
          <br />
          <span className="text-teal">l&apos;impact de votre association</span>
        </h1>
        <p className="text-inksoft text-lg max-w-2xl mx-auto mb-10">
          Fini les tableurs bricolés. Suivez vos objectifs, vos indicateurs et
          générez des rapports professionnels — en français, pensé pour les
          associations et petites structures.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/join"
            className="bg-teal text-[#0E1A14] font-semibold px-7 py-3 rounded-lg hover:opacity-90 transition"
          >
            Créer mon espace — gratuit
          </Link>
          <a
            href="#tarifs"
            className="border border-white/15 px-7 py-3 rounded-lg hover:border-teal hover:text-teal transition"
          >
            Voir les tarifs
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/10">
        <h2 className="font-serif text-2xl mb-10 text-center">
          Tout ce qu&apos;il faut pour piloter votre impact
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-panel border border-white/10 rounded-xl p-6"
            >
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-inksoft leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" className="max-w-4xl mx-auto px-6 py-20 border-t border-white/10">
        <h2 className="font-serif text-2xl mb-10 text-center">Tarifs</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-panel border border-white/10 rounded-xl p-8">
            <div className="font-mono text-xs uppercase text-inksoft mb-2">Gratuit</div>
            <div className="font-serif text-3xl mb-4">0 FCFA</div>
            <ul className="text-sm text-inksoft space-y-2 mb-6">
              <li>2 objectifs</li>
              <li>6 indicateurs</li>
              <li>Export CSV</li>
              <li>1 espace associatif</li>
            </ul>
            <Link
              href="/join"
              className="block text-center border border-white/15 rounded-lg py-2 hover:border-teal hover:text-teal transition"
            >
              Commencer
            </Link>
          </div>
          <div className="bg-panel border border-ochre rounded-xl p-8 relative">
            <div className="absolute -top-3 right-6 bg-ochre text-[#231703] text-xs font-semibold px-3 py-1 rounded-full">
              Recommandé
            </div>
            <div className="font-mono text-xs uppercase text-inksoft mb-2">Pro</div>
            <div className="font-serif text-3xl mb-4">
              9 000 FCFA<span className="text-sm text-inksoft">/mois</span>
            </div>
            <ul className="text-sm text-inksoft space-y-2 mb-6">
              <li>Objectifs & indicateurs illimités</li>
              <li>Export Excel & PDF brandés</li>
              <li>Notifications email</li>
              <li>Partage WhatsApp</li>
              <li>Support prioritaire</li>
            </ul>
            <Link
              href="/join"
              className="block text-center bg-ochre text-[#231703] font-semibold rounded-lg py-2 hover:opacity-90 transition"
            >
              Choisir Pro
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-inksoft/60 py-10 border-t border-white/10">
        Propulsé par KRÉA.AI — agence de branding IA pour l&apos;Afrique francophone.
      </footer>
    </main>
  );
}
