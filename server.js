const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 65534

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json({}))
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    var options = {
        root: path.join(__dirname, 'public')
    }
    res.sendFile('index.html', options)
})

app.get('/data', (req, res) => {
    fs.readFile('data.json', 'utf8', async (err, data) => {
        if (err) {
            await fs.writeFile('./data.json', '{}', 'utf-8', err => res.send('{}'))
        }
        else { res.send(data) }
    })
})


app.post("/data", async (req, res) => {
    await parseData(req.body)
    res.redirect("/")
})

app.delete("/data", async (req, res) => {
    await fs.readFile('data.json', 'utf-8', async (err, data) => {
        var loadedData = JSON.parse(data)
        loadedData[req.body['cname']] = {}
        loadedData = JSON.stringify(loadedData).replace(`,"${req.body['cname']}":{}`, ``)
        await fs.writeFile('data.json', loadedData, () => { })
    })
})

app.listen(port, () => { console.log(`JATS listening on port ${port}`) })

async function parseData(input) {
    eval(`${input['cname'].toLowerCase()} = {
        "Linkedin":"${input['cln']}",
        "hr":{},
        "status":"${input['cstatus']}"
    }`)
    for (let i = 0; i < 4; i++) {
        if (input['hrname' + i])
            eval(`${input['cname'].toLowerCase()}.hr["${input['hrname' + i]}"] = ["${input['hrln' + i]}","${input['hrstatus' + i]}"]`)
    }
    await updateData(input['cname'].toLowerCase(), `${JSON.stringify(eval(`${input['cname'].toLowerCase()}`))}`)
}

async function updateData(name, data) {
    const file = JSON.parse(await fs.readFileSync('data.json', 'utf8'))
    eval(`file.${name} = ${data}`)
    await fs.writeFileSync('data.json', JSON.stringify(file))
}