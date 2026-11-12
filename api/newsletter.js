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

    const { email, _gotcha } = body || {}

    // Protection anti-spam Honeypot
    if (_gotcha) {
      return res.status(200).json({ success: true, message: 'Inscription enregistrée.' })
    }

    // Validation de l'email
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez renseigner une adresse email valide.',
      })
    }

    const brevoApiKey = process.env.BREVO_API_KEY

    if (!brevoApiKey) {
      console.error('Variable BREVO_API_KEY manquante sur Vercel.')
      return res.status(500).json({
        success: false,
        error: 'Configuration de la newsletter incomplète sur le serveur.',
      })
    }

    const cleanEmail = email.trim().toLowerCase()
    const listId = parseInt(process.env.BREVO_LIST_ID || '3', 10)

    // Appel à l'API Brevo v3 (Création ou mise à jour du contact)
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        email: cleanEmail,
        listIds: [listId],
        updateEnabled: true,
      }),
    })

    // Brevo renvoie 201 (Created), 204 (No Content / Updated) ou 200 en cas de succès
    if (brevoResponse.status === 201 || brevoResponse.status === 204 || brevoResponse.status === 200) {
      return res.status(200).json({
        success: true,
        message: 'Votre inscription à la newsletter a bien été enregistrée. Merci !',
      })
    }

    const errorData = await brevoResponse.json().catch(() => ({}))

    // Si le contact existe déjà dans Brevo
    if (errorData?.code === 'duplicate_parameter' || errorData?.message?.toLowerCase().includes('already exist')) {
      return res.status(200).json({
        success: true,
        message: 'Cette adresse est déjà inscrite à notre newsletter. Merci !',
      })
    }

    console.error('Erreur API Brevo :', brevoResponse.status, errorData)
    return res.status(400).json({
      success: false,
      error: errorData?.message || "Impossible d'enregistrer votre inscription pour le moment.",
    })
  } catch (error) {
    console.error('Erreur lors de l’inscription newsletter :', error)
    return res.status(500).json({
      success: false,
      error: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
    })
  }
}
