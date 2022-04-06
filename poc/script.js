let resourceContainer = document.querySelector("#resource-container");
// let container = document.querySelector("#container");
// let show = document.querySelector("#show");
// let close = document.querySelector("#close");

// show.addEventListener("click", function() {
//     container.style.display = "block";
//     // show.style.display = "none";
// })

// close.addEventListener("click", function() {
//     container.style.display = "none";
//     // show.style.display = "block";
// })

var userInput;
let resourceTemplate = document.querySelector(".resources-template");
let btnAddFolder = document.querySelector("#addFolder");
let btnAddTextFile = document.querySelector("#addTextFile");
let overlay = document.querySelector("#overlay");
let userInputOverlay = document.querySelector("#userInputOverlay");
let divUserInput = document.querySelector("#userInput");

btnAddFolder.addEventListener("click", addResource);
btnAddTextFile.addEventListener("click", addResource);

let resources = [];
let cfid = -1; // initially we are at root (which has an id of -1)
let rid = 0;

function addResource() {
    let rname = prompt("Enter name");

    let resourceBoxTemplate = resourceTemplate.content.querySelector(".resource-box");
    let resourceBox = document.importNode(resourceBoxTemplate, true);

    let pid = cfid;

    resourceBox.querySelector("[purpose='name']").innerHTML = rname;

    let resourceImg = resourceBox.querySelector("[action='set-img-src']");
    if (this.getAttribute("bid") == "1") {
        resourceImg.setAttribute("src", "folder-icon.svg");
        resourceBox.setAttribute("rtype", "folder");
    } else if (this.getAttribute("bid") == "2") {
        resourceImg.setAttribute("src", "text-file-icon.svg");
        resourceBox.setAttribute("rtype", "text-file");
    }

    let threeDots = resourceBox.querySelector(".three-dots");
    resourceBox.addEventListener("mouseover", function () {
        threeDots.style.display = "block";
    });
    resourceBox.addEventListener("mouseleave", function () {
        threeDots.style.display = "none";
    });

    let miniMenu = resourceBox.querySelector(".mini-menu");
    threeDots.addEventListener("mouseover", function () {
        overlay.style.display = "block";
        miniMenu.style.display = "block";
    });
    overlay.addEventListener("click", function () {
        overlay.style.display = "none";
        miniMenu.style.display = "none";
    });

    let liRename = resourceBox.querySelector("[action=rename]");
    let liDelete = resourceBox.querySelector("[action=delete]");
    let liView = resourceBox.querySelector("[action=view]");
    let divName = resourceBox.querySelector("[purpose=name]");

    liRename.addEventListener("click", renameFolder);
    liDelete.addEventListener("click", deleteFolder);
    liView.addEventListener("click", viewFolder);

    resourceBox.setAttribute("rid", rid);
    resourceBox.setAttribute("pid", pid);

    resourceContainer.appendChild(resourceBox);
}

function renameFolder() {
    let miniMenu = this.parentNode;
    miniMenu.style.display = "none";
    overlay.style.display = "none";
    let resourceBox = miniMenu.parentNode.parentNode.parentNode;
    takeUserInput(resourceBox);
    // renameButton.addEventListener("click", reanameFolderHelper);
}

function reanameFolderHelper(resourceBox) {
    userInputOverlay.style.display = "none";
    divUserInput.style.display = "none";
    if (userInput == false || userInput == null) {
        return;
    }
    let nrname = userInput;
    let oldrname = resourceBox.querySelector("[purpose='name']");
    oldrname.innerHTML = nrname;
}

function takeUserInput(resourceBox) {
    userInput = false;
    let input = document.querySelector("#inputBody > input");

    let cancelButton = document.querySelector("#cancel");
    let okButton = document.querySelector("#ok");
    let oldrname = resourceBox.querySelector("[purpose='name']").innerHTML;
    input.value = oldrname;

    userInputOverlay.style.display = "block";
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
        if (userInput) {
            if (userInput.length > 10) {
                alert("Name cannot be more than 16 characters");
                closeUserIntput();
                return;
            }
            reanameFolderHelper(resourceBox);
        }
        closeUserIntput();
        return;
    }

    function closeUserIntput() {
        userInputOverlay.style.display = "none";
        divUserInput.style.display = "none";
        okButton.removeEventListener("click", getInput);
        cancelButton.removeEventListener("click", closeUserIntput);
        return;
    };
}

function deleteFolder() {
    alert("delete");
}

function viewFolder() {
    alert("view");
}


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
// contextAddAlbum.addEventListener("click", () => { addAlbumBtn.click() });