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
    city: "Barcelona",
    stars: 5,
    // Ruta a un logo (SVG/PNG). Vacío → se usa el logotipo tipográfico.
    logo: "",
  },

  // Foto del panel lateral (p. ej. "img/hero.jpg"). Vacío → ilustración
  // del trazado del Eixample de Cerdà.
  heroImage: "",

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

  // Tarjetas de la pantalla de "conectado". Texto por idioma. Edítalas con
  // los servicios reales del hotel (y añade "href" si hay web/carta online).
  services: [
    {
      icon: "bell",
      title: { es: "Recepción", ca: "Recepció", en: "Reception", fr: "Réception" },
      text: {
        es: "A su disposición las 24 horas.",
        ca: "A la seva disposició les 24 hores.",
        en: "At your service around the clock.",
        fr: "À votre service 24 h/24.",
      },
    },
    {
      icon: "key",
      title: { es: "Conserjería", ca: "Consergeria", en: "Concierge", fr: "Conciergerie" },
      text: {
        es: "Reservas, experiencias y rincones de Barcelona.",
        ca: "Reserves, experiències i racons de Barcelona.",
        en: "Reservations, experiences and hidden Barcelona.",
        fr: "Réservations, expériences et Barcelone secrète.",
      },
    },
    {
      icon: "cup",
      title: { es: "Servicio de habitaciones", ca: "Servei d'habitacions", en: "In-room dining", fr: "Service en chambre" },
      text: {
        es: "Pida desde su habitación cuando lo desee.",
        ca: "Demani des de la seva habitació quan vulgui.",
        en: "Order from your room whenever you wish.",
        fr: "Commandez depuis votre chambre à tout moment.",
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
