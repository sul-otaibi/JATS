const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 65535

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json({}))
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
    var options = {
        root: path.join(__dirname, 'public')
    }
    res.sendFile('index.html', options)
})

app.get('/data', async (req, res) => {
    const data = await fs.readFileSync('data.json', 'utf8')
    res.send(data)
})


app.post("/data", async (req, res) => {
    await parseData(req.body)
    res.redirect("/")
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})

async function parseData(input) {
    eval(`${input['cname'].toLowerCase()} = {
        "Linkedin":"${input['cln']}",
        "hr":{},
        "status":"${input['cstatus']}"
    }`)
    for (let i = 0; i < 4; i++) {
        if(input['hrname'+i])
        eval(`${input['cname'].toLowerCase()}.hr["${input['hrname'+i]}"] = ["${input['hrln'+i]}","${input['hrstatus'+i]}"]`)
    }
    await updataData(input['cname'].toLowerCase(), `${JSON.stringify(eval(`${input['cname'].toLowerCase()}`))}`)
}

async function updataData(name, data){
    const file = JSON.parse(await fs.readFileSync('data.json', 'utf8'))
    eval(`file.${name} = ${data}`)
    await fs.writeFileSync('data.json', JSON.stringify(file))
}