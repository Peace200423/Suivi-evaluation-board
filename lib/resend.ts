import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendUpdateNotification(opts: {
  to: string;
  orgName: string;
  indicateurNom: string;
  valeur: number;
  cible: number;
}) {
  if (!resend) return; // Notifications désactivées tant que RESEND_API_KEY n'est pas configurée.
  const pct = Math.round((opts.valeur / opts.cible) * 100);
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || "Suivi-Évaluation <onboarding@resend.dev>",
      to: opts.to,
      subject: `[${opts.orgName}] Nouvelle mise à jour : ${opts.indicateurNom}`,
      html: `
        <div style="font-family: Georgia, serif; color:#16231C;">
          <h2 style="color:#1B3A57;">${opts.orgName}</h2>
          <p><strong>${opts.indicateurNom}</strong> a été mis à jour.</p>
          <p>Nouvelle valeur : <strong>${opts.valeur}</strong> / ${opts.cible} (${pct}%)</p>
          <p style="color:#6E7D71; font-size:12px;">Notification automatique — Carnet de Suivi & Évaluation, propulsé par KRÉA.AI</p>
        </div>
      `,
    });
  } catch (e) {
    console.error("Erreur envoi email", e);
  }
}
