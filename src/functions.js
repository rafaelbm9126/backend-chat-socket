module.exports = class ChatFuncs {
  /**
   *
   * @param {*} db
   */
  constructor(db) {
    this.db = db;
  }

  /**
   *
   * @param {String} usid
   * @param {String} sok
   * @param {String} usname
   * @param {Boolean} active
   * @return {Boolean}
   */
  async credentialsUpgrade(usid, sok, usname, active = true) {
    // create/update user
    await this.db.userUpdate({
      usid,
      sok,
      name: usname,
      active
    });
    return true;
  }

  /**
   *
   * @param {String} rmid
   * @param {String} rmname
   * @param {String} usid
   * @return {*} []
   */
  async registerToRoom(rmid, rmname, usid) {
    // create/update room
    await this.db.roomUpdate({
      rmid,
      name: rmname
    });
    // relation user/room
    await this.db.userAndRoomUpdate(usid, rmid);
    return true;
  }

  /**
   *
   * @param {String} usid
   * @param {String} rmid
   * @return {Object}
   */
  async isUserInRoom(usid, rmid) {
    return await this.db.findUserInRoom(usid, rmid);
  }

  /**
   *
   * @param {String} usid
   * @return {Object} []
   */
  async getTalkedAndGroup(usid) {
    let rooms = await this.db.findRoomsFromUser(usid);
    rooms = rooms.map((item) => ({
      id: item.rmid,
      name: item.name,
      group: true
    }));
    let users = await this.db.findConversationFromUser(usid);
    users = users.map((item) => ({
      id: item.usid,
      name: item.name,
      group: false,
      active: item.active,
      parley: item.parley
    }));
    return rooms.concat(users);
  }

  /**
   *
   * @param {*} message
   *  @attr {String} usid
   *  @attr {String} rmid
   *  @attr {Boolean} group
   *  @attr {String} to
   *  @attr {String} parley
   *  @attr {String} msg
   * @return {Object}
   */
  async insertMessage(message) {
    return await this.db.saveMessage(message);
  }

  /**
   *
   * @param {String} rmid
   * @return {Object} []
   */
  async getMessageGroup(rmid) {
    return await this.db.findMessageUserRoom(rmid);
  }

  /**
   *
   * @param {String} usid
   * @param {String} sok
   * @return {Object}
   */
  async getUser(usid, sok = "") {
    return await this.db.findUser(usid, sok);
  }

  /**
   *
   * @param {String} parley
   * @return {Object} []
   */
  async getMessageUserContact(parley) {
    return await this.db.findMessageUserContact(parley);
  }

  /**
   *
   * @param {*} params
   *  @attr {String} usid
   *  @attr {Boolean} active
   * @return {Boolean}
   */
  async setUserUpdate(params) {
    await this.db.userUpdate({
      usid: params.usid,
      active: params.active
    });
    return true;
  }

  /**
   *
   * @param {String} usid
   * @param {String} to
   * @param {String} usid
   * @return {Object}
   */
  async registerConversation(usid, to) {
    // create conversarion one to one
    return await this.db.registerConversation(usid, to);
  }

  /**
   *
   * @param {String} usid
   * @return {Object} []
   */
  async upgradeStatusContact(usid) {
    let users = await this.db.findConversationFromUser(usid);
    users = users.filter((item) => item.active);
    return users;
  }

  /**
   *
   * @param {String} usid
   * @param {String} mgid
   * @return {Object}
   */
  async reviewedMessage(usid, mgid) {
    return await this.db.reviewedMessage(usid, mgid);
  }

  /**
   *
   * @param {String} parley
   * @param {String} exeption
   */
  async findUsersFromParley(parley, exeption = null) {
    let talkers = await this.db.findUsersFromParley(parley);
    if (!!exeption) {
      talkers = [talkers.find((item) => item.usid !== exeption)];
    }
    return talkers;
  }
};
