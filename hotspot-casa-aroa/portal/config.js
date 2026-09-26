/*
 * Hotel Casa Aroa · Portal WiFi
 * ------------------------------------------------------------------
 * Único fichero que normalmente hay que tocar para adaptar el portal.
 */
window.PORTAL_CONFIG = {
  /*
   * "external" → el portal lo sirve el servidor Node de /server (Portal externo
   *              en UniFi). Recomendado: sobrevive a actualizaciones del UDM.
   * "unifi"    → los ficheros se copian por SSH dentro del UDM Pro y el portal
   *              habla directamente con el endpoint de login de UniFi.
   * "demo"     → sin backend, solo para ver el diseño en un navegador.
   */
  mode: "external",

  // Sitio de UniFi (casi siempre "default").
  site: "default",

  hotel: {
    name: "Casa Aroa",
    address: "Carrer del Dr. Joaquim Pou, 10 · 08002 Barcelona",
    phone: "+34 935 971 799",
    email: "info@casaaroahotel.com",
    // Razón social y NIF para el texto de privacidad (pídelos a administración).
    legalName: "",
    taxId: "",
    // Logo sobre la foto (versión blanca). En img/logo.svg está la versión marrón.
    logo: "img/logo-white.svg",
  },

  // Foto del panel principal. Vacío → fondo liso en el marrón corporativo.
  heroImage: "img/hero.jpg",
  // Foto de la pantalla final. Vacío → no se muestra.
  doneImage: "img/barri-gotic.jpg",

  // "auto" usa el idioma del dispositivo si está disponible.
  defaultLang: "auto",
  languages: ["es", "ca", "en", "fr"],

  form: {
    askRoom: true,        // nº de habitación (obligatorio si true)
    askEmail: true,       // email opcional + consentimiento de comunicaciones
    askAccessCode: false, // código diario entregado en recepción
  },

  // Tras conectar: "" muestra la pantalla de bienvenida del hotel;
  // una URL redirige allí; "original" vuelve a la web que pedía el huésped.
  redirectUrl: "",

  // Tarjetas de la pantalla de "conectado". Texto por idioma; "href" opcional.
  services: [
    {
      icon: "bell",
      href: "tel:+34935971799",
      title: { es: "Recepción", ca: "Recepció", en: "Reception", fr: "Réception" },
      text: {
        es: "Estamos aquí para lo que necesite · +34\u00a0935\u00a0971\u00a0799",
        ca: "Som aquí per al que necessiteu · +34\u00a0935\u00a0971\u00a0799",
        en: "We are here for anything you need · +34\u00a0935\u00a0971\u00a0799",
        fr: "Nous sommes là pour tout ce dont vous avez besoin · +34\u00a0935\u00a0971\u00a0799",
      },
    },
    {
      icon: "cup",
      title: { es: "Desayuno", ca: "Esmorzar", en: "Breakfast", fr: "Petit-déjeuner" },
      text: {
        es: "Buffet de producto local y de temporada.",
        ca: "Bufet de producte local i de temporada.",
        en: "A buffet of local, seasonal produce.",
        fr: "Un buffet de produits locaux et de saison.",
      },
    },
    {
      icon: "clock",
      title: { es: "Early check-in y late check-out", ca: "Early check-in i late check-out", en: "Early check-in & late check-out", fr: "Arrivée anticipée et départ tardif" },
      text: {
        es: "Consulte la disponibilidad en recepción.",
        ca: "Consulteu la disponibilitat a recepció.",
        en: "Subject to availability — just ask at reception.",
        fr: "Selon disponibilité, renseignez-vous à la réception.",
      },
    },
  ],

  /*
   * Solo para mode: "unifi". Construye la petición al endpoint de login del
   * portal de UniFi. Los nombres de campo pueden variar entre versiones de
   * UniFi Network: compruébalos una vez con el portal por defecto (DevTools →
   * Network → petición "login") y ajústalos aquí si hace falta.
   */
  unifiLogin(data, params) {
    const body = { landing_url: params.url || "", accept_tou: true };
    if (data.accessCode) {
      body.by = "password";
      body.password = data.accessCode;
    } else {
      body.by = "none";
    }
    return { url: "/guest/s/" + (this.site || "default") + "/login", body };
  },
};
