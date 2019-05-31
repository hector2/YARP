'use strict';

let config = {
  'code': {
    category: 'superadmin',
    hint: 'Write code to be executed from inside the game. A very powerful command.',
    permissions: ['cmd.code'],
    call: (player, args) => {
      yarp.client.createBrowser(player, 'editor', ['package://YARP/ui/html/editor.html', 'setupCodeEditor'], true, false);
      yarp.hotkeys['ToggleChat'].bind(player);
    },
  },
  'givegroup': {
    category: 'superadmin',
    hint: 'Give a group to an user or character.',
    permissions: ['cmd.givegroup'],
    call: (player, args) => {
      args = yarp.utils.server.getSubstrings(args.join(' '), '\'');
      let user = yarp.users[args[0]];
      let character = yarp.characters[args[0]];
      let group = yarp.groups[args[1]];
      if (group) {
        if (user) {
          user.giveGroup(group.id);
          user.save();
        } else if (character) {
          character.giveGroup(group.id);
          character.save();
        }
      }
    },
  },
  'takegroup': {
    category: 'superadmin',
    hint: 'Take a group from an user or character.',
    permissions: ['cmd.takegroup'],
    call: (player, args) => {
      args = yarp.utils.server.getSubstrings(args.join(' '), '\'');
      let user = yarp.users[args[0]];
      let character = yarp.characters[args[0]];
      let group = yarp.groups[args[1]];
      if (group) {
        if (user) {
          user.takeGroup(group.id);
          user.save();
        } else if (character) {
          character.takeGroup(group.id);
          character.save();
        }
      }
    },
  },
  'creator': {
    category: 'admin',
    hint: 'Opens the character creator.',
    permissions: ['cmd.creator'],
    call: (player, args) => {
      const freemodeCharacters = [mp.joaat('mp_m_freemode_01'), mp.joaat('mp_f_freemode_01')];
      if (freemodeCharacters.indexOf(player.model) == -1) {
        player.outputChatBox('/creator command is restricted to freemode characters.');
      } else if (player.vehicle) {
        player.outputChatBox('You can\'t use this command inside a vehicle.');
      } else {
        if (player.usingCreator) {
          player.sendToWorld();
        } else {
          player.sendToCreator();
        }
      }
    },
  },
  'tick': {
    category: 'admin',
    hint: 'Show the server tick.',
    permissions: ['cmd.tick'],
    call: (player, args) => {
      player.outputChatBox(`Tick: ${yarp.tick}`);
    },
  },
  'kill': {
    category: 'admin',
    hint: 'Kill yourself.',
    permissions: ['cmd.kill'],
    call: (player, args) => {
      player.health = 0;
    },
  },
  'givemoney': {
    category: 'admin',
    hint: 'Give yourself money.',
    permissions: ['cmd.givemoney'],
    call: (player, args) => {
      player.character.wallet += Number(args[0]);
      player.notify('Received ~g~$' + args[0]);
    },
  },
  'hp': {
    category: 'admin',
    hint: 'Regenerates player health.',
    permissions: ['cmd.hp'],
    call: (player, args) => {
      player.health = 100;
    },
  },
  'armour': {
    category: 'admin',
    hint: 'Regenerates player armour.',
    permissions: ['cmd.armour'],
    call: (player, args) => {
      player.armour = 100;
    },
  },
  'weapon': {
    category: 'admin',
    hint: 'Gives specified weapon and ammo.',
    permissions: ['cmd.weapon'],
    call: (player, args) => {
      let ammo = Number(args[1]) || 10000;
      let id = 'weapon_'+args[0];
      player.character.giveWeapon(yarp.weapons[id.toUpperCase()], ammo);
      player.character.save();
    },
  },
  'veh': {
    category: 'admin',
    hint: 'Spawns specified vehicle model.',
    permissions: ['cmd.veh'],
    call: (player, args) => {
      let veh = mp.vehicles.new(mp.joaat(args[0]), player.position);
      player.putIntoVehicle(veh, -1);
    },
  },
  'noclip': {
    category: 'admin',
    hint: 'Toggle No-clip.',
    permissions: ['cmd.noclip'],
    call: (player, args) => {
      yarp.client.toggleNoclip(player);
    },
  },
  'charpos': {
    category: 'admin',
    hint: 'Toggle character position display.',
    permissions: ['cmd.charpos'],
    call: (player, args) => {
      yarp.client.toggleCharpos(player);
    },
  },
  'camdir': {
    category: 'admin',
    hint: 'Toggle camera direction display.',
    permissions: ['cmd.camdir'],
    call: (player, args) => {
      yarp.client.toggleCamdir(player);
    },
  },
  'gmtp': {
    category: 'admin',
    hint: 'Teleport to specified gamemode object.',
    permissions: ['cmd.gmtp'],
    call: (player, args) => {
      args = yarp.utils.server.getSubstrings(args.join(' '), '\'');
      let Class = args[0];
      let id = args[1];
      if (yarp[Class]) {
        let collection = Class.toLowerCase()+'s';
        let obj = yarp[collection][id];
        player.position = obj.position;
      }
    },
  },
  'tp': {
    category: 'admin',
    hint: 'Teleport to specified position.',
    permissions: ['cmd.tp'],
    call: (player, args) => {
      // Sanitize arguments
      args[0] = args[0].replace(/,/g, '').replace(/}/g, '');
      args[1] = args[1].replace(/,/g, '').replace(/}/g, '');
      args[2] = args[2].replace(/,/g, '').replace(/}/g, '');
      player.position = new mp.Vector3(Number(args[0]), Number(args[1]), Number(args[2]));
    },
  },
  'inventory': {
    category: 'user',
    hint: 'Open your inventory.',
    permissions: ['cmd.inventory'],
    call: (player, args) => {
      player.character.toggleInventory();
    },
  },
  'money': {
    category: 'user',
    hint: 'Show your wallet and bank.',
    permissions: ['cmd.money'],
    call: (player, args) => {
      player.outputChatBox(`Wallet: !{51, 204, 51}${player.character.wallet}`);
      player.outputChatBox(`Bank: !{0, 153, 255}${player.character.bank}`);
    },
  },

  'goku': {
    category: 'user',
    hint: 'El bueno de Goku',
    permissions: ['cmd.nuevos'],
    call: (player, args) => {

      //limpiar colshapes y markers
      mp.colshapes.forEach((x) => {
        if (x.getVariable("goku")) x.destroy()
      })

      mp.markers.forEach((x) => {
        if (x.getVariable("goku")) x.destroy()
      })
      
      player.giveWeapon(0xFBAB5776, 2) // Parachute

      let max = 1000
      let min = -1000

      let x = Math.random() * (max - min) + min;
      let y = Math.random() * (max - min) + min;
      let z = 3500

      let xx = x
      let yy = y
      let zz = z

      min = -10
      max = +10

      while (zz > 2000) {
        zz = zz - 100
        xx = xx + (Math.random() * (max - min) + min);
        yy = yy + (Math.random() * (max - min) + min);

        let col = mp.colshapes.newSphere(xx, yy, zz, 10);
        let mark = mp.markers.new(27, new mp.Vector3(xx, yy, zz), 20, { color: [255, 10, 10, 100], visible: true })

        col.setVariable("goku",true)
        mark.setVariable("goku",true)


        //cada vez mas randoms
        min = min - 2.5
        max = max + 2.5
      }

      zz = zz -300

      let collshapeFinish = mp.colshapes.newSphere(xx, yy, zz, 50);
      let markerFinish = mp.markers.new(27, new mp.Vector3(xx, yy, zz), 100, { color: [63, 191, 63, 100], visible: true })

      collshapeFinish.setVariable("goku", true)
      collshapeFinish.setVariable("finish",true)
      markerFinish.setVariable("goku",true)


      //pelo
      player.setClothes(2, 11, 0, 0)
      player.setHairColor(15, 15)

      //pantalones
      player.setClothes(4,19,0,2)

      //camiseta
      player.setClothes(11,40,0,2)

      //camiseta debajo
      player.setClothes(8,54,0,2)

      //brazos
      player.setClothes(3,2,0,2)

      //zapatos
      player.setClothes(6,15,0,2)


      player.spawn(new mp.Vector3(x, y, z))

      let id = player.character.socialClub
      let found = false
      yarp.scores.forEach((x) => {

        if (x.id === id) {
          found = true
          player.outputChatBox(`!{255, 0, 0}PUNTUACIÓN MÁXIMA:${x.score}`)
        }
      })

      if (!found) {
        player.outputChatBox(`!{255, 0, 0}Consigue la mayor puntuación posible`)
      }
    },
  },

  '?': {
    category: 'user',
    hint: 'Lists existing commands for each category.',
    permissions: ['cmd.hint'],
    call: (player, args) => {
      if (!args[0]) {
        player.outputChatBox(`!{yellow}HINT!{white}: ${Object.keys(yarp.commands.categories).join(', ')}`);
      } else {
        let category = yarp.commands.categories[args[0]];
        if (category) {
          player.outputChatBox(`!{yellow}HINT!{white}: ${Object.keys(category).join(', ')}`);
        } else {
          let command = yarp.commands[args[0]];
          if (command) {
            player.outputChatBox(`!{yellow}HINT!{white}: ${command.hint}`);
          }
        }
      }
    },
  },
};

module.exports = config;
