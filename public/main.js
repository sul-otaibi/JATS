const root = document.getElementById('root')
var data = null


var shown = null

function show(el) {
    if(shown){
        shown.classList.add('hidden')
        // if (shown == el.querySelector('.details')){
        //     shown = null
        //     return
        // }
    }
    shown = el.querySelector('.hidden')
    shown.classList.remove('hidden')
}


function addCompany(input){
    var form
    if(!input){
    form = `<form action="/data/" method="POST" name="Form" autocomplete="off">
        <label for="cname">company name:</label>
        <input type="text" name="cname" id="cname">
        <label for="cln">company linkedin url:</label>
        <input type="text" name="cln" id="cln">
        <label for="cstatus">status:</label>
        <input type="text" name="cstatus" id="cstatus">
        <label for="hrname1">HR name</label>
        <input type="text" name="hrname1" id="hrname1">
        <label for="hrln1">HR linkedin</label>
        <input type="text" name="hrln1" id="hrln1">
        <label for="hrstatus1">status:</label>
        <input type="text" name="hrstatus1" id="hrstatus1">
        <label for="hrname2">HR name</label>
        <input type="text" name="hrname2" id="hrname2">
        <label for="hrln2">HR linkedin</label>
        <input type="text" name="hrln2" id="hrln2">
        <label for="hrstatus2">status:</label>
        <input type="text" name="hrstatus2" id="hrstatus2">
        <label for="hrname3">HR name</label>
        <input type="text" name="hrname3" id="hrname3">
        <label for="hrln3">HR linkedin</label>
        <input type="text" name="hrln3" id="hrln3">
        <label for="hrstatus3">status:</label>
        <input type="text" name="hrstatus3" id="hrstatus3">
        <input type="submit" value="SEND" id="submit">
        <div onclick="hideModal()" id="close-btn">✖</div>
    </form>`
    } else {
        form = `<form action="/data/" method="POST" name="Form" autocomplete="off">
        <label for="cname">company name:</label>
        <input type="text" name="cname" id="cname" value="${input[0]}">
        
        <label for="cln">company linkedin url:</label>
        <input type="text" name="cln" id="cln" value="${input[1]['Linkedin']}">
        
        <label for="cstatus">status:</label>
        <input type="text" name="cstatus" id="cstatus" value="${input[1]['status']}">`
        
        var i = 1

        Object.keys(input[1]['hr']).forEach(e => {
            form += `<label for="hrname${i}">Name</label>
            <input type="text" name="hrname${i}" id="hrname${i}" value="${e}">
            
            <label for="hrln${i}">Linkedin</label>
            <input type="text" name="hrln${i}" id="hrln${i}" value="${input[1]['hr'][e][0]}">
            
            <label for="hrstatus${i}">status:</label>
            <input type="text" name="hrstatus${i}" id="hrstatus${i}" value="${input[1]['hr'][e][1]}">`
            i++
        });
        form += `<label for="hrname${i}">Name</label>
            <input type="text" name="hrname${i}" id="hrname${i}">
            
            <label for="hrln${i}">Linkedin</label>
            <input type="text" name="hrln${i}" id="hrln${i}">
            
            <label for="hrstatus${i}">status:</label>
            <input type="text" name="hrstatus${i}" id="hrstatus${i}">
            <input type="submit" value="SEND" id="submit">
            <div onclick="hideModal()" id="close-btn">✖</div>
        </form>`
    }
    
    const modalBG = document.createElement("div")
    modalBG.classList.add("modal-bg")
    root.appendChild(modalBG)
    const modal = document.createElement("div")
    modal.innerHTML = form
    modal.classList.add("modal")
    modalBG.appendChild(modal)

}

// function submitForm(){
//     const formData = {
//         cln : document.getElementById('cln').innerText,
//         cstatus: document.getElementById('cstatus').innerText,
//         hr1: document.getElementById('hr1').innerText,
//         hrstatus1: document.getElementById('hrstatus1').innerText,
//         hr2: document.getElementById('hr2').innerText,
//         hrstatus2: document.getElementById('hrstatus2').innerText,
//         hr3: document.getElementById('hr3').innerText,
//         hrstatus3: document.getElementById('hrstatus3').innerText
//     }

//     console.log(formData)
//     console.log("cry...")

//     const httpPost = new XMLHttpRequest()
//     // httpPost.onreadystatechange = () => {
//     //     if(httpPost.readyState === 4)
//     //     alert('sent')
//     // }
    
//     httpPost.setRequestHeader("Content-Type", "application/json");
//     httpPost.open("POST", "/data")
//     httpPost.send(JSON.stringify(formData))
// }

function hideModal(){
    const d = document.querySelector('.modal-bg')
    root.removeChild(d)
    loadData()
}

function buildHR(data){
    var string = ''
    for (const key in data) {
        string += `<li>${key} <span class="status status-${data[key][1] == 'pending connection' ? 0 : data[key][1] == 'contacted' ? 1 : 2}"> ${data[key][1]}</span></li>`
    }
    return string
}

async function loadData(){
    const httpGet = new XMLHttpRequest()
    httpGet.onload = () => {
        if(httpGet.readyState === 4){
            data = JSON.parse(httpGet.response)
            build(data)
        }
    }
    httpGet.open("GET", "/data")
    httpGet.send(null)
    }

async function build(data){
    var string = ''
    for (const key in data) {
        string += `<div class="comp-card" onclick="show(this)">
<h2>${key} <span class="status status-${data[key].status == 'pending' ? 0 : data[key].status == 'contacted' ? 1 : 2}"> ${data[key].status}</span></h2>
    <div class="details hidden">
    
    <span class="hr">people</span>
    <ul>
        ${await buildHR(data[key]["hr"])}
    </ul>
    <button id="edit" onclick="editEntry(this.parentElement.parentElement)">edit</button>
</div>
</div>`
    }
    root.innerHTML = string
    const b = document.createElement("div")
    b.classList.add("floating-btn")
    b.innerText = "+"
    b.addEventListener("click", () => {addCompany(null)})
    root.appendChild(b)

}

function editEntry(el){
    cstatus = el.querySelector('.status').innerText
    cname = el.querySelector('h2').innerText.toLowerCase()
    cname = cname.slice(0, cname.indexOf(cstatus)).trim().toLowerCase()
    // li = el.querySelectorAll('li')
    // var i = 1;
    // li.forEach(element => {
    //     console.log(element);
    //     console.log(i);
    //     i++
    // });

    // console.log(data);
    // console.log(cname);
    console.log(data[cname]);
    addCompany([cname, data[cname]])
    
}

window.onload = loadData