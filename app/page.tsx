import Link from "next/link";

const FEATURES = [
  {
    title: "Cadre logique complet",
    text: "Structurez Impact, Effets, Extrants et Activités — le format attendu par les bailleurs, pas juste une liste à plat.",
  },
  {
    title: "Indicateurs liés aux ODD",
    text: "Rattachez chaque indicateur aux Objectifs de Développement Durable concernés, en un clic.",
  },
  {
    title: "Preuves jointes",
    text: "Attachez une photo ou un document justificatif à chaque relevé — un vrai dossier d'audit, pas juste des chiffres.",
  },
  {
    title: "Mode bailleur",
    text: "Partagez un lien public en lecture seule à vos bailleurs, sans qu'ils aient besoin de créer un compte.",
  },
  {
    title: "Collecte terrain hors-ligne",
    text: "Vos agents saisissent les données sur le terrain, même sans réseau. La synchronisation se fait automatiquement.",
  },
  {
    title: "Validation hiérarchique",
    text: "Agent terrain saisit, superviseur valide. Un vrai circuit de contrôle, avec des rôles et des accès distincts par membre.",
  },
];

export default function LandingPage() {
  return (
    <main className="bg-bg text-ink">
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
          Cadre logique, ODD, preuves de terrain, validation hiérarchique et rapports prêts
          pour vos bailleurs — en français, pensé pour les associations et petites structures.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register" className="bg-teal text-[#0E1A14] font-semibold px-7 py-3 rounded-lg hover:opacity-90 transition">
            Créer mon espace — gratuit
          </Link>
          <Link href="/login" className="border border-white/15 px-7 py-3 rounded-lg hover:border-teal hover:text-teal transition">
            Se connecter
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/10">
        <h2 className="font-serif text-2xl mb-10 text-center">Tout ce qu&apos;il faut pour piloter votre impact</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-panel border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-inksoft leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-white/10 text-center">
        <h2 className="font-serif text-2xl mb-4">Gratuit pendant la bêta</h2>
        <p className="text-inksoft mb-8">
          L&apos;outil est actuellement gratuit et sans limite pendant sa phase de lancement.
          Créez votre espace, invitez votre équipe, et commencez à suivre vos indicateurs dès aujourd&apos;hui.
        </p>
        <Link href="/register" className="inline-block bg-teal text-[#0E1A14] font-semibold px-7 py-3 rounded-lg hover:opacity-90 transition">
          Commencer maintenant
        </Link>
      </section>

      <footer className="text-center text-xs text-inksoft/60 py-10 border-t border-white/10">
        Propulsé par KRÉA.AI — agence de branding IA pour l&apos;Afrique francophone.
      </footer>
    </main>
  );
}
