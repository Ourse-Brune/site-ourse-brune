import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  // N'accepter que les requêtes POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({
      success: false,
      error: 'Méthode non autorisée. Seul POST est accepté.',
    })
  }

  try {
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch {
        return res.status(400).json({ success: false, error: 'Format JSON invalide.' })
      }
    }

    const { name, email, phone, subject, message, _gotcha } = body || {}

    // Protection anti-spam Honeypot : si le champ caché est rempli, rejet silencieux
    if (_gotcha) {
      return res.status(200).json({ success: true, message: 'Message reçu.' })
    }

    // Validation des champs obligatoires
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Le nom est requis.' })
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Une adresse email valide est requise.' })
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Le message est requis.' })
    }

    const ovhEmail = process.env.OVH_EMAIL
    const ovhPassword = process.env.OVH_PASSWORD

    if (!ovhEmail || !ovhPassword) {
      console.error('Variables OVH_EMAIL ou OVH_PASSWORD manquantes sur Vercel.')
      return res.status(500).json({
        success: false,
        error: 'Configuration SMTP du serveur incomplète.',
      })
    }

    // Configuration du transporteur SMTP OVH sécurisé (port 465 SSL/TLS)
    const transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net',
      port: 465,
      secure: true,
      auth: {
        user: ovhEmail,
        pass: ovhPassword,
      },
    })

    const cleanName = name.trim()
    const cleanEmail = email.trim()
    const cleanPhone = phone ? phone.trim() : 'Non renseigné'
    const cleanSubject = subject ? subject.trim() : "Demande d'information"
    const cleanMessage = message.trim()

    // Construction de l'email HTML soigné
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917; background-color: #fafaf9; margin: 0; padding: 24px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7e5e4; }
            .header { background: #1c1917; color: #ffffff; padding: 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
            .header p { margin: 6px 0 0; font-size: 13px; color: #d6d3d1; }
            .content { padding: 28px 24px; }
            .badge { display: inline-block; background: #f5f5f4; border: 1px solid #d6d3d1; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #44403c; margin-bottom: 20px; }
            .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            .meta-table td { padding: 8px 0; font-size: 14px; border-bottom: 1px solid #f5f5f4; vertical-align: top; }
            .meta-table td.label { width: 120px; font-weight: 700; color: #78716c; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
            .meta-table td.value { color: #1c1917; }
            .message-box { background: #fafaf9; border-left: 4px solid #1c1917; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-top: 10px; font-size: 15px; line-height: 1.6; color: #292524; white-space: pre-wrap; }
            .footer { background: #f5f5f4; padding: 16px; text-align: center; font-size: 12px; color: #78716c; border-top: 1px solid #e7e5e4; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>OURSE BRUNE</h1>
              <p>Atelier d'Art Céramique — Nouveau message du site</p>
            </div>
            <div class="content">
              <div class="badge">${cleanSubject}</div>
              <table class="meta-table">
                <tr>
                  <td class="label">Expéditeur</td>
                  <td class="value"><strong>${cleanName}</strong></td>
                </tr>
                <tr>
                  <td class="label">Email</td>
                  <td class="value"><a href="mailto:${cleanEmail}" style="color: #1c1917; text-decoration: underline;">${cleanEmail}</a></td>
                </tr>
                <tr>
                  <td class="label">Téléphone</td>
                  <td class="value">${cleanPhone}</td>
                </tr>
                <tr>
                  <td class="label">Objet</td>
                  <td class="value">${cleanSubject}</td>
                </tr>
              </table>
              <div style="font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #78716c; margin-bottom: 6px;">Message :</div>
              <div class="message-box">${cleanMessage}</div>
            </div>
            <div class="footer">
              Pour répondre à ce client, il vous suffit de cliquer sur « Répondre » dans votre messagerie.
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
NOUVEAU MESSAGE — OURSE BRUNE
------------------------------------------------
Objet : ${cleanSubject}
Expéditeur : ${cleanName}
Email : ${cleanEmail}
Téléphone : ${cleanPhone}

Message :
${cleanMessage}
------------------------------------------------
(Répondre directement à cet email pour contacter le client)
    `.trim()

    await transporter.sendMail({
      from: `"Ourse Brune — Site Web" <${ovhEmail}>`,
      to: ovhEmail,
      replyTo: `${cleanName} <${cleanEmail}>`,
      subject: `[Ourse Brune] ${cleanSubject} — ${cleanName}`,
      text: textContent,
      html: htmlContent,
    })

    return res.status(200).json({
      success: true,
      message: 'Votre message a été envoyé avec succès.',
    })
  } catch (error) {
    console.error('Erreur lors de l’envoi de l’email contact :', error)
    return res.status(500).json({
      success: false,
      error: "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.",
    })
  }
}
