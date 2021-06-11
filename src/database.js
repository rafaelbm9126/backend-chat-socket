const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

module.exports = class DataBChat {
  constructor() {
    this.users = mongoose.model("_user", {
      usid: {
        type: String,
        index: true,
        unique: true
      },
      sok: {
        type: String,
        index: true,
        unique: true
      },
      rmid: String,
      name: String,
      active: Boolean
    });
    this.rooms = mongoose.model("_room", {
      rmid: {
        type: String,
        index: true,
        unique: true
      },
      name: {
        type: String,
        unique: true
      }
    });
    this.userAndRooms = mongoose.model("_user_room", {
      usid: String,
      rmid: String
    });
    this.messages = mongoose.model("_message", {
      usid: String,
      rmid: String,
      group: Boolean,
      to: String,
      parley: String,
      msg: String,
      read: [String]
    });
    this.conversation = mongoose.model("_conversation", {
      a: String,
      b: String
    });
  }

  /**
   *
   * @param {*} objUser
   *  @attr {String} usid
   *  @attr {String} sok
   *  @attr {String} rmid
   *  @attr {String} name
   *  @attr {Boolean} active
   * @return {Object}
   */
  async userUpdate(objUser) {
    await this.users.updateOne(
      {
        usid: objUser.usid
      },
      objUser,
      {
        upsert: true,
        setDefaultsOnInsert: true
      }
    );
    return objUser;
  }

  /**
   *
   * @param {*} objRoom
   *  @attr {String} rmid
   *  @attr {String} name
   *  @attr {Number} integrans
   * @return {Object}
   */
  async roomUpdate(objRoom) {
    await this.rooms.updateOne(
      {
        rmid: objRoom.rmid
      },
      objRoom,
      {
        upsert: true,
        setDefaultsOnInsert: true
      }
    );
    return objRoom;
  }

  /**
   *
   * @param {String} usid
   * @param {String} rmid
   * @return {Object}
   */
  async userAndRoomUpdate(usid, rmid) {
    return await this.userAndRooms.updateOne(
      {
        usid,
        rmid
      },
      { usid, rmid },
      {
        upsert: true,
        setDefaultsOnInsert: true
      }
    );
  }

  /**
   *
   * @param {String} rmid
   * @param {Object} options_1
   * @param {Object} options_2
   * @return {Object} []
   */
  async findUsersFromRoom(rmid, options_1 = {}, options_2 = {}) {
    const inRoom = await this.userAndRooms
      .find({ rmid }, null, options_1)
      .select({ _id: 0, usid: 1 })
      .exec();
    const usids = inRoom.map((item) => item.usid);
    return await this.users
      .find({ usid: { $in: usids } }, null, options_2)
      .select({ _id: 0, usid: 1, name: 1, active: 1 })
      .exec();
  }

  /**
   *
   * @param {String} usid
   * @param {Object} options_1
   * @param {Object} options_2
   * @return {Object} []
   */
  async findRoomsFromUser(usid, options_1 = {}, options_2 = {}) {
    const isInRoom = await this.userAndRooms
      .find({ usid }, null, options_1)
      .select({ _id: 0, rmid: 1 })
      .exec();
    const rmids = isInRoom.map((item) => item.rmid);
    return await this.rooms
      .find({ rmid: { $in: rmids } }, null, options_2)
      .select({ _id: 0, rmid: 1, name: 1 })
      .exec();
  }

  /**
   *
   * @param {String} usid
   * @param {String} rmid
   * @return {Object} []
   */
  async findUserInRoom(usid, rmid) {
    return await this.userAndRooms
      .findOne({ usid, rmid })
      .select({ _id: 0, usid: 1, rmid: 1 })
      .exec();
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
   * @return {Object} []
   */
  async saveMessage(message) {
    return await this.messages.create(message);
  }

  /**
   *
   * @param {String} rmid
   * @param {Object} options
   * @return {Object} []
   */
  async findMessageUserRoom(rmid, options = {}) {
    return await this.messages
      .find({ rmid, group: true }, null, options)
      .select({ _id: 1, usid: 1, rmid: 1, msg: 1, read: 1 })
      .exec();
  }

  /**
   *
   * @param {String} usid
   * @param {String} sok
   * @return {Object} []
   */
  async findUser(usid, sok) {
    return await this.users
      .findOne({ $or: [{ usid }, { sok }] })
      .select({ _id: 0, usid: 1, sok: 1, active: true })
      .exec();
  }

  /**
   *
   * @param {String} parley
   * @param {Object} options
   * @return {Object} []
   */
  async findMessageUserContact(parley, options = {}) {
    return await this.messages
      .find({ parley }, null, options)
      .select({ _id: 1, usid: 1, rmid: 1, parley: 1, msg: 1, read: 1 })
      .exec();
  }

  /**
   *
   * @param {String} a (usid)
   * @param {String} b (usid)
   * @return {String}
   */
  async registerConversation(a, b) {
    return await this.conversation.findOneAndUpdate(
      {
        $or: [
          { a, b },
          { a: b, b: a }
        ]
      },
      { a, b },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        returnOriginal: false
      }
    );
  }

  /**
   *
   * @param {String} usid
   * @param {Object} options_1
   * @param {Object} options_2
   * @return {Object} []
   */
  async findConversationFromUser(usid, options_1 = {}, options_2 = {}) {
    const isInConversation = await this.conversation
      .find({ $or: [{ a: usid }, { b: usid }] }, null, options_1)
      .select({ _id: 1, a: 1, b: 1 })
      .exec();
    const items = isInConversation.map((item) =>
      item.a === usid ? item.b : item.a
    );
    const users = await this.users
      .find({ usid: { $in: items } }, null, options_2)
      .select({ _id: 0, usid: 1, sok: 1, name: 1, active: 1 })
      .exec();
    return users.map((item, index) => {
      return {
        usid: item.usid,
        sok: item.sok,
        name: item.name,
        active: item.active,
        parley: isInConversation[index]._id
      };
    });
  }

  /**
   *
   * @param {String} usid
   * @param {String} mgid
   * @return {Object}
   */
  async reviewedMessage(usid, mgid) {
    return await this.messages.findOneAndUpdate(
      { _id: mgid },
      { $addToSet: { read: usid } }
    );
  }

  /**
   *
   * @param {String} parley
   */
  async findUsersFromParley(parley) {
    const talk = await this.conversation.findById(parley).exec();
    return await this.users
      .find({
        $or: [{ usid: talk.a }, { usid: talk.b }]
      })
      .exec();
  }
};
