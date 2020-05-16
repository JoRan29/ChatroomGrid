export default class Chatroom {
  constructor(r, u) {
    this.room = r;
    this.username = u;
    this.chats = db.collection("chats");
    this.unsub;
  }
  // get and set
  get room() {
    return this._room;
  }
  set room(r) {
    this._room = r;
  }
  get username() {
    return this._username;
  }
  set username(u) {
    this._username = u;
  }
  // method to change username
  updateUsername(newUsername) {
    if (!newUsername.length) {
      alert("Invalid Username!");
    } else {
      this.username = newUsername;
      console.log("Username has been changed!");
      localStorage.setItem("username", newUsername);
    }
  }
  // method to change room
  updateRoom(newRoom) {
    this.room = newRoom;
    console.log("Room has been changed!");
    if (this.unsub) {
      this.unsub();
    }
  }
  // method for adding msgs
  async addChat(msg) {
    if (!msg.length) {
      alert("Cannot send empty message!");
    } else {
      // date
      let dateTmp = new Date();
      // creating a doc to add to the db
      let chat = {
        message: msg,
        room: this.room,
        username: this.username,
        created_at: firebase.firestore.Timestamp.fromDate(dateTmp),
      };
      //adding chat to the db (this.chats)
      let response = await this.chats.add(chat);
      return response;
    }
  }
  // method to display msg
  getChats(callback) {
    this.unsub = this.chats
      .where("room", "==", this.room)
      .orderBy("created_at")
      .onSnapshot((snap) => {
        snap.docChanges().forEach((change) => {
          if (change.type == "added") {
            // add new msg
            callback(change.doc.data());
          }
        });
      });
  }
  // method to delete msg
  async deleteMsg(msg) {
    // return false;
    this.chats.onSnapshot((s) => {
      s.forEach((doc) => {
        if (doc.data().message == msg) {
          console.log(doc.id);
          var con = confirm(
            "Are you sure you want to permanently remove this item?"
          );
          if (con) {
            this.chats
              .doc(doc.id)
              .delete()
              .then(() => {
                console.log("Message deleted!").catch((err) => {
                  console.error(err);
                });
              });
          }
        }
      });
    });
  }
  // greeting
  greet(div) {
    if (this.username == localStorage.username) {
      div.innerText = `Hello, ${this.username}!`;
    }
  }
}

// !callback function example
// function hello(name) {
//     alert("Hello " + name);
// }
// function enterName(callback) {
//     let name = prompt("Enter your name:");
// callback(name);
// }
// enterName(hello);
