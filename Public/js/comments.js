async function login(){
    if(!localStorage.getItem("username") || !localStorage.getItem("password"))
        return false

    const obj = {
        user: localStorage.getItem("username"),
        pass: localStorage.getItem("password")
    }
    const res = await fetch("/autologin", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    })

    if(res.status==200){
        console.log("status 200")
        return true
    }
    alert(res.status)
    return false
}

async function refresh(){
    x = await fetch("/comments")
    let y = await x.json()
    console.log(y)
    append(y)
}


/*----------------------------------------------------*/
async function vote(commentUser, commentTime, type){
    let address = "/downvote"
    if(type=="up")
        address = "/upvote"
    obj = {
        user: localStorage.getItem("username"),
        pass: localStorage.getItem("password"),
        commentUser,
        commentTime
    }
    res = await fetch(address, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    })
    ress = await res.json()
    console.log(ress.res)
    autorefreh()
    if(res.status == 401)
        alert(ress.res)
}

async function deleteComment(commentUser, commentTime){
    obj = {
        user: localStorage.getItem("username"),
        pass: localStorage.getItem("password"),
        commentUser,
        commentTime
    }
    res = await fetch("/deletecomment", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    })
    if(res.status == 401)
        alert("You can't delete this comment")
    else {
        res = await res.json()
        console.log(res.res)
        refresh()
        setTimeout(() => {
            autorefreh()
        }, refreshrate);
    }
}

function alreadyVoted(list, user){
    for(i=0; i<list.length; i++)
        if(list[i]==user)
            return 1
    return 0
}

async function append(newMessages){
    const main = document.getElementById("container")
    main.innerHTML = ""
    newMessages.forEach(element => {
        let deleteButton = ``
        let up = ``
        let down = ``
        if(localStorage.getItem("username")=="admin" || localStorage.getItem("username")==element.user)
            deleteButton = `<svg class="downvote" onclick='deleteComment("${element.user}", "${element.time.toLocaleString()}")' x="0px" y="0px" width="19px" height="19px" viewBox="0 0 16 16"><use href="#svg_delete"></use></svg>`
        if(alreadyVoted(element.upvotes, localStorage.getItem("username")))
            up=`style="fill: green"`
        if(alreadyVoted(element.downvotes, localStorage.getItem("username")))
            down=`style="fill: red"`
        let temp = `<div class="div">
            <div>
                <p class="date">(${element.time.toLocaleString()})</p>
                <p class="username">${element.user}:</p>
            </div>
            <p class="comment">${element.text}</p>
            <div class="rate">
                <svg class="upvote" onclick='vote("${element.user}", "${element.time.toLocaleString()}", "up")' ${up} x="0px" y="0px" width="19px" height="19px" viewBox="0 0 475.099 475.099"><use href="#svg_upvote"></use></svg>
                <p>${element.upvotes.length} likes</p>
                <svg class="downvote" onclick='vote("${element.user}", "${element.time.toLocaleString()}", "down")' ${down} x="0px" y="0px" width="19px" height="19px" viewBox="0 0 475.092 475.092"><use href="#svg_downvote"></use></svg>
                <p>${element.downvotes.length} dislikes</p>
                ${deleteButton}
            </div>
            </div>`
        if(element.downvotes.length < 3)
            main.insertAdjacentHTML('afterbegin',temp)
    })
}

document.getElementById("btn").addEventListener("click", async function(e){
    e.preventDefault()
    const req = {
        user: localStorage.getItem("username"),
        pass: localStorage.getItem("password"),
        text: document.getElementById("text").value
    }
    document.getElementById("text").value=""
    const res = await fetch("/comments",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(req)
    })
    if(res.status==201)
        autorefreh()
    else
        alert("You can't comment")
})

var timer
var refreshrate = 3000

function autorefreh(){
    refresh()
    clearInterval(timer)
    timer = setInterval(() => {
        refresh()
    }, refreshrate);
}autorefreh()

document.getElementById("hidebtn").addEventListener("click", function(e){
    e.preventDefault()
    clearInterval(timer)
    document.getElementById("commdiv").innerHTML = ""
    console.log("Comments disabled")
})