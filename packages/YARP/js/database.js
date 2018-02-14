
var db = require('diskdb');
var bcrypt = require('bcryptjs');
var utils = require(`./utils.js`);
var cfg = require('./config.js');

db.connect('./packages/YARP/_db');
db.loadCollections(['users','groups','characters']);
exports.db = db;

exports.USERS = {};
exports.GROUPS = {};
exports.CHARACTERS = {};

//Users DB Interaction
exports.USERS.getUserByPlayer = function(player){
  var user = db.users.findOne({social_club : player.socialClub});
  return user;
};

exports.USERS.verifyAuthentication = function(player, password){
  var user = db.users.findOne({social_club : player.socialClub});
  var last_login = {
    ip : player.ip,
    date : utils.FUNCTIONS.getFormattedDate()
  }
  if (user == null) {
    var hash = bcrypt.hashSync(password, 10);
    user = {
      id : db.users.count()+1,
      social_club : player.socialClub,
      password : hash,
      last_login : last_login,
      whitelisted : false,
      banned : false,
      groups : ["user"],
      active : false
    };
    db.users.save(user);
  } else {
    if(bcrypt.compareSync(password, user.password)){
      db.users.update(user, {last_login : last_login}, {multi: false, upsert: false});
    } else {
      user = null;
    }
  }
  return user;
};

exports.USERS.getPlayerActiveCharacter = function(player){
  var user = db.users.findOne({social_club : player.socialClub});
  var character = db.characters.findOne({name: user.active});
  return character;
};

exports.USERS.activatePlayerCharacter = function(player, character){
  var user = db.users.findOne({social_club : player.socialClub});
  var last_login = {
    ip : player.ip,
    date : utils.FUNCTIONS.getFormattedDate()
  }
  db.characters.update({name : character.name}, {last_login : last_login}, {multi: false, upsert: false});
  db.users.update(user, {active : character.name}, {multi: false, upsert: false});
  return user;
};

//Characters DB Interaction
exports.CHARACTERS.createCharacter = function(player, name, age, sex, jface){
  var character = db.characters.findOne({name : name});
  if(character == null){
    var last_login = {
      ip : player.ip,
      date : utils.FUNCTIONS.getFormattedDate()
    }
    character = {
      id : db.characters.count()+1,
      social_club : player.socialClub,
      last_login : last_login,
      groups : ["user"],
      job : "Citizen",
      name : name,
      age : age,
      model : sex,
      wallet : cfg.swallet,
      bank : cfg.sbank,
      registration : utils.FUNCTIONS.generateRegistration(),
      face : JSON.parse(jface),
      health : 100,
      armour : 0,
      position : { "x" : -888.8746, "y" : -2313.2836, "z" : -3.5077, "h" : 90 },
      weapons : {},
      inventory : {},
      customization : {},
      decoration : {},
      clothes : {}
    };
    db.characters.save(character);
    return db.characters.find({social_club : player.socialClub});
  } else {
    return null;
  }
};

exports.CHARACTERS.getUserByRegistration = function(reg){
  var character = db.characters.findOne({registration: reg});
  if(character != null){
    var user = db.users.findOne({social_club : character.social_club});
    return user;
  } else {
    return null;
  }
};

exports.CHARACTERS.getPlayerCharacters = function(player){
  var characters = db.characters.find({social_club : player.socialClub});
  return characters;
};

//Groups DB Interaction
exports.GROUPS.addGroup = function(name){
  var group = db.groups.findOne({name : name});
  if (group == null){
    group = {
      name : name,
      permissions : []
    }
    db.groups.save(group);
    return true;
  }
  return false;
};

exports.GROUPS.addPermission = function(name,permission){
  var group = db.groups.findOne({name : name});
  if (group == null){
    group = {
      name : name,
      permissions : [permission]
    }
  } else if (group.permissions.indexOf(permission) > -1) {
    return false;
  } else {
    group.permissions.push(permission);
  }
  db.groups.update({name : name}, group, {multi: false, upsert: true});
  return true;
};

exports.GROUPS.removeGroup = function(name){
  var group = db.groups.findOne({name : name});
  if (group == null){
    return false;
  } else {
    db.groups.remove({name : name});
    return true;
  }
};

exports.GROUPS.removePermission = function(name,permission){
  var group = db.groups.findOne({name : name});
  if (group == null){
    return false;
  } else if (group.permissions.indexOf(permission) < 0){
    return false;
  } else {
    db.groups.update({name : name}, {permissions : group.permissions.filter(e => e !== permission)}, {multi: false, upsert: false});
    return true;
  }
};

exports.GROUPS.takeGroup = function(userid,group){
  var user = db.users.findOne({id : parseInt(userid)});
  if (user == null){
    return false;
  } else {
    db.users.update(user, {groups : user.groups.filter(e => e !== group)}, {multi: false, upsert: false});
    return true;
  }
};

exports.GROUPS.giveGroup = function(userid,group){
  var user = db.users.findOne({id : parseInt(userid)});
  if (user == null){
    return false;
  } else {
    user.groups.push(group);
    db.users.update(user, {groups : user.groups}, {multi: false, upsert: false});
    return true;
  }
};

exports.GROUPS.hasPermission = function(player,permission){
  var user = db.users.findOne({social_club : player.socialClub});
  var result = false;
  var removed = false;
  var readd = false;
  user.groups.forEach(function(g){
    var group = db.groups.findOne({name : g});
    if (group != null) {
      if (group.permissions.indexOf("*") > -1){
        result = true;
      }
      if (group.permissions.indexOf(permission) > -1){
        result = true;
      }
      if (group.permissions.indexOf(`-${permission}`) > -1){
        removed = true;
      }
      if (group.permissions.indexOf(`+${permission}`) > -1){
        readd = true;
      }
    }
  });
  if (removed && !readd){
    result = false;
  }
  return result;
};
