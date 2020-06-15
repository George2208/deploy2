function darkMode() {
	document.body.classList.toggle("dark-mode");
	if(document.body.classList.contains("dark-mode"))
		localStorage.setItem("darkmode", "true");
	else
		localStorage.setItem("darkmode", "false");
}

window.onload = function(){
	if (typeof(Storage) !== "undefined" && localStorage.getItem("darkmode") == "true") {
		document.body.classList.add("dark-mode");
	}
}

document.getElementById("form").addEventListener("submit", async function(e){
    e.preventDefault()
    var checkbox = document.getElementsByName('chb')
    var checkboxVect = []
    for(var i = 0; i < checkbox.length; i++)
        if(checkbox[i].checked)
            checkboxVect.push(checkbox[i].value)
    const obj = {
        username: document.getElementById("user").value,
        password: document.getElementById("pass").value,
        mail: document.getElementById("mail").value,
        option: document.getElementById("opt").value,
        checkbox: checkboxVect,
        points: document.getElementById("points").value
    }
    const res = await fetch("/update", {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    })
    ress = await res.json()
    alert(ress.res)
    if(res.status == 200)
        window.location.href = "index.html";
})