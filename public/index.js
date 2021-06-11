(function () {
  let socket = io();
  let isGroup = false;
  let chatWith = null;
  let initLoad = true;
  let openConfigs = false;
  let credentials = null;

  socket.on("connect", () => {
    let toCredentials = localStorage.getItem("credentials");
    // proceso de reconecion
    if (!!toCredentials) {
      credentials = JSON.parse(toCredentials);
      login_connect(credentials);
    }
  });

  socket.on("disconnect", () => {
    let toCredentials = localStorage.getItem("credentials");
    // proceso de reconecion
    if (!!toCredentials) {
      credentials = JSON.parse(toCredentials);
      login_connect(credentials);
    }
  });

  $(".btn-connect").on("click", () => {
    credentials = {
      usid: $("#id-user").val(),
      name: $("#name-user").val()
    };
    login_connect(credentials);
    localStorage.setItem("credentials", JSON.stringify(credentials));
  });

  socket.on("confirm-access", function ({ success }) {
    if (success) {
      console.log("Welcome.!");
      // carga grupos y chats
      socket.emit("get-talked-and-group", credentials.usid);
    }
  });

  $(".btn-connect-to-room").on("click", () => {
    socket.emit("register-to-room", {
      rmid: $("#id-room").val(),
      rmname: $("#name-room").val(),
      usid: credentials.usid
    });
  });

  socket.on("confirm-register-to-room", function ({ success }) {
    if (success) {
      console.log("Join.!");
      // carga grupos y chats
      socket.emit("get-talked-and-group", credentials.usid);
    }
  });

  socket.on("upgrade-talked-and-group", (roomUsers) => {
    if (initLoad) {
      // reinscripcion a los grupos
      $.each(roomUsers, (i) => {
        socket.emit("join-to-room", roomUsers[i].id);
      });
      initLoad = false;
    }
    create_contacts(roomUsers);
  });

  // selecciona contactos o grupos
  $("ul#integrants").on("click", "li.integrant", function () {
    isGroup = $(this).attr("data-group") === "y";
    chatWith = isGroup ? $(this).attr("id") : $(this).attr("data-parley");
    select_to_chat(chatWith, isGroup);
    if (isGroup) {
      // pide chat del grupo
      socket.emit("get-message-group", {
        usid: credentials.usid,
        rmid: chatWith
      });
    } else {
      // pide chats previos
      socket.emit("get-message-contact", {
        usid: credentials.usid,
        with: null,
        parley: chatWith
      });
    }
  });

  // selecciona solo contactos desde la bandeja
  $("ul#message-list").on("click", "li", function () {
    chatWith = $(this).attr("data-parley");
    isGroup = false;
    select_to_chat(chatWith, isGroup);
    // pide chats previos
    socket.emit("get-message-contact", {
      usid: credentials.usid,
      with: chatWith,
      parley: null
    });
    // actualiza la lista de los contactos y grupos
    socket.emit("get-talked-and-group", credentials.usid);
  });

  // restablece los mensajes del grupo
  socket.on("upgrade-message-group", restore_messages);

  // restablece los mensajes de un contacto
  socket.on("upgrade-message-contact", restore_messages);

  $("#send-msg").on("click", () => {
    let msg = $("#message-to-send").val();
    if (isGroup) {
      socket.emit("send-group-room", {
        usid: credentials.usid,
        rmid: chatWith,
        msg
      });
    } else {
      socket.emit("send-message-contact", {
        usid: credentials.usid,
        parley: chatWith,
        msg
      });
    }
    $("#message-to-send").val("");
  });

  // recibe los mensajes de los grupos
  socket.on("recive-group-room", (message) =>
    create_message(message, message.chanel)
  );

  // recibe los mensajes de los contactos
  socket.on("recive-message-contact", (message) =>
    create_message(message, message.chanel)
  );

  // recibe actualizacion de un cambio de estado en un contacto
  socket.on("upgrade-status-contact", (status) => {
    // si se tiene un store centralizado se puede actualizar
    // contacto por contacto sin pedir la lista de nuevo
    socket.emit("get-talked-and-group", credentials.usid);
  });

  // recibe el mensaje leido por otro
  socket.on("upgrade-reviewed-message-contact", (message) => {
    $("#msg-" + message._id).addClass("active");
  });

  $(".expand").click(function () {
    openConfigs = !openConfigs;
    $(this).html(openConfigs ? "&#8592;" : "&#8594;");
    if (openConfigs) {
      $(".credentials").addClass("active");
    } else {
      $(".credentials").removeClass("active");
    }
  });

  function create_contacts(roomUsers) {
    let cList = $("ul#integrants");
    cList.html(null);
    $.each(roomUsers, (i) => {
      if (roomUsers[i].usid !== credentials.usid) {
        $("<li/>")
          .attr("id", roomUsers[i].id)
          .attr("data-parley", roomUsers[i].parley)
          .attr("data-group", roomUsers[i].group ? "y" : "n")
          .addClass("integrant")
          .addClass("clearfix")
          .html(
            `
              <div class="about">
              <div class="name">${roomUsers[i].name}</div>
                <div class="status">
                  ${
                    roomUsers[i].group
                      ? "<span class='group'>Group</span>"
                      : roomUsers[i].active
                      ? "<span class='online'>online</span>"
                      : "<span class='offline'>offline</span>"
                  }
                </div>
              </div>
            `
          )
          .appendTo(cList);
      }
    });
  }

  function create_message(message, chanel) {
    console.log(chatWith, chanel);

    if (chatWith !== chanel) {
      show_message(
        `Message from <b>${message.from}</b> ${
          chanel !== message.from ? ` in <b>${chanel}</b>` : ""
        }`
      );
      return;
    }
    let isRead = message.read.indexOf(credentials.usid) > -1;
    if (!isRead) {
      socket.emit("set-reviewed-message-contact", {
        usid: credentials.usid,
        from: message.from,
        mgid: message.id
      });
    }
    let item = document.createElement("li");
    item.setAttribute("data-id", message.id);
    if (message.from !== credentials.usid) {
      item.className = "clearfix";
      item.setAttribute("id", message.from);
      item.innerHTML = `
        <div class="message other-message float-right">
          <div><b class="contact-id">${message.from}</b></div>
          ${message.msg}
        </div>
      `;
    } else {
      item.innerHTML = `
        <div class="message my-message">
          <div><b>You</b></div>
          ${message.msg}
          ${
            !isGroup
              ? `<div id="msg-${message.id}" class="status-read ${
                  message.read.indexOf(chatWith) > -1 ? "active" : ""
                }"></div>`
              : ""
          }
        </div>
      `;
    }
    document.querySelector("ul#message-list").appendChild(item);
  }

  function restore_messages({ chanel, messages }) {
    document.querySelector("ul#message-list").innerHTML = null;
    messages.map((item) =>
      create_message(
        { id: item._id, from: item.usid, msg: item.msg, read: item.read },
        chanel
      )
    );
  }

  function select_to_chat(id, isGroup) {
    $(".chat-with").text(`Chat With ${id} ${isGroup ? " (goup)" : ""}`);
    $("#send-msg, #message-to-send").removeAttr("disabled");
  }

  function show_message(message) {
    let alert = $(".alert");
    alert.find("span").html(message);
    alert.addClass("active");
    setTimeout(() => {
      alert.removeClass("active");
    }, 10000);
  }

  function login_connect(credentials) {
    socket.emit("credentials", credentials);
    $(".user-name-text").text(credentials.name);
  }
})();
