let Def_userName = "ABCD";

let Def_pass = "1234";


let Login = document.querySelector('.Login_butt');



Login.addEventListener("click", () => {

  alert("Done");
  let user_name = document.querySelector('.js-user_input').value;
  let user_pass = document.querySelector('.js-user_pass').value;

  if (user_name === Def_userName) {
    if (user_pass === Def_pass) {
      window.location.href = "Home_Page.html";
    } else {
      alert("Incorrect Password!");
    }
  } else {
    alert("User Not Found!");
  }
});
