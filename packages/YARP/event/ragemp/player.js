mp.events.add('playerChat', (player, message) => {
  console.log(`${player.name}: ${message}`);
	mp.players.broadcast(`${player.name}: ${message}`);
});

mp.events.add('playerCommand', (player, command) => {
	const args = command.split(/[ ]+/);
	const commandName = args.splice(0, 1)[0];
  command = yarp.commands[commandName];

	if (command) {
    let cb = eval(command.cb);
    cb(player,args);
	} else {
    player.outputChatBox("!{yellow}HINT!{white}: Command doesn't exist.");
  }
});

mp.events.add("playerDamage", (player, healthLoss, armorLoss) => {
});

mp.events.add('playerDeath', (player) => {
    let character = yarp.characters[player.name];
    character.weapons = {};
    character.save();
    player.call('removeWeapons');
    player.removeAllWeapons();
    player.spawn(yarp.variables.spawn.value[Math.floor(Math.random() * yarp.variables.spawn.value.length)]);
    player.health = 100;
});

mp.events.add('playerJoin', (player) => {
  player.name = player.socialClub;
  console.log(`${player.name}(${player.socialClub}/${player.ip}) joined.`);
  player.call('yarp_setWorldTime', [JSON.stringify({h:mp.world.time.hour, m:mp.world.time.minute, s:mp.world.time.second})]);
  let user = yarp.users[player.socialClub]
  if(user != null){
    if (user.banned) {
      player.outputChatBox("!{red}You have been banned.");
      console.log(`${player.socialClub} is banned.`);
      setTimeout(function(){
        player.kick("You have been banned.");
      },1000);
    } else if (yarp.variables.whitelist.value && !user.whitelisted) {
      player.outputChatBox("!{yellow}You are not whitelisted.");
      console.log(`${player.socialClub} is not whitelisted.`);
      setTimeout(function(){
        player.kick("You are not whitelisted.");
      },1000);
    }
    else {
      player.call('yarp_showLoginMenu');
    }
  } else {
    player.call('yarp_showRegistrationMenu', [player.socialClub]);
  }
});

mp.events.add('playerQuit', (player, exitType, reason) => {
  yarp.users[player.socialClub].leftGroup();
  yarp.characters[player.name].leftGroup();
  if (exitType != "kicked") {
    var str = `${player.name}(${player.socialClub}/${player.ip}) quit. (${exitType})`;
  } else {
    var str = `${player.name}(${player.socialClub}/${player.ip}) kicked. Reason: ${reason} (${exitType})`;
  }
  console.log(str);
});

mp.events.add("playerReady", player => {
});

mp.events.add("playerSpawn", player => {
});

mp.events.add("playerWeaponChange", (player, oldWeapon, newWeapon) => {
});