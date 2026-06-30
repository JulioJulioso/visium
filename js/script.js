function logueado(e) {
  e.preventDefault();

  const user = document.getElementById("medico").value
  const clave = document.getElementById("password").value

  if(user === "prueba1@gmail.com" && clave === "prueba123"){
    window.location="dashboard.html";
  }else{
     alert("Datos incorrectos")
  }
}