let btnAddFolder = document.querySelector("#addFolder");
let btnAddTextFile = document.querySelector("#addTextFile");
let btnAddAlbum = document.querySelector("#addAlbum");
let divbreadcrumb = document.querySelector("#breadcrumb");
let aRootPath = divbreadcrumb.querySelector("a[purpose='path']");
let divContainer = document.querySelector("#container");
let resourceContainer = document.querySelector("#resource-container");
let overlay = document.querySelector("#overlay");

let divApp = document.querySelector("#app");
let divAppTitleBar = document.querySelector("#app-title-bar");
let divAppTitle = document.querySelector("#app-title");
let divAppMenuBar = document.querySelector("#app-menu-bar");
let divAppBody = document.querySelector("#app-body");
let appClose = document.querySelector("#app-close");
let divUserInput = document.querySelector("#userInput");

let templates = document.querySelector("#templates");
let resourceTemplate = document.querySelector(".resources-template");
let resources = [];
let cfid = -1; // initially we are at root (which has an id of -1)
let rid = 0;

btnAddFolder.addEventListener("click", addResource);
btnAddTextFile.addEventListener("click", addResource);
btnAddAlbum.addEventListener("click", addResource);
aRootPath.addEventListener("click", viewFolderFromPath);
// appClose.addEventListener("click", closeApp);

window.addEventListener("contextmenu", function(event) {
    event.preventDefault();
    if (event.target.classList[0] === "r-img") return;
    var contextElement = document.getElementById("main-context-menu");
    contextElement.style.display = "block";
    contextElement.style.top = event.pageY + "px";
    contextElement.style.left = event.pageX + "px";
})

window.addEventListener("click", function() {
    document.getElementById("main-context-menu").style.display = "none";
})

const contextAddFolder = document.querySelector("#cm-add-folder");
const contextAddFile = document.querySelector("#cm-add-file");
const contextAddAlbum = document.querySelector("#cm-add-album");

contextAddFolder.addEventListener("click", () => { btnAddFolder.click() });
contextAddFile.addEventListener("click", () => { btnAddTextFile.click() });
contextAddAlbum.addEventListener("click", () => { btnAddAlbum.click() });

function addResource() {
    let rname = prompt("Enter name");
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
    if (this.getAttribute("bid") == "1") {
        let rtype = "folder";
        addResourceHTML(rname, rtype, rid, pid);
        resources.push({
            rid: rid,
            rname: rname,
            rtype: rtype,
            pid: cfid
        });
    } else if (this.getAttribute("bid") == "2") {
        let rtype = "text-file";
        addResourceHTML(rname, rtype, rid, pid);
        resources.push({
            rid: rid,
            rname: rname,
            rtype: rtype,
            pid: cfid,
            isBold: true,
            isItalic: false,
            isUnderline: false,
            bgColor: "#FFFFFF",
            textColor: "#000000",
            fontFamily: "cursive",
            fontSize: "10pt",
            content: "I am a new file."
        });
    } else if (this.getAttribute("bid") == "3") {
        let rtype = "album";
        addResourceHTML(rname, rtype, rid, pid);
        resources.push({
            rid: rid,
            rname: rname,
            rtype: rtype,
            images: [],
            pid: cfid
        });
    }

    // save update
    saveToStorage();
}

function addResourceHTML(rname, rtype, rid, pid) {
    let resourceBoxTemplate = resourceTemplate.content.querySelector(".resource-box");
    let resourceBox = document.importNode(resourceBoxTemplate, true);

    resourceBox.querySelector("[purpose='name']").innerHTML = rname;

    let resourceImg = resourceBox.querySelector("[action='set-img-src']");
    if (rtype == "folder") {
        resourceImg.setAttribute("src", "icons/folder-icon.svg");
    } else if (rtype == "text-file") {
        resourceImg.setAttribute("src", "icons/text-file-icon.svg");
    } else if (rtype == "album") {
        resourceImg.setAttribute("src", "icons/album-icon.svg");
    } 

    let threeDots = resourceBox.querySelector(".three-dots");
    resourceBox.addEventListener("mouseover", function () {
        threeDots.style.display = "block";
    });
    resourceBox.addEventListener("mouseleave", function () {
        threeDots.style.display = "none";
    });

    let miniMenu = resourceBox.querySelector(".mini-menu");
    threeDots.addEventListener("click", function () {
        miniMenu.style.display = "block";
        overlay.style.display = "block";
    });
    overlay.addEventListener("click", function () {
        miniMenu.style.display = "none";
        overlay.style.display = "none";
    });
    // miniMenu.addEventListener("mouseleave", function () {
    //     setTimeout(function () {
    //         miniMenu.style.display = "none";
    //         overlay.style.display = "none";
    //     }, 2000)
    // });

    let liRename = resourceBox.querySelector("[action=rename]");
    let liDelete = resourceBox.querySelector("[action=delete]");
    let liView = resourceBox.querySelector("[action=view]");

    liRename.addEventListener("click", renameResource);
    liDelete.addEventListener("click", deleteResource);
    liView.addEventListener("click", viewResource);
    resourceBox.addEventListener("dblclick", viewResourceOnDoubleClick);

    resourceBox.setAttribute("rid", rid);
    resourceBox.setAttribute("pid", pid);

    resourceContainer.appendChild(resourceBox);
}

function renameResource() {
    let miniMenu = this.parentNode;
    miniMenu.style.display = "none";
    overlay.style.display = "none";
    let resourceBox = miniMenu.parentNode.parentNode.parentNode;
    takeUserInput(resourceBox);
    // renameButton.addEventListener("click", reanameFolderHelper);
}

function reanameResourceHelper(resourceBox) {
    overlay.style.display = "none";
    divUserInput.style.display = "none";
    if (userInput == null) {
        return;
    }

    let nrname = userInput;
    let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
    if (alreadyExists == true) {
        alert(nrname + " already exists.");
        return;
    }
    let oldrname = resourceBox.querySelector("[purpose='name']");
    oldrname.innerHTML = nrname;

    let ridTBU = parseInt(resourceBox.getAttribute("rid"));
    let resource = resources.find(r => r.rid == ridTBU);
    resource.rname = nrname;

    saveToStorage();
}

function takeUserInput(resourceBox) {
    userInput = false;
    let input = document.querySelector("#inputBody > input");

    let cancelButton = document.querySelector("#cancel");
    let okButton = document.querySelector("#ok");
    let oldrname = resourceBox.querySelector("[purpose='name']").innerHTML;
    input.value = oldrname;

    overlay.style.display = "block";
    overlay.addEventListener("click", function () {
        divUserInput.style.display = "none";
    })
    divUserInput.style.display = "block";
    input.focus();
    input.addEventListener("focus", function () {
        this.select();
    });


    cancelButton.addEventListener("click", closeUserIntput);
    okButton.addEventListener("click", getInput);

    function getInput() {
        userInput = input.value;
        userInput = userInput.trim();
        input.value = "";
        if (userInput == "") {
            alert("Empty name not allowed.");
            closeUserIntput();
            return;
        } else {
            if (userInput.length > 10) {
                alert("Name cannot be more than 16 characters");
                closeUserIntput();
                return;
            }
            reanameResourceHelper(resourceBox);
        }
        closeUserIntput();
        return;
    }

    function closeUserIntput() {
        overlay.style.display = "none";
        divUserInput.style.display = "none";
        okButton.removeEventListener("click", getInput);
        cancelButton.removeEventListener("click", closeUserIntput);
        return;
    };
}

function viewResourceOnDoubleClick() {
    let resourceBox = this;
    let rname = resourceBox.querySelector("[purpose='name']").innerHTML;
    let rid = parseInt(resourceBox.getAttribute("rid"));

    let resource = resources.find(r => r.rid == rid);

    // alert(resource.rtype + " " + rid);

    if (resource.rtype == "folder") {
        let aPathTemplate = templates.content.querySelector("a[purpose='path']");
        let aPath = document.importNode(aPathTemplate, true);


        aPath.innerHTML = rname;
        aPath.setAttribute("rid", rid);
        aPath.addEventListener("click", viewFolderFromPath);
        divbreadcrumb.appendChild(aPath);

        cfid = rid;
        resourceContainer.innerHTML = "";
        for (let i = 0; i < resources.length; i++) {
            if (resources[i].pid == cfid) {
                if (resources[i].rtype == "folder") {
                    addResourceHTML(resources[i].rname, resources[i].rtype, resources[i].rid, resources[i].pid);
                } else if (resources[i].rtype == "text-file") {
                    addResourceHTML(resources[i].rname, resources[i].rtype, resources[i].rid, resources[i].pid);
                } else if (resources[i].rtype == "album") {
                    addResourceHTML(resources[i].rname, resources[i].rtype, resources[i].rid, resources[i].pid);
                }
            }
        }
    } else if (resource.rtype == "text-file") {
        let resourceBox = this;
        openNotepad(resourceBox);
    } else if (resource.rtype == "album") {
        let resourceBox = this;
        openAlbumApp(resourceBox);
    }
}

function viewResource() {
    let miniMenu = this.parentNode;
    miniMenu.style.display = "none";
    overlay.style.display = "none";
    let resourceBox = miniMenu.parentNode.parentNode.parentNode;
    let rname = resourceBox.querySelector("[purpose='name']").innerHTML;
    let rid = parseInt(resourceBox.getAttribute("rid"));

    let resource = resources.find(r => r.rid == rid);

    if (resource.rtype == "folder") {
        let aPathTemplate = templates.content.querySelector("a[purpose='path']");
        let aPath = document.importNode(aPathTemplate, true);


        aPath.innerHTML = rname;
        aPath.setAttribute("rid", rid);
        aPath.addEventListener("click", viewFolderFromPath);
        divbreadcrumb.appendChild(aPath);

        cfid = rid;
        resourceContainer.innerHTML = "";
        for (let i = 0; i < resources.length; i++) {
            if (resources[i].pid == cfid) {
                if (resources[i].rtype == "folder") {
                    addResourceHTML(resources[i].rname, resources[i].rtype, resources[i].rid, resources[i].pid);
                } else if (resources[i].rtype == "text-file") {
                    addResourceHTML(resources[i].rname, resources[i].rtype, resources[i].rid, resources[i].pid);
                } else if (resources[i].rtype == "album") {
                    addResourceHTML(resources[i].rname, resources[i].rtype, resources[i].rid, resources[i].pid);
                }
            }
        }
    } else if (resource.rtype == "text-file") {
        let miniMenu = this.parentNode;
        let resourceBox = miniMenu.parentNode.parentNode.parentNode;
        openNotepad(resourceBox);
    } else if (resource.rtype == "album") {
        let miniMenu = this.parentNode;
        let resourceBox = miniMenu.parentNode.parentNode.parentNode;
        openAlbumApp(resourceBox);
    }
}

function viewFolderFromPath() {
    let aPath = this;
    let rid = parseInt(aPath.getAttribute("rid"));

    // set the breadcrumb
    for (let i = divbreadcrumb.children.length - 1; i >= 0; i--) {
        if (divbreadcrumb.children[i] == aPath) {
            break;
        }
        divbreadcrumb.removeChild(divbreadcrumb.children[i]);
    }

    // set the container
    cfid = rid;
    resourceContainer.innerHTML = "";
    for (let i = 0; i < resources.length; i++) {
        if (resources[i].pid == cfid) {
            if (resources[i].rtype == "folder") {
                addResourceHTML(resources[i].rname, resources[i].rtype, resources[i].rid, resources[i].pid);
            } else if (resources[i].rtype == "text-file") {
                addResourceHTML(resources[i].rname, resources[i].rtype, resources[i].rid, resources[i].pid);
            } else if (resources[i].rtype == "album") {
                addResourceHTML(resources[i].rname, resources[i].rtype, resources[i].rid, resources[i].pid);
            }
        }
    }
}

function deleteResource() {
    let miniMenu = this.parentNode;
    miniMenu.style.display = "none";
    overlay.style.display = "none";
    let resourceBox = miniMenu.parentNode.parentNode.parentNode;
    let rname = resourceBox.querySelector("[purpose='name']").innerHTML;
    let ridTBD = parseInt(resourceBox.getAttribute("rid"));
    let resource = resources.find(r => r.rid == ridTBD);

    let childrenExists = resources.some(r => r.pid == ridTBD);
    let sure = confirm(`Are you sure you want to delete ${rname} ${resource.rtype}?` + (childrenExists ? ". It also has children." : ""));
    if (!sure) {
        return;
    }

    if(sure) {
        // delete in HTML
        resourceContainer.removeChild(resourceBox);

        // delete in RAM
        if(childrenExists) {
            deleteHelper(ridTBD);
        }  else {
            let ridx = resources.findIndex(r => r.rid == ridTBD);
            resources.splice(ridx, 1);
        }

        // save update
        saveToStorage();
    }
}

function deleteHelper(ridTBD) {
    let children = resources.filter(r => r.pid == ridTBD);
    for (let i = 0; i < children.length; i++) {
        deleteHelper(children[i].rid); // this is capable of delete children and their children recursively
    }

    let ridx = resources.findIndex(r => r.rid == ridTBD);
    resources.splice(ridx, 1);
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
                addResourceHTML(resources[i].rname, resources[i].rtype, resources[i].rid, resources[i].pid);
            } else if (resources[i].rtype == "text-file") {
                addResourceHTML(resources[i].rname, resources[i].rtype, resources[i].rid, resources[i].pid);
            } else if (resources[i].rtype == "album") {
                addResourceHTML(resources[i].rname, resources[i].rtype, resources[i].rid, resources[i].pid);
            }
        }

        if (resources[i].rid > rid) {
            rid = resources[i].rid;
        }
    }
}

loadFromStorage();
