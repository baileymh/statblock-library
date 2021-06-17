(() => {
  const module = "Pathfinder 1e Statblock Library";
  const author = "fadedshadow589";
  const message = "<p>This module includes a feature that allows you to click a button on the provided statblocks and automatically load the text into sbc!</p><>However, this requires you to import the macro contained in the Statblock Macros compendium. Once the macro has been imported, everything should be good to go!</p>";
  const messageEnable = "";
  const disclaimer = "";
  const ending = "Sincerely,";
  const manifest = 'https://raw.githubusercontent.com/Foundry-Workshop/welcome-screen/master/module.json';
  const wsID = 'archetype-welcome-screen';

  let testSetup = async () => {
    let response = {};
    try {
      response = await fetch(SetupConfiguration.setupURL, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({})
      });
    } catch (e) {
      return  false;
    }

    return response.status !== 403;
  };

  let installPrompt = () => {
    if (window.workshopWS.app) return;
    game.settings.register(wsID, 'showPrompt', {scope: "client", config: false, default: true});
    if (!game.settings.get(wsID, 'showPrompt')) return;

    window.workshopWS.app = new Dialog({
        title: `Pathfinder 1e Statblock Library`,
        content: `${message}<p>${ending}<br>fadedshadow589</p><style>#${wsID}-install-prompt button { height: 34px } #${wsID}-install-prompt .dialog-buttons { flex: 0 1 }</style>`,
        buttons: {
          never: {
            label: "Never show again",
            callback: () => {
              game.settings.set(wsID, 'showPrompt', false)
            }
          }
        },
        default: 'never'
      },
      {id: `${wsID}-install-prompt`, width: 420, height: 340});
    window.workshopWS.app.render(true);
  };

  let enablePrompt = () => {
    if (window.workshopWS.app) return;
    game.settings.register(wsID, 'showPrompt', {scope: "client", config: false, default: true});
    if (!game.settings.get(wsID, 'showPrompt')) return;

    window.workshopWS.app = new Dialog({
      title: `Enable Welcome Screen?`,
      content: `<img src="https://avatars3.githubusercontent.com/u/69402909?s=80&v=4" style="float: right; border: none; margin: 6px"/><p>${messageEnable}</p>`,
      buttons: {
        cancel: {
          label: "No"
        },
        never: {
          label: "Never show again",
          callback: () => {
            game.settings.set(wsID, 'showPrompt', false)
          }
        },
        install: {
          label: "Enable",
          callback: () => {
            const settings = game.settings.get("core", ModuleManagement.CONFIG_SETTING);
            const setting = mergeObject(settings, {[wsID]: true});
            game.settings.set("core", ModuleManagement.CONFIG_SETTING, setting);
          }
        }
      },
      default: 'cancel'
    });
    window.workshopWS.app.render(true);
  };

  Hooks.on("init", () => {
    if (window.workshopWS === undefined) {
      window.workshopWS = {
        modules: [module],
        authors: {
          [author]: true
        },
        app: undefined
      };
    } else {
      window.workshopWS.modules.push(module);
      window.workshopWS.authors[author] = true;
    }
  });

  Hooks.on("ready", () => {
    if (!game.user.isGM) return;

    const ws = game.modules.get(wsID);
    if (ws === undefined) {
      installPrompt();
    } else if (!ws.active) {
      enablePrompt();
    }
  });
})();