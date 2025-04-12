Login.addEventListener("click", () => {
  let user_name = document.querySelector('.js-user_input').value;
  let user_pass = document.querySelector('.js-user_pass').value;

  fetch('http://localhost:5000/save_login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: user_name,
      password: user_pass
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.href = "Home_Page.html";
    } else {
      alert(data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
