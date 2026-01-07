const {
  Client,
  GatewayIntentBits,
  Partials,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

// Soporte para variables de entorno (Render) o config.json (local)
let config;
try {
  config = require("./config.json");
} catch (error) {
  console.log("📝 Usando variables de entorno");
  config = {
    token: process.env.TOKEN,
    guildId: process.env.GUILD_ID,
    adminChannelId: process.env.ADMIN_CHANNEL_ID,
    logChannelId: process.env.LOG_CHANNEL_ID,
    approvedRoleId: process.env.APPROVED_ROLE_ID,
    cooldownHours: parseInt(process.env.COOLDOWN_HOURS || "24"),
    serverName: process.env.SERVER_NAME || "Whitelist System",
    serverIcon: process.env.SERVER_ICON || null,
    mentionRole: process.env.MENTION_ROLE || null,
    colors: {
      primary: process.env.COLOR_PRIMARY || "#5865F2",
      success: process.env.COLOR_SUCCESS || "#00FF00",
      error: process.env.COLOR_ERROR || "#FF0000",
      warning: process.env.COLOR_WARNING || "#FFA500",
      pending: process.env.COLOR_PENDING || "#FFD700",
      question: process.env.COLOR_QUESTION || "#00D9FF"
    },
    emojis: {
      welcome: "👋", start: "📩", success: "✅", error: "❌",
      warning: "⚠️", info: "ℹ️", pending: "⏳", time: "⏱️",
      upload: "📎", user: "👤", id: "🆔", character: "🎭",
      age: "🎂", experience: "⭐", story: "📖", approve: "🎉",
      reject: "🚫", reason: "📌", retry: "🔄", notification: "🔔",
      admin: "👮"
    },
    buttonLabels: {
      approve: "Aprobar Whitelist",
      reject: "Rechazar Whitelist"
    }
  };
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const cooldowns = new Map();

const preguntas = [
  "**📝 Nombre del personaje:**\n> Escribe el nombre completo de tu personaje.",
  "**🎂 Edad del personaje:**\n> ¿Cuántos años tiene tu personaje?",
  "**⭐ Experiencia en rol:**\n> ¿Cuánto tiempo llevas haciendo roleplay?",
  "**📖 Historia de tu personaje:**\n> Cuéntanos brevemente la historia de tu personaje (mínimo 3 líneas)."
];

client.once("ready", async () => {
  console.log(`🟢 Bot listo: ${client.user.tag}`);

  const guild = await client.guilds.fetch(config.guildId);
  await guild.commands.create(
    new SlashCommandBuilder()
      .setName("whitelist")
      .setDescription("Iniciar formulario de whitelist")
  );
});

client.on("interactionCreate", async interaction => {

  /* ───────── COMANDO ───────── */
  if (interaction.isChatInputCommand() && interaction.commandName === "whitelist") {
    const userId = interaction.user.id;
    const cooldown = cooldowns.get(userId);
    const ahora = Date.now();

    if (cooldown && ahora - cooldown < config.cooldownHours * 3600000) {
      const restante = Math.ceil(
        (config.cooldownHours * 3600000 - (ahora - cooldown)) / 3600000
      );
      
      const cooldownEmbed = new EmbedBuilder()
        .setColor(config.colors?.error || "#FF0000")
        .setTitle(`${config.emojis?.error || "⏳"} Cooldown Activo`)
        .setDescription(`Debes esperar **${restante} hora(s)** para volver a enviar una whitelist.`)
        .setFooter({ text: config.serverName || "Whitelist System" })
        .setTimestamp();

      return interaction.reply({
        embeds: [cooldownEmbed],
        ephemeral: true
      });
    }

    cooldowns.set(userId, ahora);
    
    const startEmbed = new EmbedBuilder()
      .setColor(config.colors?.primary || "#00FF00")
      .setTitle(`${config.emojis?.start || "📩"} Formulario Iniciado`)
      .setDescription("**¡Revisa tus mensajes directos!**\n\nTe he enviado el formulario por MD. Si no recibes nada, verifica que tengas los MD abiertos.")
      .setFooter({ text: config.serverName || "Whitelist System" })
      .setTimestamp();

    await interaction.reply({ embeds: [startEmbed], ephemeral: true });

    try {
      const dm = await interaction.user.createDM();
      
      // Mensaje de bienvenida
      const welcomeEmbed = new EmbedBuilder()
        .setColor(config.colors?.primary || "#5865F2")
        .setTitle(`${config.emojis?.welcome || "👋"} Bienvenido al Formulario de Whitelist`)
        .setDescription(
          `**${config.serverName || "Nuestro Servidor"}** te da la bienvenida.\n\n` +
          `${config.emojis?.info || "📋"} Responde a las siguientes preguntas con sinceridad.\n` +
          `${config.emojis?.time || "⏱️"} Tienes **5 minutos** por respuesta.\n` +
          `${config.emojis?.warning || "⚠️"} Si no respondes a tiempo, deberás reiniciar el proceso.`
        )
        .setThumbnail(config.serverIcon || null)
        .setFooter({ text: "Proceso de Whitelist" })
        .setTimestamp();

      await dm.send({ embeds: [welcomeEmbed] });

      let respuestas = [];

      for (let i = 0; i < preguntas.length; i++) {
        const preguntaEmbed = new EmbedBuilder()
          .setColor(config.colors?.question || "#FFD700")
          .setDescription(preguntas[i])
          .setFooter({ text: `Pregunta ${i + 1} de ${preguntas.length}` });

        await dm.send({ embeds: [preguntaEmbed] });
        
        const res = await dm.awaitMessages({ 
          filter: m => m.author.id === userId,
          max: 1, 
          time: 300000,
          errors: ['time']
        });
        
        respuestas.push(res.first().content);

        // Confirmación de respuesta
        await dm.send(`${config.emojis?.success || "✅"} **Respuesta registrada**`);
        
        // Pequeña pausa antes de la siguiente pregunta
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Solicitar PDF
      const pdfEmbed = new EmbedBuilder()
        .setColor(config.colors?.primary || "#5865F2")
        .setTitle(`${config.emojis?.upload || "📎"} Archivo Requerido`)
        .setDescription(
          "**Sube un archivo PDF** con la historia completa de tu personaje.\n\n" +
          `${config.emojis?.info || "ℹ️"} El archivo debe ser formato **.pdf**\n` +
          `${config.emojis?.time || "⏱️"} Tienes **5 minutos** para subirlo.`
        )
        .setFooter({ text: "Última pregunta" });

      await dm.send({ embeds: [pdfEmbed] });
      
      const pdfMsg = await dm.awaitMessages({ 
        filter: m => m.author.id === userId && m.attachments.size > 0,
        max: 1, 
        time: 300000,
        errors: ['time']
      });
      const archivo = pdfMsg.first().attachments.first();

      if (!archivo || !archivo.name.endsWith(".pdf")) {
        const errorEmbed = new EmbedBuilder()
          .setColor(config.colors?.error || "#FF0000")
          .setTitle(`${config.emojis?.error || "❌"} Archivo Inválido`)
          .setDescription("El archivo debe ser formato **PDF**.\n\nInicia el proceso nuevamente con `/whitelist`")
          .setFooter({ text: config.serverName || "Whitelist System" });
        
        return dm.send({ embeds: [errorEmbed] });
      }

      // Embed para el canal de administración
      const embed = new EmbedBuilder()
        .setTitle(`${config.emojis?.pending || "📋"} Whitelist Pendiente de Revisión`)
        .setColor(config.colors?.pending || "#FFA500")
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { 
            name: `${config.emojis?.user || "👤"} Usuario`, 
            value: `<@${userId}>\n\`${interaction.user.tag}\``, 
            inline: true 
          },
          { 
            name: `${config.emojis?.id || "🆔"} ID`, 
            value: `\`${userId}\``, 
            inline: true 
          },
          { name: "\u200B", value: "\u200B", inline: true },
          { 
            name: `${config.emojis?.character || "🎭"} Nombre del Personaje`, 
            value: `\`\`\`${respuestas[0]}\`\`\``, 
            inline: false 
          },
          { 
            name: `${config.emojis?.age || "🎂"} Edad`, 
            value: `\`\`\`${respuestas[1]}\`\`\``, 
            inline: true 
          },
          { 
            name: `${config.emojis?.experience || "⭐"} Experiencia`, 
            value: `\`\`\`${respuestas[2]}\`\`\``, 
            inline: true 
          },
          { name: "\u200B", value: "\u200B", inline: true },
          { 
            name: `${config.emojis?.story || "📖"} Historia del Personaje`, 
            value: respuestas[3].length > 1024 ? respuestas[3].substring(0, 1021) + "..." : respuestas[3], 
            inline: false 
          }
        )
        .setFooter({ 
          text: `Whitelist ID: ${userId} • ${config.serverName || "Server"}`, 
          iconURL: config.serverIcon || null 
        })
        .setTimestamp();

      const botones = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`aprobar_${userId}`)
          .setLabel(config.buttonLabels?.approve || "Aprobar")
          .setEmoji(config.emojis?.approve || "✅")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`rechazar_${userId}`)
          .setLabel(config.buttonLabels?.reject || "Rechazar")
          .setEmoji(config.emojis?.reject || "❌")
          .setStyle(ButtonStyle.Danger)
      );

      const canalAdmin = await client.channels.fetch(config.adminChannelId);
      await canalAdmin.send({ 
        content: config.mentionRole ? `<@&${config.mentionRole}>` : null,
        embeds: [embed], 
        components: [botones], 
        files: [archivo.url] 
      });

      // Mensaje de confirmación al usuario
      const successEmbed = new EmbedBuilder()
        .setColor(config.colors?.success || "#00FF00")
        .setTitle(`${config.emojis?.success || "✅"} Whitelist Enviada Exitosamente`)
        .setDescription(
          `Tu solicitud ha sido enviada correctamente.\n\n` +
          `${config.emojis?.pending || "⏳"} **Estado:** Pendiente de revisión\n` +
          `${config.emojis?.info || "📋"} Un administrador revisará tu solicitud pronto.\n` +
          `${config.emojis?.notification || "🔔"} Recibirás una notificación cuando sea procesada.`
        )
        .setThumbnail(config.serverIcon || null)
        .setFooter({ text: config.serverName || "Whitelist System" })
        .setTimestamp();

      await dm.send({ embeds: [successEmbed] });

    } catch (error) {
      console.error("Error en el proceso de whitelist:", error);
      try {
        const dm = await interaction.user.createDM();
        const errorEmbed = new EmbedBuilder()
          .setColor(config.colors?.error || "#FF0000")
          .setTitle(`${config.emojis?.error || "❌"} Error en el Proceso`)
          .setDescription(
            "**Tiempo agotado o hubo un error.**\n\n" +
            `${config.emojis?.retry || "🔄"} Intenta nuevamente con \`/whitelist\``
          )
          .setFooter({ text: config.serverName || "Whitelist System" });
        
        await dm.send({ embeds: [errorEmbed] });
      } catch (e) {
        console.error("No se pudo enviar mensaje de error al usuario:", e);
      }
    }
  }

  /* ───────── BOTONES ───────── */
  if (interaction.isButton()) {
    const [accion, userId] = interaction.customId.split("_");

    if (accion === "aprobar") {
      try {
        await interaction.deferUpdate();

        const guild = await client.guilds.fetch(config.guildId);
        const miembro = await guild.members.fetch(userId);
        
        await miembro.roles.add(config.approvedRoleId);
        
        try {
          const approveEmbed = new EmbedBuilder()
            .setColor(config.colors?.success || "#00FF00")
            .setTitle(`${config.emojis?.approve || "🎉"} ¡Whitelist Aprobada!`)
            .setDescription(
              `**¡Felicidades!** Tu whitelist ha sido aprobada.\n\n` +
              `${config.emojis?.success || "✅"} Ya puedes acceder al servidor.\n` +
              `${config.emojis?.welcome || "👋"} ¡Bienvenido a **${config.serverName || "nuestro servidor"}**!\n` +
              `${config.emojis?.info || "📋"} Lee las reglas y diviértete.`
            )
            .setThumbnail(config.serverIcon || null)
            .setFooter({ text: `Aprobado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

          await miembro.send({ embeds: [approveEmbed] });
        } catch (e) {
          console.log("No se pudo enviar MD al usuario:", e.message);
        }

        const log = await client.channels.fetch(config.logChannelId);
        const logEmbed = new EmbedBuilder()
          .setColor(config.colors?.success || "#00FF00")
          .setTitle(`${config.emojis?.approve || "✅"} Whitelist Aprobada`)
          .addFields(
            { name: "Usuario", value: `<@${userId}>`, inline: true },
            { name: "Administrador", value: `<@${interaction.user.id}>`, inline: true },
            { name: "Fecha", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
          )
          .setTimestamp();

        await log.send({ embeds: [logEmbed] });

        const embedActualizado = EmbedBuilder.from(interaction.message.embeds[0])
          .setColor(config.colors?.success || "#00FF00")
          .setTitle(`${config.emojis?.approve || "✅"} Whitelist APROBADA`)
          .addFields({ 
            name: `${config.emojis?.admin || "👮"} Aprobado por`, 
            value: `<@${interaction.user.id}>`, 
            inline: false 
          });

        await interaction.editReply({ 
          embeds: [embedActualizado], 
          components: [] 
        });

      } catch (error) {
        console.error("Error al aprobar:", error);
        await interaction.followUp({ 
          content: `${config.emojis?.error || "❌"} Error al procesar la aprobación.`, 
          ephemeral: true 
        });
      }
    }

    if (accion === "rechazar") {
      const modal = new ModalBuilder()
        .setCustomId(`modal_rechazo_${userId}`)
        .setTitle("Motivo del Rechazo");

      const motivo = new TextInputBuilder()
        .setCustomId("motivo")
        .setLabel("¿Por qué rechazas esta whitelist?")
        .setPlaceholder("Escribe el motivo del rechazo...")
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(10)
        .setMaxLength(500)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(motivo));
      
      try {
        await interaction.showModal(modal);
      } catch (error) {
        console.error("Error al mostrar modal:", error);
        await interaction.reply({ 
          content: `${config.emojis?.error || "❌"} Error al abrir el formulario.`, 
          ephemeral: true 
        });
      }
    }
  }

  /* ───────── MODAL ───────── */
  if (interaction.isModalSubmit()) {
    const [, , userId] = interaction.customId.split("_");
    const motivo = interaction.fields.getTextInputValue("motivo");

    try {
      await interaction.deferReply({ ephemeral: true });

      const guild = await client.guilds.fetch(config.guildId);
      const miembro = await guild.members.fetch(userId);

      try {
        const rejectEmbed = new EmbedBuilder()
          .setColor(config.colors?.error || "#FF0000")
          .setTitle(`${config.emojis?.reject || "❌"} Whitelist Rechazada`)
          .setDescription(
            `Tu solicitud de whitelist ha sido **rechazada**.\n\n` +
            `${config.emojis?.reason || "📌"} **Motivo:**\n\`\`\`${motivo}\`\`\`\n` +
            `${config.emojis?.retry || "🔄"} Puedes volver a intentarlo en **${config.cooldownHours}h** corrigiendo los errores mencionados.`
          )
          .setThumbnail(config.serverIcon || null)
          .setFooter({ text: `Rechazado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
          .setTimestamp();

        await miembro.send({ embeds: [rejectEmbed] });
      } catch (e) {
        console.log("No se pudo enviar MD al usuario:", e.message);
      }

      const log = await client.channels.fetch(config.logChannelId);
      const logEmbed = new EmbedBuilder()
        .setColor(config.colors?.error || "#FF0000")
        .setTitle(`${config.emojis?.reject || "❌"} Whitelist Rechazada`)
        .addFields(
          { name: "Usuario", value: `<@${userId}>`, inline: true },
          { name: "Administrador", value: `<@${interaction.user.id}>`, inline: true },
          { name: "Motivo", value: motivo, inline: false },
          { name: "Fecha", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
        )
        .setTimestamp();

      await log.send({ embeds: [logEmbed] });

      const mensaje = await interaction.message.fetch();
      const embedActualizado = EmbedBuilder.from(mensaje.embeds[0])
        .setColor(config.colors?.error || "#FF0000")
        .setTitle(`${config.emojis?.reject || "❌"} Whitelist RECHAZADA`)
        .addFields(
          { name: `${config.emojis?.reason || "📌"} Motivo`, value: motivo, inline: false },
          { name: `${config.emojis?.admin || "👮"} Rechazado por`, value: `<@${interaction.user.id}>`, inline: false }
        );

      await mensaje.edit({ 
        embeds: [embedActualizado], 
        components: [] 
      });

      const confirmEmbed = new EmbedBuilder()
        .setColor(config.colors?.success || "#00FF00")
        .setDescription(`${config.emojis?.success || "✅"} Rechazo procesado correctamente.`);

      await interaction.editReply({ 
        embeds: [confirmEmbed]
      });

    } catch (error) {
      console.error("Error al rechazar:", error);
      await interaction.editReply({ 
        content: `${config.emojis?.error || "❌"} Error al procesar el rechazo.` 
      });
    }
  }
});

client.login(config.token);