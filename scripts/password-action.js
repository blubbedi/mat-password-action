console.log("📦 Passwort-Modul wird geladen...");

Hooks.once("monks-active-tiles.registerActions", () => {
  console.log("✅ [MAT Passwort-Modul] Aktion wird registriert...");

  game.MonksActiveTiles.registerAction("password-check", {
    label: "Passwort-Eingabe",
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
        console.warn("🚫 Kein Token oder kein Passwort konfiguriert.");
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
        console.log("🚫 Eingabe abgebrochen.");
        return false;
      }

      if (input === expectedPassword) {
        ui.notifications.info("Zugang gewährt.");
        console.log("✅ Passwort korrekt.");
        return true;
      } else {
        ui.notifications.error("Falsches Passwort.");
        console.warn("🚫 Passwort falsch.");
        return false;
      }
    }
  });

  console.log("✅ [MAT Passwort-Modul] Aktion 'password-check' registriert.");
});
