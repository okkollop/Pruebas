# Hotel Casa Aroa · Portal WiFi para UniFi (UDM Pro)

Portal cautivo para la red de invitados con la identidad de Casa Aroa: logo oficial, Cormorant Garamond + Montserrat, marrón corporativo `#2e1704` y terracota `#8b2e20`, la recepción del hotel como imagen principal y el lema *"Aquí. Ahora. Un hotel para vivir Barcelona con presencia"*. Está en castellano, catalán, inglés y francés, y pensado primero para móvil.

| Escritorio | Móvil | Conectado |
|---|---|---|
| ![](docs/desktop.png) | ![](docs/mobile.png) | ![](docs/mobile-done.png) |

---

## Resumen: qué opción usar

| Opción | Personalización | Resiste actualizaciones del UDM | Dificultad |
|---|---|---|---|
| **A. Editor del portal de UniFi** | Logo, fondo, colores, textos | ✅ | Baja |
| **B. Portal externo** (servidor local + este proyecto) ⭐ | **Total** | ✅ | Media |
| **C. Copiar ficheros dentro del UDM por SSH** | Total | ❌ se pierde con cada actualización | Media, frágil |

**Recomendado: B.** UniFi solo redirige al huésped a vuestro servidor local, y ese servidor da acceso al dispositivo mediante la API del UDM. El diseño es vuestro al 100 % y las actualizaciones de UniFi no le afectan.

---

## Estructura

```
hotspot-casa-aroa/
├── portal/              ← la página (HTML/CSS/JS, sin dependencias)
│   ├── index.html
│   ├── styles.css
│   ├── app.js           ← lógica + textos en 4 idiomas
│   ├── config.js        ← ★ lo que se edita: datos del hotel, fotos, campos, servicios
│   ├── fonts/           ← Cormorant Garamond + Montserrat autoalojadas (licencia OFL)
│   └── img/             ← logo (blanco y marrón), hero.jpg (recepción), barri-gotic.jpg
└── server/              ← servidor de portal externo (Node.js 18+, sin dependencias)
    ├── server.js
    ├── unifi.js         ← cliente de la API de UniFi (login + authorize-guest)
    ├── .env.example     ← configuración (IP del UDM, usuario, duración…)
    ├── Dockerfile / docker-compose.yml
    └── casa-aroa-portal.service   ← unidad systemd
```

Las fuentes y las fotos van dentro del proyecto porque, antes de conectarse, el huésped **no tiene internet** y no podría cargarlas de fuera.

---

## Opción B · Paso a paso (servidor local + UDM Pro)

### Paso 1 · Preparar el servidor local
Cualquier equipo siempre encendido en la red del hotel: mini‑PC, Raspberry Pi 4/5, NAS con Docker (Synology, QNAP…) o una VM.

1. Dale una **IP fija** en la misma red o VLAN que pueda ver la red de invitados (en el ejemplo, `192.168.1.10`). Lo más fácil es reservarla en UniFi: *Client Devices → el equipo → Fixed IP*.
2. Instala **Docker**, o **Node.js 18 o superior** si prefieres no usar Docker.

### Paso 2 · Crear un usuario para el portal en el UDM
En UniFi OS → *Admins & Users* → **Add Admin**:
- Tipo **Local Access Only** (no una cuenta Ubiquiti ni SSO), sin 2FA.
- Acceso solo a la app **Network**, con el rol más limitado que permita gestionar invitados (*Hotspot Operator* o *Site Admin*, según la versión).
- Ejemplo: usuario `portal` con una contraseña larga.

### Paso 3 · Instalar el portal
Descomprime el ZIP (o clona el repositorio) en el servidor y configura:

```bash
cd hotspot-casa-aroa/server
cp .env.example .env
nano .env
```

Mínimo que hay que rellenar en `.env`:
```ini
UNIFI_HOST=192.168.1.1      # IP del UDM Pro
UNIFI_USER=portal
UNIFI_PASS=la-contraseña
GUEST_MINUTES=4320          # duración del acceso (4320 = 3 días, 10080 = 7 días)
```

**A) Con Docker (recomendado)**
```bash
mkdir -p data && sudo chown 1000:1000 data
docker compose up -d --build
docker compose logs -f        # debe decir "Portal Casa Aroa escuchando en :80"
```

**B) Sin Docker (systemd, Linux)**
```bash
sudo useradd -r -s /usr/sbin/nologin portal
sudo mkdir -p /opt/casa-aroa-portal && sudo cp -r ../portal ../server /opt/casa-aroa-portal/
sudo mkdir -p /opt/casa-aroa-portal/server/data && sudo chown portal /opt/casa-aroa-portal/server/data
sudo cp casa-aroa-portal.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now casa-aroa-portal
journalctl -u casa-aroa-portal -f
```

**Comprobación:** desde un ordenador de la red abre `http://192.168.1.10/guest/s/default/?id=aa:bb:cc:dd:ee:ff`. Debe aparecer el portal.
Para probar sin tocar UniFi: pon `DRY_RUN=true` en `.env`.

### Paso 4 · Configurar UniFi Network (UDM Pro)
Los nombres del menú cambian un poco según la versión de Network. Busca **Hotspot / Guest Portal**:

1. **Settings → WiFi**: crea o edita la red de invitados (p. ej. `Casa Aroa Guest`) y activa **Hotspot Portal / Guest Hotspot**. Puedes activar también *Client Device Isolation*.
2. **Hotspot Manager / Portal → Authentication**: elige **External Portal Server** e introduce la IP del servidor (`192.168.1.10`).
3. **Pre-Authorization Allowances**: no hace falta nada para el portal. Añade solo dominios externos que quieras abrir antes de conectar.
4. **Firewall / Traffic Rules**: si la VLAN de invitados está aislada, crea una regla que **permita TCP 80 desde la red de invitados hacia 192.168.1.10**. Ponla por encima de las reglas de bloqueo.
5. **HTTPS redirection**: déjalo desactivado salvo que tengas un certificado válido en el servidor. Los móviles detectan el portal por HTTP.

### Paso 5 · Probar con un móvil
1. Olvida la red si ya estabas conectado y conéctate a la WiFi de invitados.
2. Se abre el portal automáticamente (iPhone y Android). Si no, abre `http://neverssl.com`.
3. Rellena el formulario → **Conectarme** → pantalla "Todo listo". El dispositivo debe salir como **autorizado** en *UniFi → Hotspot → Guests*.
4. Si da error: `docker compose logs` muestra el motivo (usuario o contraseña incorrectos, IP del UDM, etc.).

### Cómo funciona
```
Huésped se conecta ─► UniFi lo redirige a http://192.168.1.10/guest/s/default/?id=<MAC>&ap=…&url=…
                     ─► rellena nombre + habitación y acepta las condiciones
                     ─► POST /api/authorize ─► server.js inicia sesión en el UDM
                        y envía  cmd: authorize-guest  (MAC, minutos, límites)
                     ─► pantalla "Todo listo" con los servicios del hotel
```

Otras variables de `.env`:
- `GUEST_DOWN_KBPS` / `GUEST_UP_KBPS` / `GUEST_MB_LIMIT`: límites de velocidad y datos.
- `ACCESS_CODE`: código diario de recepción. Si se define, el portal muestra el campo automáticamente.

### Actualizar el diseño más adelante
Edita los ficheros de `portal/` y reinicia: `docker compose up -d --build` o `sudo systemctl restart casa-aroa-portal`.

---

## Opción C · Ficheros dentro del UDM Pro por SSH

Úsala solo si aceptas volver a copiar los ficheros tras cada actualización.

1. Activa SSH: UniFi OS → *Settings → Control Plane → Console → SSH*.
2. En `portal/config.js` pon `mode: "unifi"`.
3. Localiza la carpeta del portal (la ruta cambia según versión):
   ```bash
   ssh root@192.168.1.1
   find / -type d -name "app-unifi-hotspot-portal" 2>/dev/null
   # suele ser /data/unifi/data/sites/default/app-unifi-hotspot-portal
   ```
4. Haz copia de seguridad y sube los ficheros:
   ```bash
   P=/data/unifi/data/sites/default/app-unifi-hotspot-portal   # la ruta encontrada
   ssh root@192.168.1.1 "cp -a $P ${P}.bak"
   scp -r portal/* root@192.168.1.1:$P/
   ```
5. En Network activa el portal con autenticación *Sin contraseña / Aceptar condiciones*, o *Contraseña* si usas código.
6. **Verifica el endpoint de login**: los nombres de campo pueden variar entre versiones de UniFi. Abre una vez el portal original con DevTools → *Network*, mira la petición `login` y ajusta la función `unifiLogin` de `config.js` si difiere.

---

## Personalizar (`portal/config.js`)
- `hotel`: dirección, teléfono, email y **razón social + NIF** para el texto de privacidad.
- `heroImage` / `doneImage`: fotos del panel principal y de la pantalla final (JPG ≈1600 px, menos de 300 KB).
- `form`: activar o desactivar habitación, email o código de acceso.
- `services`: tarjetas de la pantalla final. Con `href` se convierten en enlaces.
- `redirectUrl`: `""` muestra la pantalla del hotel · una URL fija · `"original"` vuelve a la web que pedía el huésped.
- Textos e idiomas: objeto `I18N` en `app.js`. Colores: variables `:root` en `styles.css`.

## RGPD
- El servidor guarda cada alta en `server/data/guests.jsonl` (nombre, habitación, email opcional, consentimiento, MAC). Definid un **plazo de conservación** y borradlo periódicamente.
- El consentimiento para comunicaciones comerciales es opcional y separado.
- El texto de condiciones y privacidad es una base genérica: que lo revise el asesor legal y completad `legalName` y `taxId`.
- Fotos y logo proceden de casaaroahotel.com. Usadlos solo con autorización del hotel.
