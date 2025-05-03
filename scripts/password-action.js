console.log("📦 Passwort-Modul wird geladen...");
Hooks.once("ready", () => {
  console.log("✅ [MAT Passwort-Modul] Foundry ready.");
  console.log("✅ [MAT Passwort-Modul] MAT geladen:", !!game.MonksActiveTiles);
});

Hooks.once("monks-active-tiles.registerActions", () => {
  console.log("🔐 [MAT Passwort-Modul] Registrierung der Passwort-Aktion gestartet.");

  game.MonksActiveTiles.registerAction("password-check", {
    label: "Passwort-Eingabe", // Name im MAT-Menü
    icon: "icons/skills/social/intimidation-impressing.webp",
    permission: "OBSERVER",

    getConfigForm: (current = {}) => {
      return {
        html: `
          <div class="form-group">
            <label>Geheimes Passwort</label>
            <input type="text" name="password" value="${current.password || ""}" />
          </div>
        `,
        update: (form) => {
          const formData = new FormData(form[0]);
          return {
            password: formData.get("password")?.trim()
          };
        }
      };
    },

    handler: async ({ tile, token, trigger }) => {
      if (!token || !trigger?.data?.password) {
        console.warn("🚫 [MAT Passwort-Modul] Kein Token oder Passwort konfiguriert.");
        return false;
      }

      const expectedPassword = trigger.data.password;

      const input = await new Promise((resolve) => {
        new Dialog({
          title: "Zugangscode eingeben",
          content: `
            <p>Bitte gib das Passwort ein:</p>
            <input type="text" id="tile-password-input" style="width:100%" autofocus/>
          `,
          buttons: {
            ok: {
              label: "Bestätigen",
              callback: (html) => {
                const value = html.find("#tile-password-input").val()?.trim();
                resolve(value);
              }
            },
            cancel: {
              label: "Abbrechen",
              callback: () => resolve(null)
            }
          },
          default: "ok"
        }).render(true);
      });

      if (input === null) {
        console.log("🚫 [MAT Passwort-Modul] Eingabe abgebrochen.");
        return false;
      }

      if (input === expectedPassword) {
        ui.notifications.info("Zugang gewährt.");
        console.log("✅ [MAT Passwort-Modul] Passwort korrekt.");
        return true;
      } else {
        ui.notifications.error("Falsches Passwort.");
        console.warn("🚫 [MAT Passwort-Modul] Falsches Passwort eingegeben.");
        return false;
      }
    }
  });

  console.log("✅ [MAT Passwort-Modul] Aktion 'password-check' registriert.");
});
