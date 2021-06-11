module.exports = (io, functChat) => (socket) => {
  socket.on("disconnect", async () => {
    const user = await functChat.getUser("", socket.id);
    if (!!user) {
      await functChat.setUserUpdate({ usid: user.usid, active: false });
      upgradeStatusContact(user.usid, false);
    }
  });

  /**
   * @param {*} crednt
   *  @attr {String} usid
   *  @attr {String} name
   */
  socket.on("credentials", async (crednt) => {
    const success = await functChat.credentialsUpgrade(
      crednt.usid,
      socket.id,
      crednt.name
    );
    socket.emit("confirm-access", { success });
    upgradeStatusContact(crednt.usid, true);
  });

  /**
   * @param {String} rmid
   */
  socket.on("join-to-room", async (rmid) => {
    socket.join(rmid);
  });

  /**
   * @param {*} join
   *  @attr {String} rmid
   *  @attr {String} rmname
   *  @attr {String} usid
   */
  socket.on("register-to-room", async (join) => {
    const success = await functChat.registerToRoom(
      join.rmid,
      join.rmname,
      join.usid
    );
    socket.join(join.rmid);
    socket.emit("confirm-register-group", { success });
  });

  /**
   * @param {String} usid
   */
  socket.on("get-talked-and-group", async (usid) => {
    const talkedGroups = await functChat.getTalkedAndGroup(usid);
    socket.emit("upgrade-talked-and-group", talkedGroups);
  });

  /**
   *
   * @param {*} message
   *  @attr {String} usid
   *  @attr {String} rmid
   *  @attr {String} msg
   */
  socket.on("send-group-room", async (message) => {
    const user = await functChat.isUserInRoom(message.usid, message.rmid);
    try {
      if (!!!user) throw new Error();
      const msgSaved = await functChat.insertMessage({
        usid: message.usid,
        rmid: message.rmid,
        group: true,
        to: null,
        parley: null,
        msg: message.msg,
        read: []
      });
      io.sockets.in(message.rmid).emit("recive-group-room", {
        id: msgSaved._id,
        from: message.usid,
        chanel: message.rmid,
        msg: message.msg,
        read: message.read
      });
    } catch (error) {}
  });

  /**
   * @param {*} params
   *  @attr {String} usid
   *  @attr {String} rmid
   */
  socket.on("get-message-group", async (params) => {
    const user = await functChat.isUserInRoom(params.usid, params.rmid);
    try {
      if (!!!user) throw new Error();
      const messages = await functChat.getMessageGroup(params.rmid);
      socket.emit("upgrade-message-group", {
        chanel: params.rmid,
        messages
      });
    } catch (error) {}
  });

  /**
   *
   * @param {*} message
   *  @attr {String} usid
   *  @attr {String} parley
   *  @attr {String} msg
   */
  socket.on("send-message-contact", async (message) => {
    try {
      const talk = await functChat.findUsersFromParley(
        message.parley,
        message.usid
      );
      if (!!!talk) throw new Error("User not exist.");
      const talker = talk[0];
      const msgSaved = await functChat.insertMessage({
        usid: message.usid,
        rmid: null,
        group: false,
        to: talker.usid,
        parley: message.parley,
        msg: message.msg,
        read: []
      });
      const dataSend = {
        id: msgSaved._id,
        from: msgSaved.usid,
        chanel: message.parley,
        msg: msgSaved.msg,
        read: msgSaved.read
      };
      socket.emit("recive-message-contact", dataSend);
      if (talker.active) {
        io.to(talker.sok).emit("recive-message-contact", dataSend);
      }
    } catch (error) {
      console.error("[ERROR]: ", error);
    }
  });

  /**
   *
   * @param {*} params
   *  @attr {String} usid
   *  @attr {String} with
   *  @attr {String} parley
   */
  socket.on("get-message-contact", async (params) => {
    let conversation = null;
    if (!!!params.parley) {
      conversation = await functChat.registerConversation(
        params.usid,
        params.with
      );
    }
    const parley = !!conversation ? conversation._id : params.parley;
    const messages = await functChat.getMessageUserContact(parley);
    socket.emit("upgrade-message-contact", {
      chanel: parley,
      messages
    });
  });

  /**
   * @param {*} params
   *  @attr {String} usid
   *  @attr {String} from
   *  @attr {String} mgid
   */
  socket.on("set-reviewed-message-contact", async (params) => {
    // no se registra para mensajes propios
    if (params.usid === params.from) return;
    const message = await functChat.reviewedMessage(params.usid, params.mgid);
    try {
      if (!!!message) throw new Error("Message no exist.");
      let user = await functChat.getUser(params.from);
      if (!!user && user.active) {
        message.read.push(params.usid);
        io.to(user.sok).emit("upgrade-reviewed-message-contact", message);
      }
    } catch (error) {
      console.error("[ERROR]: ", error);
    }
  });

  /**
   *
   * @param {String} usid
   * @param {Boolean} active
   */
  const upgradeStatusContact = async (usid, active) => {
    const contacts = await functChat.upgradeStatusContact(usid);
    contacts.map((item) =>
      io.to(item.sok).emit("upgrade-status-contact", {
        usid: item.usid,
        active: active
      })
    );
  };
};
