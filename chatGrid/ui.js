// UI - user interface (class chatUserInterface)
export default class chatUI {
  constructor(l) {
    this.list = l;
  }
  get list() {
    return this._list;
  }
  set list(l) {
    this._list = l;
  }
  // today or not method
  dateToday(d, m, y) {
    let currentTime = new Date();
    let todayD = currentTime.getDate();
    let todayM = currentTime.getMonth() + 1;
    let todayY = currentTime.getFullYear();
    if (d == todayD && m == todayM && y == todayY) {
      return true;
    } else {
      return false;
    }
  }
  // date formater
  formatDate(date) {
    let d = date.getDate();
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    let h = date.getHours();
    let min = date.getMinutes();
    // adding zeros to the front
    let d1 = String(d).padStart(2, "0");
    let m1 = String(m).padStart(2, "0");
    let h1 = String(h).padStart(2, "0");
    let min1 = String(min).padStart(2, "0");
    // formating date or time
    let strDate = `${d1}.${m1}.${y}. - ${h1}:${min1}`;
    let strDate2 = `${h1}:${min1}`;
    if (this.dateToday(d, m, y)) {
      return strDate2;
    } else {
      return strDate;
    }
  }
  // method to create list item template
  templateLI(doc) {
    // date
    let date = doc.created_at.toDate();
    // htmlLi template
    let htmlLI = `<li`;
    if (doc.username == localStorage.username) {
      htmlLI += ` class="me">`;
    } else {
      htmlLI += `>`;
    }

    htmlLI += `<span class="username">${doc.username}</span> 
    <div class="message">${doc.message}</div>
    <div class="date">${this.formatDate(date)}</div>
    <img 
    id="${doc.message}" class="bin ${
      doc.username
    }" width="20px" src="https://icons-for-free.com/iconfiles/png/512/x-1321215629555778185.png" />
    </li>`;

    this.list.innerHTML += htmlLI;
    this.list.scrollTop = this.list.scrollHeight;
  }
  clear() {
    // <ul> becomes empty
    this.list.innerHTML = "";
  }
  changeColor(color) {
    setTimeout(() => {
      let section = document.querySelector("section");
      section.style.background = `${color}`;
    }, 500);
  }
}
