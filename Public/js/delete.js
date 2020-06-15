function darkMode() {
	document.body.classList.toggle("dark-mode");
	if(document.body.classList.contains("dark-mode"))
		localStorage.setItem("darkmode", "true");
	else
		localStorage.setItem("darkmode", "false");
}

window.onload = function(){
	if (typeof(Storage) !== "undefined" && localStorage.getItem("darkmode") == "true") {
		document.body.classList.toggle("dark-mode");
	}
}

document.getElementById("form").addEventListener("submit", async function(e){
    e.preventDefault()
    const obj = {
        username: document.getElementById("user").value,
        mail: document.getElementById("mail").value,
        password: document.getElementById("pass").value
    }
    const res = await fetch("/delete", {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    })
    x = await res.json()
    if(res.status == 200){
        alert(x.res)
        localStorage.clear()
        window.location.href = "index.html";
        return
    }
    alert(x.res)
})