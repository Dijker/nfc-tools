'use strict';

const Homey = require('homey');

class MyApp extends Homey.App {

  onInit() {

    Homey.ManagerNFC.on('tag', (data) => {
      const cards = Homey.ManagerSettings.get("cards") || [];
      const uid = data.uid;
      const card = cards.find(card => card.uid === uid);

      if (uid.startsWith('08')) {
        // Do nothing (https://stackoverflow.com/a/9800750)
        return
      }

      if (card) {
        this.play(card);
        card.blips++;
        cards.sort((a, b) => b.blips - a.blips);
      } else {
        cards.push({
          uid,
          value: "",
          blips: 0,
          lastUsed: 0
        });
      }

      Homey.ManagerSettings.set("cards", cards);
      Homey.ManagerApi.realtime('cards', cards);

    });
  }

  play(card) {
    this.log(card)

    let nfcStarter = new Homey.FlowCardTrigger('nfc_touched');

    let tokens = {
      'url': card.value
    }

    nfcStarter
      .register()
      .trigger(tokens)
      .catch(this.error)
      .then(this.log)

  }
}

module.exports = MyApp;
