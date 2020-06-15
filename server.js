const bodyParser = require("body-parser")
const express = require("express")
const bcrypt = require('bcryptjs')
const path = require("path")
const fs = require("fs")
const app = express()

app.use(express.static(path.join(__dirname, "Public")))
app.use(bodyParser.json())

let port = process.env.PORT || 3000
let users = []
let comments = []
let logs = []
let keeplogs = true
let admin

function checkUser(req){
    for(i=0; i<users.length; i++)
        if(users[i].username==req.user){
            if(users[i].password==req.pass)
                return true
            return false}
    return false
}

async function logg(req){
    const user = users.find(user => user.username === req.user)
        if (user == null) return false
        try {
            if(await bcrypt.compare(req.pass, user.password)){
                if(keeplogs)
                    logs.push(new Date().toLocaleString()+":  "+user.firstName+" "+user.lastName+" logged in.")
                return {fname: user.firstName, lname: user.lastName, user: user.username, pass: user.password}
            }
            else return false
        } catch {return false}
}

async function save(){
    fs.writeFileSync('users.json', JSON.stringify(users))
    fs.writeFileSync('comments.json', JSON.stringify(comments))
}

function init(param = false){
    fs.readFile("users.json", (err, data) => {
        if(err) {
            console.log("Warning: No users FILE found!")
            fs.appendFile('users.json', "", function (err) {
                if (err) console.log("Error: Something wrong with jsons!")
                console.log('Users file created.')})
            return}
        try {
            let x=JSON.parse(data)
            users=x
            if(param)
                console.log(users)
        }
        catch(err) {
            console.log("Warning: No users found!")}
    })

    fs.readFile("comments.json", (err, data) => {
        if(err) {
            console.log("Warning: No comments FILE found!")
            fs.appendFile('comments.json', "", function (err) {
                if (err) console.log("Error: Something wrong with jsons!")
                console.log('Comments file created.')})
            return}
        try {
            let x=JSON.parse(data)
            comments=x
            if(param)
                console.log(comments)}
        catch(err) {
            console.log("Warning: No comments found!")}
    })

    fs.readFile("log.json", (err, data) => {
        if(err) {
            console.log("Warning: No log FILE found!")
            fs.appendFile('log.json', "", function (err) {
                if (err) console.log("Error: Something wrong with jsons!")
                console.log('Log file created.')})
            return}
        try {
            let x=JSON.parse(data)
            logs=x
            if(param)
                console.log(logs)}
        catch(err) {
            console.log("Warning: No logs found!")}
    })
}init()

/*------------------------------------------------------------------------*/

app.get("/admin", (req, res) => {
    res.sendFile(__dirname+"/admin.html")
});

async function checkadmin(req){
    if(!admin){
        admin = users.find(user => user.username === "admin")
    }
    if(req.user == "admin" && req.pass == admin.password)
        return true
    return false
}

app.post("/admin", async (req, res) => {
    console.log(req.body)
    if(!await checkadmin(req.body))
        res.status(401).send()
    if(req.body.command == "delcomm"){
        comments = []
        res.status(200).send({res: "comments deleted"})
    }
    if(req.body.command == "delusers"){
        users = []
        users.push(admin)
        res.status(200).send({res: "users deleted"})
    }
    if(req.body.command == "users"){
        res.status(200).send({res: users})
    }
    if(req.body.command == "save"){
        save()
        res.status(200).send({res: "all saved"})
    }
    if(req.body.command == "logs"){
        res.status(200).send({res: logs})
    }
})

/*-------------------------------------------------------------------------*/

app.get("/", (req, res) => {
    res.sendFile(__dirname+"/Public/html/index.html")
});

app.post("/autologin", (req, res) => {
    if(checkUser(req.body))
        res.status(200).send(JSON.stringify(req.body))
    else res.status(401).send()
})

app.post("/login", async function(req, res){
    let data = req.body
    ok = await logg(data)
    if(ok){
        res.status(200).send(JSON.stringify(ok))
        return
    }
    res.status(401).send({res:"Incorrect username or password."})
    console.log("Login failed ", data)
})

app.get("/comments", (req, res) => {
    res.status(200).send(JSON.stringify(comments))
})

app.post("/comments", async function(req, res){
    console.log(req.body)
    if(checkUser(req.body)){
        comments.push({user: req.body.user, text: req.body.text, time:new Date().toLocaleString(), upvotes: [], downvotes: []})
        if(keeplogs)
            logs.push(new Date().toLocaleString()+":  "+req.body.user+" added a comment.")
        res.status(201).send("Comment added.")}
    else res.status(401).send("You cannot comment!")
})



/*----------------------------------------------------------------*/

function findComment(user, time){
    console.log(user+"  "+time)
    for(i=0; i<comments.length; i++)
        if(comments[i].user==user && comments[i].time==time)
            return i
    return -1
}

function isAdmin(user){
    if(user=="admin")
        return true
    return false
}

function alreadyVoted(list, user){
    for(i=0; i<list.length; i++)
        if(list[i]==user)
            return 1
    return 0
}

function getindex(list, user){
    for(i=0; i<list.length; i++)
        if(list[i]==user)
            return i
    return -1
}

app.post("/upvote", async function(req, res){
    if(checkUser(req.body)){
        ind = findComment(req.body.commentUser, req.body.commentTime)
        console.log(comments[ind])
        if(alreadyVoted(comments[ind].upvotes, req.body.user)){
            res.status(200).send({res: "You already upvoted"})
            console.log(comments[ind].upvotes)
            console.log(req.body.user)
        }
        else {
            comments[ind].upvotes.push(req.body.user)
            downvote = getindex(comments[ind].downvotes, req.body.user)
            if(downvote >= 0){
                comments[ind].downvotes.splice(downvote, 1)
                res.status(201).send({res: "Your vote was commited and previous downvote deleted"})
            }
            else res.status(201).send({res: "Your vote was commited"})
            if(keeplogs)
                logs.push(new Date().toLocaleString()+":  "+req.body.user+" liked "+req.body.commentUser+"'s comment.")
        }
    }
    else res.status(401).send({res: "You cannot vote"})
})

app.post("/downvote", async function(req, res){
    if(checkUser(req.body)){
        ind = findComment(req.body.commentUser, req.body.commentTime)
        console.log(comments[ind])
        if(alreadyVoted(comments[ind].downvotes, req.body.user)){
            res.status(200).send({res: "You already downvoted"})
        }
        else {
            comments[ind].downvotes.push(req.body.user)
            upvote = getindex(comments[ind].upvotes, req.body.user)
            console.log(upvote + "" + comments[ind].upvotes)
            if(upvote >= 0){
                comments[ind].upvotes.splice(upvote, 1)
                res.status(201).send({res: "Your vote was commited and previous upvote deleted"})
            }
            else res.status(201).send({res: "Your vote was commited"})
            if(keeplogs)
                logs.push(new Date().toLocaleString()+":  "+req.body.user+" disliked "+req.body.commentUser+"'s comment.")
        }
    }
    else res.status(401).send({res: "You cannot vote"})
})

app.post("/deletecomment", async function(req, res){
    if(checkUser(req.body) && (req.body.user == req.body.commentUser || isAdmin(req.body.user))){
        comments.splice(findComment(req.body.commentUser, req.body.commentTime), 1)
        res.status(200).send({res: "Comment deleted"})
        if(keeplogs)
            logs.push(new Date().toLocaleString()+":  "+req.body.user+" deleted a comment.")
    }
    else res.status(401).send({res: "You can't delete this comment"})
})

/*----------------------------------------------------------------*/

app.post("/userspage", async function(req, res){
    if(checkUser(req.body)){
        list = []
        for(i=0; i<users.length; i++){
            obj = {
                username: users[i].username,
                firstName: users[i].firstName,
                lastName: users[i].lastName,
            }
            if(checkadmin)
                obj.type = "admin"
            else
                obj.type = "user"
            list.push(obj)
        }
        res.status(200).send(list)
    }
    else
        res.status(401).send({res: "Access denied"})
})

app.post("/register", async (req, res) => {
    try {
        const temp = users.find(user => user.username === req.body.username)
        if(temp){
            res.status(500).send({res: "Username already exists."})
            return
        }
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            mail: req.body.mail,
            password: hash,
            confirm: req.body.confirm,
            option: req.body.option,
            checkbox: req.body.checkbox,
            gender: req.body.gender,
            points: req.body.points
        }
        if(keeplogs)
            logs.push(new Date().toLocaleString()+":  "+user.username+" joined.")
        res.status(201).send(JSON.stringify({res: "Account created :)", username:user.username, password:user.password}))
        users.push(user)
    } catch {
        res.status(500).send("Something went wrong...")
        console.log("Registration statuscode 500")}
})

app.delete("/delete", async (req, res) => {
    for(i=0; i<users.length; i++)
        if(users[i].username==req.body.username){
            if(await bcrypt.compare(req.body.password, users[i].password)){
                res.status(200).send({res: "Account deleted."})
                if(keeplogs)
                    logs.push(new Date().toLocaleString()+":  "+user.username+" deleted the account.")
                users.splice(i, 1);
                return
            }
            res.status(401).send({res: "Delete password incorrect!"})
            console.log("Delete "+req.body.username+" incorrect password.")
            return
        }
    res.status(401).send({res: "Delete username incorrect!"})
    console.log("Delete "+req.body.username+" incorrect username.")
})

app.put("/update", async (req, res) => {
    for(i=0; i<users.length; i++)
        if(users[i].username==req.body.username){
            if(await bcrypt.compare(req.body.password, users[i].password)){
                res.status(200).send({res: "Account  updated"})
                console.log("Update "+req.username+" success.")
                users[i].mail = req.body.mail
                users[i].option = req.body.option
                users[i].checkbox = req.body.checkbox
                users[i].points = req.body.points
                return
            }
            res.status(401).send({res: "Update password incorrect!"})
            console.log("Update "+req.username+" incorrect password.")
            return
        }
    res.status(401).send({res: "Update username incorrect!"})
    console.log("Update "+req.username+" incorrect username.")
})

app.get("*", (req, res) => {
    console.log("404 on adress "+req.url)
    res.status(404).sendFile(__dirname+"/Public/html/404.html")
});

app.listen(port)