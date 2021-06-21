(() => {
  const module = "Pathfinder 1e Statblock Library";
  const author = "fadedshadow589";
  const message = "<>This module includes a feature that allows you to click a button on the provided statblocks and automatically load the text into sbc!</p>";
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

// Add sbc import button on journals
  Hooks.on('renderJournalSheet', () => {
    $('#importStatblock').prop('disabled', false);
  
    $('#importStatblock').click(function (event) {
      event.stopPropagation();
      event.preventDefault();
      importStatblock(event);
    });
  })
  
  let importStatblock = async function(event) {
    if (game.modules.get('pf1-statblock-converter').active) {
      const wait = async (ms) => new Promise((resolve)=> setTimeout(resolve, ms));
  
      let inputText = event.target.innerText;
      let sectionId = inputText.replace(/Import (.*) with SBC/gm, `$1`);
      
      sectionId = sectionId.replace(/[^a-zA-Z0-9_]/gm, '');
      
      window.$('#startSBCButton')[0].click();
      
      let formInput = window.$(`#${sectionId}`)[0].innerText;
      
      await wait(250);
      
      window.$('#sbcInput')[0].value = formInput;
      window.$('#sbcInput').keyup();
    }
    else {
      ui.notifications.warn('Please install and enable "sbc | PF1 Statblock Converter" to import this statblock');
    }
  }