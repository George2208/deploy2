async function autologin(){
  	const req = {
		user: localStorage.getItem("username"),
		pass: localStorage.getItem("password")
	}
	const res = await fetch("/autologin", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(req)
	})
	if(res.status==200){
        console.log("Logged in as "+req.user)
        document.getElementById("loginout").innerHTML = "Log out"
        try {
            document.getElementById("registrationbutton").style.pointerEvents = "none"
            document.querySelector("#registrationbutton p").innerHTML = req.user
        } catch(err) {}
        return
    }
    console.log("Not logged")
    localStorage.removeItem("username")
    localStorage.removeItem("password")
}autologin()

document.getElementById("loginbutton").addEventListener("click", function() {
    if(localStorage.getItem("username") && localStorage.getItem("password")){
        document.getElementById("loginout").innerHTML = "Log in"
        try {
            document.getElementById("registrationbutton").style.pointerEvents = "all"
            document.querySelector("#registrationbutton p").innerHTML = "Registration"
        } catch(err) {}
        console.log("logout")
        localStorage.removeItem("username")
        localStorage.removeItem("password")
    }
    else{
        document.getElementById("loginwindow").style.display = "block";
        document.getElementById("loginwindow").classList.remove("run-animation");
        void document.getElementById("loginwindow").offsetWidth;
        document.getElementById("loginwindow").classList.add("run-animation");
    }
});

document.getElementById("loginform").addEventListener("submit", async function(e){
    e.preventDefault()
    const obj = {
        user: document.getElementById("username").value,
        pass: document.getElementById("password").value,
    }
    console.log(obj)
    const res = await fetch("/login", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    })
	let ress = await res.json()
    if(res.status==200){
        document.getElementById("loginout").innerHTML = "Log out"
        try {
            document.getElementById("registrationbutton").style.pointerEvents = "none"
            document.querySelector("#registrationbutton p").innerHTML = ress.user
        } catch(err) {}
        //let audio = new Audio("audio_login.mp3");
        //audio.play();
        localStorage.setItem("username", ress.user);
        localStorage.setItem("password", ress.pass);
        document.getElementById("loginwindow").style.display = "none";
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          	})
          	Toast.fire({
            	icon: 'success',
            	title: 'Signed in successfully as '+ress.fname+" "+ress.lname
			  })
		return
	}
    alert(ress.res)
})

