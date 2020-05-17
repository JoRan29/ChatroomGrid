import Chatroom from "./chat.js";
import ChatUI from "./ui.js";

// DOM manipulation
let ulList = document.querySelector("ul");
let formNewMessage = document.querySelector("#formNewMessage");
let formUpdateUsername = document.querySelector("#formUpdateUsername");
let divUpdatedUsername = document.querySelector("#divUpdatedUsername");
let navRooms = document.querySelector("nav");
let colorInput = document.querySelector("#color");
let colorForm = document.querySelector("#formColor");
let navBtns = document.querySelectorAll("nav button");
let dateForm = document.getElementById("formDate");
console.log(dateForm);
let dateStart = document.getElementById("dateStart");
let dateEnd = document.getElementById("dateEnd");
let divGreet = document.getElementById("greeting");
let section = document.querySelector("section");
// get username from local memory
let username = () => {
  if (localStorage.username) {
    return localStorage.username;
  } else {
    return "anon";
  }
};

// selected btn class adding and removing
let selectedBtn = (b) => {
  navBtns.forEach((btn) => {
    btn.classList.remove("btn-selected");
  });
  b.classList.add("btn-selected");
};

// refresh room + return localStorage room value for Chatroom
let room = () => {
  let roomTmp = "general";
  if (localStorage.room) {
    roomTmp = localStorage.room;
  }
  let btnTmp = document.querySelector(`#${roomTmp}`);
  btnTmp.click();
  selectedBtn(btnTmp);
  return roomTmp;
};

// connection between chat.js and ui.js
let cr = new Chatroom(room(), username());
let chatroom = new ChatUI(ulList);

// change room by clicking the btns
navRooms.addEventListener("click", (e) => {
  if (e.target.tagName == "BUTTON") {
    // change room
    let roomTmp = e.target.getAttribute("id");
    cr.updateRoom(roomTmp);
    cr.getChats((chat) => chatroom.templateLI(chat));
    // update room in localStorage
    localStorage.setItem("room", roomTmp);
    // selected class
    selectedBtn(e.target);
    // clear messages from the previous room
    chatroom.clear();
  }
});

// generating li elements with data
cr.getChats((data) => {
  chatroom.templateLI(data);
});

// functions
formNewMessage.addEventListener("submit", (e) => {
  e.preventDefault();
  // DOM
  let input = document.querySelector("#inputMessage");
  cr.addChat(input.value)
    .then(() => {
      // clear form
      formNewMessage.reset();
    })
    .catch((err) => {
      console.log(err);
    });
});

// update username
formUpdateUsername.addEventListener("submit", (e) => {
  e.preventDefault();
  let input = document.querySelector("#inputUsername");
  if (input.value != "") {
    cr.updateUsername(input.value);
    // update Div
    divUpdatedUsername.innerHTML += `Username has been updated to ${input.value}!`;
    setTimeout(() => {
      divUpdatedUsername.innerHTML = "";
    }, 3000);
  } else {
    alert("Invalid username!");
  }
  // greeting
  cr.greet(divGreet);
  // refresh room
  room();

  // clear form
  formUpdateUsername.reset();
});

divGreet.style.userSelect = "none";

if (localStorage.username != "anon" && localStorage.username) {
  divGreet.innerHTML = `Hello, ${localStorage.username}!`;
} else {
  divGreet.innerHTML = `Hello friend!`;
}

// bg-color change
colorForm.addEventListener("submit", (e) => {
  e.preventDefault();
  chatroom.changeColor(colorInput.value);
  localStorage.setItem("color", colorInput.value);
});

if (localStorage.color) {
  section.style.backgroundColor = localStorage.color;
} else {
  section.style.backgroundColor = "white";
}

// top secret
console.log("Super secret data :O");

// delete msg
ulList.addEventListener("click", (e) => {
  if (e.target.tagName == "IMG") {
    let img = e.target;
    if (img.classList.contains(localStorage.username)) {
      cr.deleteMsg(img.id);
      location.reload();
    } else {
      var con = confirm(
        "You cannot delete this message, are you sure you want to remove this item for now?"
      );
      if (con) {
        img.parentElement.remove();
      }
    }
  }
});

//setDate
