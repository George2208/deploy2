function darkMode() {
	document.body.classList.toggle("dark-mode");
	if(document.body.classList.contains("dark-mode"))
		localStorage.setItem("darkmode", "true");
	else
		localStorage.setItem("darkmode", "false");
}

window.onload = function(){

	document.onclick = function(e){
		if((e.target.closest("#loginwindow") == null && e.target.closest("#loginbutton") == null) || e.target.id == "closeloginwindow"){
			document.getElementById("loginwindow").style.display = "none";
	}};

	if (typeof(Storage) !== "undefined") {
		if(localStorage.getItem("username") !== null && localStorage.getItem("username") !== "" && localStorage.getItem("username") !== "null"){
			document.getElementById("username").value = document.getElementById("username").defaultValue = localStorage.getItem("username");
			document.getElementById("rememberme").checked = true;
		}
		document.getElementById("submitbutton").addEventListener("click", function(){
			if(document.getElementById("rememberme").checked == true && document.getElementById("username").value !== ""){
				localStorage.setItem("username", document.getElementById("username").value);
			}
			else{
				localStorage.setItem("username", "");
			}
		});
	}
	else {
		let elem = document.getElementById("remembermediv");
		elem.parentNode.removeChild(elem);
	}

	if (typeof(Storage) !== "undefined" && localStorage.getItem("darkmode") == "true") {
		document.body.classList.add("dark-mode");
	}
}