'use strict';
/**
 * @file User class
 */
let bcrypt = require('bcryptjs');
module.exports = class User{
  constructor(id, password, lastLogin, whitelisted, banned, groups, enter, leave){
    if ((typeof id) === 'object' || (id && password) != null){
      this._id = id._id || id;
      this._password = id._password || bcrypt.hashSync(password, 10);
      this._lastLogin = id._lastLogin || lastLogin || "";
      this._whitelisted = id._whitelisted || whitelisted || false;
      this._banned = id._banned || banned || false;
      this._enter = id._enter || ((enter) ? enter.toString() : null);
      this._leave = id._leave || ((leave) ? leave.toString() : null);
      this._groups = id._groups || groups || [];
      yarp.dbm.register(this);
      this.makeGetterSetter();
    }
  }

  save(){
    yarp.dbm.save(this);
  }

  remove(){
    yarp.dbm.remove(this);
  }

  static config(file){
    let users = require(file);
    for (let id in users){
      let user = users[id];
      if (yarp.users[id]) {
        for (let group in user.groups){
          yarp.users[id].giveGroup(group);
        }
        if (user.enter) {
          yarp.users[id].enter = user.enter.toString();
        }
        if (user.leave) {
          yarp.users[id].leave = user.leave.toString();
        }
      }
    }
  }

  get player(){
    for (let player of mp.players.toArray()) {
      if (player.socialClub == this.id){
        return player;
      }
    }
    return null;
  }

  get characters(){
    let characters = {};
    for (let id in yarp.characters){
      let character = yarp.characters[id];
      if (character.socialClub == this.id){
        characters[id] = character;
      }
    }
    return characters;
  }

  get character(){
    for (let player of mp.players.toArray()) {
      if (player.socialClub == this.id){
        return yarp.characters[player.name];
      }
    }
    return null;
  }

  entered() {
    let player = this.player;
    if (this.enter) {
      (eval(this.enter))(player)
    }
    for (let group of this.groups){
      if (yarp.groups[group].enter){
        let cb = eval(yarp.groups[group].enter);
        cb(player);
        mp.events.call('characterJoinedGroup',player,this,group);
      }
    }
  }

  left() {
    let player = this.player;
    if (this.leave) {
      (eval(this.leave))(player)
    }
    for (let group of this.groups){
      if (yarp.groups[group].leave){
        let cb = eval(yarp.groups[group].leave);
        cb(player);
        mp.events.call('characterLeftGroup',player,this,group);
      }
    }
  }

  updateLastLogin(ip){
    this.lastLogin = `${ip} ${yarp.utils.getTimestamp(new Date())}`;
  }

  verifyPassword(password){
    return bcrypt.compareSync(password, this.password);
  }

  joinedGroup(group){
    if (yarp.groups[group]) {
      let player = this.player;
      if (yarp.groups[group].enter){
        let cb = eval(yarp.groups[group].enter);
        cb(player);
        mp.events.call('userJoinedGroup',player,this,group);
      }
    }
  }

  leftGroup(group){
    if (yarp.groups[group]) {
      let player = this.player;
      if (yarp.groups[group].leave){
        let cb = eval(yarp.groups[group].leave);
        cb(player);
        mp.events.call('userLeftGroup',player,this,group);
      }
    }
  }

  giveGroup(group){
    if (yarp.groups[group]) {
      if (this.groups.indexOf(group) == -1) {
        let type = yarp.groups[group].type;
        if (type){
          let same_type = this.getGroupByType(type);
          if (same_type){
            this.takeGroup(same_type);
          }
        }
        this.groups.push(group);
        this.joinedGroup(group);
        return true;
      }
    }
    return false;
  }

  takeGroup(group){
    if (yarp.groups[group]) {
      if (this.groups.indexOf(group) > -1) {
        this.groups.splice(this.groups.indexOf(group), 1);
        this.leftGroup(group);
        return true;
      }
    }
    return false;
  }

  getGroupByType(type){
    this.groups.forEach(function(id){
      let group = yarp.groups[id];
      if (group != null) {
        if (group.type == type){
          return name;
        }
      }
    });
  }

  getGroupsByTypes(types){
    let groups = [];
    this.groups.forEach(function(id){
      let group = yarp.groups[id];
      if (group != null) {
        if (types.indexOf(group.type) >= 0){
          groups.push(group);
        }
      }
    });
    return groups;
  }

  hasGroup(id){
   return (this.groups.indexOf(id) > -1);
  }

  hasGroups(groups){
    for (let i = 0; i < groups.length; i++){
      if (!this.hasGroup(groups[i])) {
        return false;
      }
    }
    return true;
  }

  hasPermission(permission){
    let result = false;
    let removed = false;
    let readd = false;
    this.groups.forEach(function(id){
      let group = yarp.groups[id];
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
  }

  hasPermissions(permissions){
    for (let i = 0; i < permissions.length; i++){
      if (!this.hasPermission(permissions[i])) {
        return false;
      }
    }
    return true;
  }

  makeGetterSetter(){
    for (let key in this){
      if (key[0] == "_"){
        let gsp = key.slice(1, key.length)
        if (!(gsp in this)){
          Object.defineProperty(this, gsp, {
            get: function () {
              return this[key];
            },
            set: function (value) {
              this[key] = value;
            }
          });
        }
      }
    }
  }
}
