var once = false
document.addEventListener("DOMContentLoaded", function(){
    if(once)
        return
    document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", `
        <nav>
            <button class="navmenu">Menu</button>
            <ul>
                <li><a href="../html/index.html"><svg><use href="#svg_home"></use></svg>Home</a></li>
                <li><a href="#" onclick="hidecomments()"><svg><use href="#svg_contact"></use></svg>Contact</a></li>
                <li class="dropdown">
                    <button><svg><use href="#svg_more"></use></svg>More</button>
                    <div class="dropdowncontent">
                        <a href="#">Reviews</a>
                        <a href="#">News</a>
                        <a href="#">Topics</a>
                    </div>
                </li>
                <li><button onclick="darkMode()"><svg><use href="#svg_darkmode"></use></svg>Dark-mode</button></li>
            </ul>
            <ul>
                <li><button id="loginbutton"><svg><use href="#svg_login"></use></svg><p id="loginout">Login</p></button></li>
                <li><a href="../html/registration.html"><svg><use href="#svg_register"></use></svg>Registration</a></li>
            </ul>
        </nav>
        <div id="loginwindow" class="runanim">
            <h1>Login</h1>
            <form id="loginform">
                <label for="username">Your username:</label>
                <input id="username" type="text" placeholder="Username" required>
                <label for="password">Your password:</label>
                <input id="password" type="password" placeholder="Password" required>
            </form>
            <div id="remembermediv">
                <input id="rememberme" type="checkbox">
                <label for="rememberme">Remember me</label>
            </div>
            <button id="closeloginwindow">Close</button>
            <button id="submitbutton" type="submit" form="loginform" value="Submit">Submit</button>
            <ul>
                <li><a href="registration.html">Create new account</a></li>
                <li><a href="#">Password recovery</a></li>
            </ul>
        </div>`)
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
            if(document.getElementById("rememberme").checked == true && document.getElementById("username").value !== "")
                localStorage.setItem("username", document.getElementById("username").value);
            else
                localStorage.setItem("username", "");
        });
    }
    else {
        let elem = document.getElementById("remembermediv");
        elem.parentNode.removeChild(elem);
    }

    if (typeof(Storage) !== "undefined" && localStorage.getItem("darkmode") == "true") {
        document.body.classList.add("dark-mode");
    }
})