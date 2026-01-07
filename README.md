# 📋 Discord Whitelist Bot

Bot de Discord completamente personalizable para sistemas de whitelist con formularios interactivos, embeds visuales y sistema de aprobación/rechazo.

![Discord.js](https://img.shields.io/badge/discord.js-v14-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.9.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Características

- 📝 **Formulario interactivo** por mensajes directos
- 🎨 **Completamente personalizable** (colores, emojis, textos)
- 📎 **Subida de archivos PDF** para historias de personajes
- ✅ **Sistema de aprobación/rechazo** con botones
- 📊 **Logs automáticos** con embeds elegantes
- ⏳ **Sistema de cooldown** configurable
- 🔔 **Notificaciones** a usuarios y admins
- 🎭 **Asignación automática** de roles

## 📸 Capturas

### Formulario Interactivo
![Formulario](https://via.placeholder.com/600x300?text=Formulario+Interactivo)

### Panel de Administración
![Admin Panel](https://via.placeholder.com/600x300?text=Panel+Admin)

## 🚀 Instalación

### Requisitos Previos

- [Node.js](https://nodejs.org/) v16.9.0 o superior
- Un bot de Discord ([Cómo crear uno](#-crear-bot-de-discord))
- Un servidor de Discord con permisos de administrador

### Instalación Local

1. **Clona el repositorio**
```bash
git clone (https://github.com/Laanisss/Bot-discord-Wh-Formulario)
cd discord-whitelist-bot
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura el bot**
   - Copia `config.example.json` y renómbralo a `config.json`
   - Edita `config.json` con tus datos (ver [Configuración](#%EF%B8%8F-configuración))

4. **Inicia el bot**
```bash
npm start
```

## ☁️ Hosting en Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

### Pasos para Deploy en Render

1. **Fork este repositorio** a tu cuenta de GitHub

2. **Crea una cuenta** en [Render.com](https://render.com) (gratis)

3. **Crea un nuevo Web Service**
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio forkeado

4. **Configura el servicio**
   - **Name:** `discord-whitelist-bot` (o el nombre que prefieras)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. **Añade las variables de entorno**
   
   Ve a "Environment" y añade estas variables:

   ```
   TOKEN=tu_token_de_discord
   GUILD_ID=id_de_tu_servidor
   ADMIN_CHANNEL_ID=id_canal_admin
   LOG_CHANNEL_ID=id_canal_logs
   APPROVED_ROLE_ID=id_rol_aprobado
   ```

6. **Deploy** - ¡Render automáticamente desplegará tu bot!

### Variables de Entorno para Render

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `TOKEN` | Token del bot de Discord | `MTIzNDU2Nzg5MDEyMzQ1Njc4OQ...` |
| `GUILD_ID` | ID del servidor de Discord | `782029619502514176` |
| `ADMIN_CHANNEL_ID` | Canal donde llegan las whitelists | `1458494662150062272` |
| `LOG_CHANNEL_ID` | Canal de logs | `1458497683911344178` |
| `APPROVED_ROLE_ID` | Rol que se da al aprobar | `1458493386150514822` |
| `COOLDOWN_HOURS` | Horas de cooldown (opcional) | `24` |

## ⚙️ Configuración

### config.json

```json
{
  "token": "TU_TOKEN_AQUI",
  "guildId": "ID_DE_TU_SERVIDOR",
  "adminChannelId": "ID_CANAL_ADMIN",
  "logChannelId": "ID_CANAL_LOGS",
  "approvedRoleId": "ID_ROL_APROBADO",
  "cooldownHours": 24,
  
  "serverName": "Mi Servidor Roleplay",
  "serverIcon": "https://i.imgur.com/tu-logo.png",
  "mentionRole": null,
  
  "colors": {
    "primary": "#5865F2",
    "success": "#00FF00",
    "error": "#FF0000",
    "warning": "#FFA500",
    "pending": "#FFD700",
    "question": "#00D9FF"
  },
  
  "emojis": {
    "welcome": "👋",
    "start": "📩",
    "success": "✅",
    "error": "❌",
    "approve": "🎉",
    "reject": "🚫"
  },
  
  "buttonLabels": {
    "approve": "Aprobar Whitelist",
    "reject": "Rechazar Whitelist"
  }
}
```

### Obtener IDs de Discord

1. Activa el **Modo Desarrollador** en Discord:
   - Configuración de Usuario → Avanzado → Modo Desarrollador

2. **ID del Servidor**: Click derecho en el servidor → Copiar ID

3. **ID de Canales**: Click derecho en el canal → Copiar ID

4. **ID de Roles**: Configuración del Servidor → Roles → Click derecho → Copiar ID

## 🤖 Crear Bot de Discord

1. Ve al [Discord Developer Portal](https://discord.com/developers/applications)

2. Click en **"New Application"**

3. Dale un nombre y acepta los términos

4. Ve a la sección **"Bot"**
   - Click en "Add Bot"
   - Activa estas opciones:
     - ✅ SERVER MEMBERS INTENT
     - ✅ MESSAGE CONTENT INTENT

5. **Copia el Token** (guárdalo en un lugar seguro)

6. Ve a **"OAuth2" → "URL Generator"**
   - Selecciona: `bot` y `applications.commands`
   - Permisos necesarios:
     - ✅ Manage Roles
     - ✅ Send Messages
     - ✅ Embed Links
     - ✅ Attach Files
     - ✅ Use Slash Commands
   
7. **Copia la URL** generada y ábrela para invitar el bot a tu servidor

## 📝 Uso

### Comandos

| Comando | Descripción |
|---------|-------------|
| `/whitelist` | Inicia el formulario de whitelist |

### Para Usuarios

1. Usa `/whitelist` en el servidor
2. Revisa tus mensajes directos
3. Responde las preguntas del formulario
4. Sube el PDF con la historia de tu personaje
5. Espera la revisión del staff

### Para Administradores

1. Revisa las whitelists en el canal de administración
2. Click en **✅ Aprobar** o **❌ Rechazar**
3. Si rechazas, escribe el motivo
4. El usuario recibirá una notificación automática

## 🎨 Personalización

### Cambiar Colores

Edita la sección `colors` en `config.json`:

```json
"colors": {
  "primary": "#FF1493",    // Rosa
  "success": "#00FF7F",    // Verde menta
  "error": "#FF4500"       // Rojo naranja
}
```

Usa códigos HEX de color: [HTML Color Picker](https://htmlcolorcodes.com/)

### Emojis Personalizados

Puedes usar emojis de tu servidor:

```json
"emojis": {
  "approve": "<:aprobado:123456789>",
  "reject": "<:rechazado:987654321>"
}
```

Para obtener el formato del emoji:
1. Escribe `\:nombre_emoji:` en Discord
2. Copia el resultado que aparece

### Cambiar Preguntas

Edita el array `preguntas` en `index.js`:

```javascript
const preguntas = [
  "**📝 Tu pregunta personalizada:**\n> Descripción de la pregunta",
  "**🎯 Otra pregunta:**\n> Más detalles aquí"
];
```

## 🔧 Solución de Problemas

### El bot no responde

- ✅ Verifica que el token sea correcto
- ✅ Asegúrate de que los intents estén activados
- ✅ Revisa que el bot tenga permisos en el servidor

### No recibo mensajes directos

- ✅ Verifica que tengas los MD abiertos en el servidor
- ✅ Configuración → Privacidad → Permitir MD de miembros del servidor

### Los botones no funcionan

- ✅ Reinicia el bot después de hacer cambios
- ✅ Verifica que el bot tenga permisos de "Manage Roles"
- ✅ Asegúrate de que el rol del bot esté por encima del rol a asignar

### Error al subir PDF

- ✅ El archivo debe ser formato .pdf
- ✅ Tamaño máximo: 8MB (límite de Discord)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si quieres mejorar el bot:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -m 'Añadir mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 💬 Soporte

¿Necesitas ayuda? 

- 🐛 [Reporta un bug](https://github.com/Laanisss/Bot-discord-Wh-Formulario/issues)
- 💡 [Sugiere una función](https://github.com/Laanisss/Bot-discord-Wh-Formulario/issues)
- 📧 Contacto: laaniiss1@gmail.com

## ⭐ Agradecimientos

Si este bot te fue útil, ¡dale una estrella ⭐ al repositorio!

---

Hecho con ❤️ para la comunidad de Discord
