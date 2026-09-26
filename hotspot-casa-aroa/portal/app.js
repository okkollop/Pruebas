/* Hotel Casa Aroa · Portal WiFi */
(function () {
  "use strict";

  var CFG = window.PORTAL_CONFIG || {};
  var FORM = CFG.form || {};

  var I18N = {
    es: {
      kicker: "Aquí. Ahora.",
      heroQuote: "Un hotel para vivir Barcelona con <em>presencia</em>",
      hoodKicker: "Barri Gòtic",
      hoodTitle: "A unos pasos de la Catedral",
      eyebrow: "Wi-Fi para huéspedes",
      title: "Bienvenidos a <em>Casa Aroa</em>",
      lead: "Conéctese en un instante y disfrute de internet de alta velocidad durante toda su estancia.",
      name: "Nombre y apellidos",
      room: "Habitación",
      code: "Código de acceso",
      email: "Correo electrónico",
      optional: "(opcional)",
      acceptPre: "Acepto las",
      acceptLink: "condiciones de uso y la política de privacidad",
      marketing: "Deseo recibir comunicaciones y experiencias exclusivas de Casa Aroa.",
      connect: "Conectarme",
      doneEyebrow: "Conexión establecida",
      doneTitle: "Todo <em>listo</em>",
      doneLead: "Le deseamos una estancia inolvidable. Estamos a su disposición para cualquier cosa que necesite.",
      continue: "Continuar navegando",
      termsTitle: "Condiciones de uso",
      termsAccept: "Aceptar",
      errName: "Indíquenos su nombre, por favor.",
      errRoom: "Indique su número de habitación.",
      errEmail: "El correo electrónico no parece válido.",
      errCode: "Introduzca el código facilitado en recepción.",
      errTerms: "Para continuar, acepte las condiciones de uso.",
      errBadCode: "El código de acceso no es correcto. Consúltelo en recepción.",
      errNoMac: "No hemos podido identificar su dispositivo. Vuelva a conectarse a la red Wi-Fi.",
      errRate: "Demasiados intentos. Espere un momento e inténtelo de nuevo.",
      errGeneric: "No ha sido posible conectarle. Inténtelo de nuevo o contacte con recepción.",
      termsBody:
        "<h3>Servicio</h3><p>El hotel ofrece acceso a internet gratuito a sus huéspedes y visitantes. La velocidad y disponibilidad pueden variar y el servicio puede interrumpirse por mantenimiento.</p>" +
        "<h3>Uso responsable</h3><p>Queda prohibido utilizar la red para actividades ilícitas, vulnerar derechos de terceros, distribuir software malicioso o degradar el servicio del resto de usuarios. El hotel podrá limitar o suspender el acceso ante un uso indebido.</p>" +
        "<h3>Seguridad</h3><p>La red es compartida. Recomendamos utilizar conexiones cifradas (HTTPS, VPN) para información sensible. El hotel no se responsabiliza de pérdidas de datos o daños derivados del uso del servicio.</p>" +
        "<h3>Protección de datos</h3><p>Responsable: {LEGAL}. Tratamos su nombre, habitación, correo (si lo facilita) y datos técnicos de su dispositivo para prestar y proteger el servicio y cumplir obligaciones legales. Las comunicaciones comerciales solo se enviarán con su consentimiento, que podrá retirar en cualquier momento. Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad en recepción, y reclamar ante la AEPD.</p>",
    },
    ca: {
      kicker: "Aquí. Ara.",
      heroQuote: "Un hotel per viure Barcelona amb <em>presència</em>",
      hoodKicker: "Barri Gòtic",
      hoodTitle: "A tocar de la Catedral",
      eyebrow: "Wi-Fi per a hostes",
      title: "Benvinguts a <em>Casa Aroa</em>",
      lead: "Connecteu-vos en un instant i gaudiu d'internet d'alta velocitat durant tota l'estada.",
      name: "Nom i cognoms",
      room: "Habitació",
      code: "Codi d'accés",
      email: "Correu electrònic",
      optional: "(opcional)",
      acceptPre: "Accepto les",
      acceptLink: "condicions d'ús i la política de privacitat",
      marketing: "Vull rebre comunicacions i experiències exclusives de Casa Aroa.",
      connect: "Connectar-me",
      doneEyebrow: "Connexió establerta",
      doneTitle: "Tot <em>a punt</em>",
      doneLead: "Us desitgem una estada inoblidable. Som a la vostra disposició per a qualsevol cosa que necessiteu.",
      continue: "Continuar navegant",
      termsTitle: "Condicions d'ús",
      termsAccept: "Acceptar",
      errName: "Indiqueu-nos el vostre nom, si us plau.",
      errRoom: "Indiqueu el número d'habitació.",
      errEmail: "El correu electrònic no sembla vàlid.",
      errCode: "Introduïu el codi facilitat a recepció.",
      errTerms: "Per continuar, accepteu les condicions d'ús.",
      errBadCode: "El codi d'accés no és correcte. Consulteu-lo a recepció.",
      errNoMac: "No hem pogut identificar el vostre dispositiu. Torneu a connectar-vos a la xarxa Wi-Fi.",
      errRate: "Massa intents. Espereu un moment i torneu-ho a provar.",
      errGeneric: "No ha estat possible connectar-vos. Torneu-ho a provar o contacteu amb recepció.",
      termsBody:
        "<h3>Servei</h3><p>L'hotel ofereix accés gratuït a internet als seus hostes i visitants. La velocitat i la disponibilitat poden variar i el servei es pot interrompre per manteniment.</p>" +
        "<h3>Ús responsable</h3><p>Està prohibit utilitzar la xarxa per a activitats il·lícites, vulnerar drets de tercers, distribuir programari maliciós o degradar el servei de la resta d'usuaris. L'hotel podrà limitar o suspendre l'accés davant d'un ús indegut.</p>" +
        "<h3>Seguretat</h3><p>La xarxa és compartida. Recomanem utilitzar connexions xifrades (HTTPS, VPN) per a informació sensible. L'hotel no es responsabilitza de pèrdues de dades o danys derivats de l'ús del servei.</p>" +
        "<h3>Protecció de dades</h3><p>Responsable: {LEGAL}. Tractem el vostre nom, habitació, correu (si el faciliteu) i dades tècniques del dispositiu per prestar i protegir el servei i complir obligacions legals. Les comunicacions comercials només s'enviaran amb el vostre consentiment, que podreu retirar en qualsevol moment. Podeu exercir els drets d'accés, rectificació, supressió, oposició, limitació i portabilitat a recepció, i reclamar davant l'AEPD.</p>",
    },
    en: {
      kicker: "Here. Now.",
      heroQuote: "A hotel to experience Barcelona with <em>presence</em>",
      hoodKicker: "Gothic Quarter",
      hoodTitle: "Steps from the Cathedral",
      eyebrow: "Guest Wi-Fi",
      title: "Welcome to <em>Casa Aroa</em>",
      lead: "Connect in a moment and enjoy high-speed internet throughout your stay.",
      name: "Full name",
      room: "Room",
      code: "Access code",
      email: "Email",
      optional: "(optional)",
      acceptPre: "I accept the",
      acceptLink: "terms of use and privacy policy",
      marketing: "I would like to receive news and exclusive experiences from Casa Aroa.",
      connect: "Connect",
      doneEyebrow: "You are online",
      doneTitle: "You're <em>all set</em>",
      doneLead: "We wish you an unforgettable stay. We are at your disposal for anything you may need.",
      continue: "Continue browsing",
      termsTitle: "Terms of use",
      termsAccept: "Accept",
      errName: "Please tell us your name.",
      errRoom: "Please enter your room number.",
      errEmail: "That email address does not look right.",
      errCode: "Please enter the code provided at reception.",
      errTerms: "Please accept the terms of use to continue.",
      errBadCode: "The access code is not valid. Please ask at reception.",
      errNoMac: "We could not identify your device. Please reconnect to the Wi-Fi network.",
      errRate: "Too many attempts. Please wait a moment and try again.",
      errGeneric: "We could not connect you. Please try again or contact reception.",
      termsBody:
        "<h3>Service</h3><p>The hotel provides free internet access to its guests and visitors. Speed and availability may vary and the service may be interrupted for maintenance.</p>" +
        "<h3>Acceptable use</h3><p>The network must not be used for unlawful activities, to infringe third-party rights, to distribute malicious software or to degrade the service for other users. The hotel may limit or suspend access in case of misuse.</p>" +
        "<h3>Security</h3><p>This is a shared network. We recommend encrypted connections (HTTPS, VPN) for sensitive information. The hotel is not liable for data loss or damage arising from use of the service.</p>" +
        "<h3>Data protection</h3><p>Controller: {LEGAL}. We process your name, room, email (if provided) and technical device data to deliver and secure the service and to meet legal obligations. Marketing communications are only sent with your consent, which you may withdraw at any time. You may exercise your rights of access, rectification, erasure, objection, restriction and portability at reception, and lodge a complaint with the Spanish Data Protection Agency (AEPD).</p>",
    },
    fr: {
      kicker: "Ici. Maintenant.",
      heroQuote: "Un hôtel pour vivre Barcelone avec <em>présence</em>",
      hoodKicker: "Quartier gothique",
      hoodTitle: "À deux pas de la cathédrale",
      eyebrow: "Wi-Fi clients",
      title: "Bienvenue à <em>Casa Aroa</em>",
      lead: "Connectez-vous en un instant et profitez d'un internet haut débit pendant tout votre séjour.",
      name: "Nom et prénom",
      room: "Chambre",
      code: "Code d'accès",
      email: "E-mail",
      optional: "(facultatif)",
      acceptPre: "J'accepte les",
      acceptLink: "conditions d'utilisation et la politique de confidentialité",
      marketing: "Je souhaite recevoir les actualités et expériences exclusives de Casa Aroa.",
      connect: "Me connecter",
      doneEyebrow: "Connexion établie",
      doneTitle: "Tout est <em>prêt</em>",
      doneLead: "Nous vous souhaitons un séjour inoubliable. Nous restons à votre disposition pour tout ce dont vous auriez besoin.",
      continue: "Continuer la navigation",
      termsTitle: "Conditions d'utilisation",
      termsAccept: "Accepter",
      errName: "Merci d'indiquer votre nom.",
      errRoom: "Merci d'indiquer votre numéro de chambre.",
      errEmail: "L'adresse e-mail ne semble pas valide.",
      errCode: "Saisissez le code remis à la réception.",
      errTerms: "Veuillez accepter les conditions d'utilisation pour continuer.",
      errBadCode: "Le code d'accès est incorrect. Renseignez-vous à la réception.",
      errNoMac: "Impossible d'identifier votre appareil. Reconnectez-vous au réseau Wi-Fi.",
      errRate: "Trop de tentatives. Patientez un instant puis réessayez.",
      errGeneric: "La connexion a échoué. Réessayez ou contactez la réception.",
      termsBody:
        "<h3>Service</h3><p>L'hôtel met gratuitement un accès internet à la disposition de ses clients et visiteurs. Le débit et la disponibilité peuvent varier et le service peut être interrompu pour maintenance.</p>" +
        "<h3>Usage responsable</h3><p>Il est interdit d'utiliser le réseau à des fins illicites, de porter atteinte aux droits de tiers, de diffuser des logiciels malveillants ou de dégrader le service des autres utilisateurs. L'hôtel peut limiter ou suspendre l'accès en cas d'abus.</p>" +
        "<h3>Sécurité</h3><p>Le réseau est partagé. Nous recommandons des connexions chiffrées (HTTPS, VPN) pour les informations sensibles. L'hôtel décline toute responsabilité en cas de perte de données ou de dommages liés à l'utilisation du service.</p>" +
        "<h3>Protection des données</h3><p>Responsable : {LEGAL}. Nous traitons votre nom, votre chambre, votre e-mail (s'il est fourni) et des données techniques de l'appareil pour fournir et sécuriser le service et respecter nos obligations légales. Les communications commerciales ne sont envoyées qu'avec votre consentement, révocable à tout moment. Vous pouvez exercer vos droits d'accès, de rectification, d'effacement, d'opposition, de limitation et de portabilité à la réception, et saisir l'AEPD.</p>",
    },
  };

  var LANG_LABELS = { es: "ES", ca: "CA", en: "EN", fr: "FR" };
  var ICONS = {
    bell: '<path d="M5 18h14M12 5a6 6 0 0 1 6 6v4H6v-4a6 6 0 0 1 6-6zM12 3v2M10 21h4"/>',
    key: '<circle cx="8" cy="14" r="4"/><path d="M11 11l8-8M16 6l2 2M14 8l2 2"/>',
    cup: '<path d="M4 10h13v3a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6zM17 11h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M12 3v3"/>',
    spa: '<path d="M12 20c-4-2-7-5-7-9 3 0 5 1 7 3 2-2 4-3 7-3 0 4-3 7-7 9zM12 14V4M9 7l3-3 3 3"/>',
    fork: '<path d="M7 3v8a2 2 0 0 0 4 0V3M9 11v10M17 3c-2 0-3 3-3 6s1 4 3 4v8"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  };

  var params = new URLSearchParams(location.search);
  var $ = function (id) { return document.getElementById(id); };
  var lang = pickLang();

  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  function pickLang() {
    var langs = CFG.languages || Object.keys(I18N);
    var saved = store("aroa.lang");
    if (saved && langs.indexOf(saved) > -1) return saved;
    if (CFG.defaultLang && CFG.defaultLang !== "auto" && langs.indexOf(CFG.defaultLang) > -1) return CFG.defaultLang;
    var prefs = navigator.languages || [navigator.language || "es"];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).slice(0, 2).toLowerCase();
      if (langs.indexOf(code) > -1) return code;
    }
    return langs[0] || "es";
  }

  function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.es[key] || ""; }
  function pick(obj) { return obj && typeof obj === "object" ? obj[lang] || obj.es || obj.en || "" : obj || ""; }

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    $("termsBody").innerHTML = t("termsBody").replace("{LEGAL}", legalLine());
    document.querySelectorAll("#langs button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    renderServices();
    var err = $("error");
    if (err.dataset.key) err.textContent = t(err.dataset.key);
  }

  function renderLangs() {
    var nav = $("langs");
    (CFG.languages || Object.keys(I18N)).forEach(function (code) {
      if (!I18N[code]) return;
      var b = document.createElement("button");
      b.type = "button";
      b.dataset.lang = code;
      b.textContent = LANG_LABELS[code] || code.toUpperCase();
      b.addEventListener("click", function () { lang = code; store("aroa.lang", code); applyLang(); });
      nav.appendChild(b);
    });
  }

  function esc(v) {
    return String(v || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  function legalLine() {
    var h = CFG.hotel || {};
    var parts = [h.legalName || "Hotel " + (h.name || ""), h.taxId, h.address, h.email];
    return esc(parts.filter(Boolean).join(", "));
  }

  function renderBrand() {
    var h = CFG.hotel || {};
    if (h.logo) $("heroLogo").src = h.logo;
    if (CFG.heroImage) {
      var pre = new Image();
      pre.onload = function () {
        var el = $("heroPhoto");
        el.style.backgroundImage = 'url("' + CFG.heroImage + '")';
        el.classList.add("on");
      };
      pre.src = CFG.heroImage;
    }
    if (CFG.doneImage) $("postcard").querySelector("img").src = CFG.doneImage;
    else $("postcard").hidden = true;

    var foot = $("foot");
    foot.innerHTML = "";
    [h.address, h.phone, h.email].filter(Boolean).forEach(function (txt, i) {
      if (i) foot.appendChild(document.createTextNode(" · "));
      var span = document.createElement("span");
      span.textContent = txt;
      foot.appendChild(span);
    });
  }

  function renderServices() {
    var ul = $("services");
    ul.innerHTML = "";
    (CFG.services || []).forEach(function (s) {
      var li = document.createElement("li");
      var wrap = document.createElement(s.href ? "a" : "div");
      wrap.className = "svc";
      if (s.href) { wrap.href = s.href; wrap.target = "_blank"; wrap.rel = "noopener"; }
      wrap.innerHTML =
        '<svg class="i svc-icon" viewBox="0 0 24 24">' + (ICONS[s.icon] || ICONS.star) + "</svg>" +
        '<span><span class="svc-title"></span><span class="svc-text"></span></span>';
      wrap.querySelector(".svc-title").textContent = pick(s.title);
      wrap.querySelector(".svc-text").textContent = pick(s.text);
      li.appendChild(wrap);
      ul.appendChild(li);
    });
  }

  function setupForm() {
    if (!FORM.askRoom) $("fRoom").hidden = true;
    if (FORM.askAccessCode) $("fCode").hidden = false;
    if (!FORM.askEmail) { $("fEmail").hidden = true; $("fMarketing").hidden = true; }
    if (!FORM.askRoom && !FORM.askAccessCode) document.querySelector(".row").hidden = true;

    var saved = store("aroa.guest");
    if (saved) {
      try {
        var g = JSON.parse(saved);
        if (g.name) $("name").value = g.name;
        if (g.room) $("room").value = g.room;
        if (g.email) $("email").value = g.email;
      } catch (e) { /* ignore */ }
    }

    $("form").addEventListener("input", function (e) {
      var f = e.target.closest(".field, .check");
      if (f) f.classList.remove("invalid");
    });
    $("form").addEventListener("submit", onSubmit);
  }

  function showError(key) {
    var el = $("error");
    el.dataset.key = key || "";
    el.textContent = key ? t(key) : "";
  }

  function validate() {
    var name = $("name").value.trim();
    var room = $("room").value.trim();
    var email = $("email").value.trim();
    var code = $("accessCode").value.trim();
    var fail = null;
    function bad(el, key) {
      el.closest(".field, .check").classList.add("invalid");
      if (!fail) { fail = key; el.focus(); }
    }
    if (name.length < 2) bad($("name"), "errName");
    if (FORM.askRoom && !room) bad($("room"), "errRoom");
    if (FORM.askAccessCode && !code) bad($("accessCode"), "errCode");
    if (FORM.askEmail && email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) bad($("email"), "errEmail");
    if (!$("terms").checked) bad($("terms"), "errTerms");
    if (fail) { showError(fail); return null; }
    return {
      name: name,
      room: FORM.askRoom ? room : "",
      email: FORM.askEmail ? email : "",
      marketing: FORM.askEmail && $("marketing").checked,
      accessCode: FORM.askAccessCode ? code : "",
      lang: lang,
    };
  }

  function postJSON(url, body) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(body),
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (json) { return { status: res.status, json: json }; });
    });
  }

  function authorize(data) {
    var mode = CFG.mode || "external";
    var p = {
      mac: params.get("id") || "",
      ap: params.get("ap") || "",
      ssid: params.get("ssid") || "",
      t: params.get("t") || "",
      url: params.get("url") || "",
    };

    if (mode === "demo") {
      return new Promise(function (resolve) { setTimeout(function () { resolve(null); }, 1200); });
    }

    if (mode === "unifi") {
      var req = CFG.unifiLogin(data, p);
      return postJSON(req.url, req.body).then(function (r) {
        var rc = r.json && r.json.meta && r.json.meta.rc;
        if (r.status >= 200 && r.status < 300 && rc !== "error") return null;
        var msg = (r.json && r.json.meta && r.json.meta.msg) || "";
        return /password|voucher|code/i.test(msg) ? "errBadCode" : "errGeneric";
      });
    }

    if (!p.mac) return Promise.resolve("errNoMac");
    var body = Object.assign({}, data, p);
    return postJSON("/api/authorize", body).then(function (r) {
      if (r.status === 200 && r.json.ok) return null;
      return { bad_code: "errBadCode", no_mac: "errNoMac", rate_limited: "errRate" }[r.json.error] || "errGeneric";
    });
  }

  function safeUrl(u) {
    return /^https?:\/\//i.test(u || "") ? u : "";
  }

  function onSubmit(e) {
    e.preventDefault();
    showError("");
    var data = validate();
    if (!data) return;

    var btn = $("submit");
    btn.classList.add("loading");
    btn.disabled = true;

    authorize(data)
      .catch(function () { return "errGeneric"; })
      .then(function (errKey) {
        btn.classList.remove("loading");
        btn.disabled = false;
        if (errKey) { showError(errKey); return; }
        store("aroa.guest", JSON.stringify({ name: data.name, room: data.room, email: data.email }));
        onConnected();
      });
  }

  function onConnected() {
    var original = safeUrl(params.get("url"));
    var target = CFG.redirectUrl === "original" ? original : safeUrl(CFG.redirectUrl);
    if (target) {
      setTimeout(function () { location.href = target; }, 900);
    }
    $("viewForm").hidden = true;
    $("viewDone").hidden = false;
    if (original) {
      $("continue").href = original;
      $("continue").hidden = false;
    }
    window.scrollTo(0, 0);
  }

  function setupModal() {
    var modal = $("termsModal");
    function open() { modal.hidden = false; }
    function close() { modal.hidden = true; }
    $("openTerms").addEventListener("click", open);
    modal.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) close(); });
    $("acceptTerms").addEventListener("click", function () {
      $("terms").checked = true;
      $("terms").closest(".check").classList.remove("invalid");
      if ($("error").dataset.key === "errTerms") showError("");
      close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  renderLangs();
  renderBrand();
  setupForm();
  setupModal();
  applyLang();
})();
