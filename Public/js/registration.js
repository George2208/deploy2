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
    var rad = document.getElementsByName('gender')
    var radio
    for(var i = 0; i < rad.length; i++)
        if(rad[i].checked)
            radio=rad[i].value
    const obj = {
        firstName: document.getElementById("fname").value,
        lastName: document.getElementById("lname").value,
        username: document.getElementById("user").value,
        mail: document.getElementById("mail").value,
        password: document.getElementById("pass").value,
        confirm: document.getElementById("cpass").value,
        option: document.getElementById("opt").value,
        checkbox: checkboxVect,
        gender: radio,
        points: document.getElementById("points").value
    }
    if(!await confirm(obj))
        return
    const res = await fetch("/register", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    })
    ress = await res.json()
    if(res.status == 201){
        localStorage.setItem("username", ress.username);
        localStorage.setItem("password", ress.password);
        window.location.href = "index.html";
    }
    alert(ress.res)
})

async function listeners(){
    const firstName = document.getElementById("fname")
    const lastName = document.getElementById("lname")
    const email = document.getElementById("mail")
    const password = document.getElementById("pass")
    const cpassword = document.getElementById("cpass")

    async function check(){
        console.log("check")
        const re = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!._-])[a-zA-Z0-9?!._-]+$/);
        if(cpassword.value) {
            if(re.test(cpassword.value)){
                if(cpassword.value==password.value)
                    cpassword.style.borderColor = "green";
                else cpassword.style.borderColor = "yellow";}
            else cpassword.style.borderColor = "red";}
        else cpassword.style.borderColor = "inherit";}
    
    firstName.addEventListener("input", function(){
        const re = new RegExp(/^[a-zA-Z0-9]+([a-zA-Z0-9_.-][a-zA-Z0-9]+)*$/);
        if(firstName.value) {
            if(re.test(firstName.value))
                firstName.style.borderColor = "green";
            else firstName.style.borderColor = "red";}
        else firstName.style.borderColor = "inherit";})

    lastName.addEventListener("input", function(){
        const re = new RegExp(/^[a-zA-Z0-9]+([a-zA-Z0-9_.-][a-zA-Z0-9]+)*$/);
        if(lastName.value) {
            if(re.test(lastName.value))
                lastName.style.borderColor = "green";
            else lastName.style.borderColor = "red";}
        else lastName.style.borderColor = "inherit";})

    // ------------------username-------------------

    email.addEventListener("input", function(){
        const re = new RegExp(/^[a-zA-z0-9_-]+(\.[a-zA-z0-9_-]+)*@([a-zA-Z0-9]+\.)+[a-zA-Z]+$/);
        if(email.value) {
            if(re.test(email.value))
                email.style.borderColor = "green";
            else email.style.borderColor = "red";}
        else email.style.borderColor = "inherit";})

    password.addEventListener("input", function(){
        check()
        const re = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!._-])[a-zA-Z0-9?!._-]+$/);
        if(password.value) {
            if(re.test(password.value))
                password.style.borderColor = "green";
            else password.style.borderColor = "red";}
        else password.style.borderColor = "inherit";})

    cpassword.addEventListener("input", function(){check()})
}listeners()

async function confirm(obj){
    return true ///////////////////////////////////////////
    result = await Swal.fire({
        title: 'Are you sure?',
        icon: 'info',
        confirmButtonText: 'Submit!',
        reverseButtons: true,
        cancelButtonText: 'Cancel!',
        showCancelButton: true,
        html: "First name: "+ obj.firstName+"<br>Last name: "+obj.lastName+"<br>Username: "+obj.username+"<br>Email: "+obj.mail+"<br>Gender: "+obj.gender
    })
    if (result.value){
        await Swal.fire({
            icon: 'success',
            title: 'Form submitted',
        })
        return true
    }
    return false
}