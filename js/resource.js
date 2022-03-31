let divContainer = document.querySelector("#container");
let btnAddFolder = document.querySelector("#addFolder");
let btnAddTextFile = document.querySelector("#addTextFile");
let templates = document.querySelector("#templates");

let resources = [];
let cfid = -1; // initially we are at root (which has an id of -1)
let rid = 0;

btnAddFolder.addEventListener("click", addResource);
btnAddTextFile.addEventListener("click", addResource);

function addResource() {
    let rname = prompt("Enter folder's name");
    if (rname == null) return;
    rname = rname.trim();

    if (!rname) { // empty name validation
        alert("Empty name is not allowed.");
        return;
    }

    // uniqueness validation
    let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);
    if (alreadyExists == true) {
        alert(rname + " is already in use. Try some other name");
        return;
    }

    let pid = cfid;
    rid++;

    let buttonId = this.getAttribute("bid");
    if (buttonId == "1") {
        addFolderHTML(rname, rid, pid);
        resources.push({
            rid: rid,
            rname: rname,
            rtype: "folder",
            pid: cfid
        });
    } else if (buttonId == "2") {
        addTextFileHTML(rname, rid, pid);
        resources.push({
            rid: rid,
            rname: rname,
            rtype: "text-file",
            pid: cfid,
            isBold: true,
            isItalic: false,
            isUnderline: false,
            bgColor: "#000000",
            textColor: "#FFFFFF",
            fontFamily: "cursive",
            fontSize: 22,
            content: "I am a new file."
        });
    }
    saveToStorage();
}

function addFolderHTML(rname, rid, pid) {
    let divFolderTemplate = templates.content.querySelector(".folder");
    let divFolder = document.importNode(divFolderTemplate, true); // makes a copy

    let spanRename = divFolder.querySelector("[action=rename]");
    let spanDelete = divFolder.querySelector("[action=delete]");
    let spanView = divFolder.querySelector("[action=view]");
    let divName = divFolder.querySelector("[purpose=name]");

    // spanRename.addEventListener("click", renameFolder);
    // spanDelete.addEventListener("click", deleteFolder);
    // spanView.addEventListener("click", viewFolder);
    divName.innerHTML = rname;
    divFolder.setAttribute("rid", rid);
    divFolder.setAttribute("pid", pid);

    divContainer.appendChild(divFolder);
}

function addTextFileHTML(rname, rid, pid) {
    let divTextFileTemplate = templates.content.querySelector(".text-file");
    let divTextFile = document.importNode(divTextFileTemplate, true); // makes a copy

    let spanRename = divTextFile.querySelector("[action=rename]");
    let spanDelete = divTextFile.querySelector("[action=delete]");
    let spanView = divTextFile.querySelector("[action=view]");
    let divName = divTextFile.querySelector("[purpose=name]");

    // spanRename.addEventListener("click", renameTextFile);
    // spanDelete.addEventListener("click", deleteTextFile);
    // spanView.addEventListener("click", viewTextFile);
    // spanView.addEventListener("click", function () {
    //     divApp.style.display = "block";
    // })
    divName.innerHTML = rname;
    divTextFile.setAttribute("rid", rid);
    divTextFile.setAttribute("pid", pid);

    divContainer.appendChild(divTextFile);
}

function saveToStorage() {
    let rjson = JSON.stringify(resources); // used to convert jso to a json string which can be saved
    localStorage.setItem("data", rjson);
}

function loadFromStorage() {
    let rjson = localStorage.getItem("data");
    if (!rjson) {
        return;
    }

    resources = JSON.parse(rjson);
    for (let i = 0; i < resources.length; i++) {
        if (resources[i].pid == cfid) {
            if (resources[i].rtype == "folder") {
                addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
            } else if (resources[i].rtype == "text-file") {
                addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
            }
        }

        if (resources[i].rid > rid) {
            rid = resources[i].rid;
        }
    }
}

loadFromStorage();

