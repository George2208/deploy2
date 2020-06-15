function darkMode() {
	document.body.classList.toggle("dark-mode");
	if(document.body.classList.contains("dark-mode"))
		localStorage.setItem("darkmode", "true");
	else
		localStorage.setItem("darkmode", "false");
}

if (typeof(Storage) !== "undefined" && localStorage.getItem("darkmode") == "true") {
	document.body.classList.add("dark-mode");
}

async function load(){
	const req = {
	  	user: localStorage.getItem("username"),
	  	pass: localStorage.getItem("password")
  	}
  	const res = await fetch("/userspage", {
	  	method: "POST",
	  	headers: {'Content-Type': 'application/json'},
	  	body: JSON.stringify(req)
  	})
  	if(res.status==200){
		users = await res.json()
		console.log(users)
		users.forEach(element => {
			document.getElementById("table").insertAdjacentHTML("beforeend", `
				<tr>
					<td>${element.username}</td>
					<td>${element.firstName}</td>
					<td>${element.lastName}</td>
					<td>${element.type}</td>
				</tr>`)
		});
	  	return
  	}
  	window.location.href = "index.html"
}load()