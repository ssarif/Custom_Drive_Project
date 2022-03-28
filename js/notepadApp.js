function openNotepad(resourceBox) {
    let divApp = document.querySelector("#app");
    let divAppTitleBar = document.querySelector("#app-title-bar");
    let divAppTitle = document.querySelector("#app-title");
    let divAppMenuBar = document.querySelector("#app-menu-bar");
    let divAppBody = document.querySelector("#app-body");
    let appClose = document.querySelector("#app-close");
    let appOverlay = document.querySelector("#app-overlay");
    let templates = document.querySelector("#templates");

    let rname = resourceBox.querySelector("[purpose='name']").innerHTML;
    let rid = parseInt(resourceBox.getAttribute("rid"));

    let divNotepadMenuTemplate = templates.content.querySelector("[purpose=notepad-menu]");
    let divNotepadMenu = document.importNode(divNotepadMenuTemplate, true);
    divAppMenuBar.innerHTML = "";
    divAppMenuBar.appendChild(divNotepadMenu);

    let divNotepadBodyTemplate = templates.content.querySelector("[purpose=notepad-body]");
    let divNotepadBody = document.importNode(divNotepadBodyTemplate, true);
    divAppBody.innerHTML = "";
    divAppBody.appendChild(divNotepadBody);

    divAppTitle.innerHTML = rname;
    divAppTitle.setAttribute("rid", rid);

    let spanSave = divAppMenuBar.querySelector("[action=save]");
    let spanBold = divAppMenuBar.querySelector("[action=bold]");
    let spanItalic = divAppMenuBar.querySelector("[action=italic]");
    let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
    let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
    let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
    let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
    let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
    let spanDownload = divAppMenuBar.querySelector("[action=download]");
    let spanUpload = divAppMenuBar.querySelector("[action=upload]");
    let textArea = divAppBody.querySelector("textArea");

    spanSave.addEventListener("click", saveNotepad);
    spanBold.addEventListener("click", makeNotepadBold);
    spanItalic.addEventListener("click", makeNotepadItalic);
    spanUnderline.addEventListener("click", makeNotepadUnderline);
    inputBGColor.addEventListener("change", changeNotepadBGColor);
    inputTextColor.addEventListener("change", changeNotepadTextColor);
    selectFontFamily.addEventListener("change", changeNotepadFontFamily);
    spanDownload.addEventListener("click", downloadNotepad);
    spanUpload.addEventListener("change", uploadNotepad)
    selectFontSize.addEventListener("change", changeNotepadFontSize);

    let resource = resources.find(r => r.rid == rid);
    spanBold.setAttribute("pressed", !resource.isBold);
    spanItalic.setAttribute("pressed", !resource.isItalic);
    spanUnderline.setAttribute("pressed", !resource.isUnderline);
    inputBGColor.value = resource.bgColor;
    inputTextColor.value = resource.textColor;
    selectFontFamily.value = resource.fontFamily;
    selectFontSize.value = resource.fontSize;
    textArea.value = resource.content;
    textArea.focus();

    spanBold.dispatchEvent(new Event("click"));
    spanItalic.dispatchEvent(new Event("click"));
    spanUnderline.dispatchEvent(new Event("click"));
    inputBGColor.dispatchEvent(new Event("change"));
    inputTextColor.dispatchEvent(new Event("change"));
    selectFontFamily.dispatchEvent(new Event("change"));
    selectFontSize.dispatchEvent(new Event("change"));

    divApp.style.display = "block";
    appOverlay.style.display = "block";

    appClose.addEventListener("click", function() {
        divApp.style.display = "none";
        appOverlay.style.display = "none";
    });
}

function downloadNotepad() {
    let fid = parseInt(divAppTitle.getAttribute("rid"));
    let resource = resources.find(r => r.rid == fid);
    let divNotepadMenu = this.parentNode;

    let strForDownload = JSON.stringify(resource);
    let encodedData = encodeURIComponent(strForDownload);

    let aDownload = divNotepadMenu.querySelector("a[purpose=download]");
    aDownload.setAttribute("href", "data:text/json; charset=utf-8, " + encodedData);
    aDownload.setAttribute("download", resource.rname + ".json");

    aDownload.click();
}

function uploadNotepad() {
    let file = window.event.target.files[0];
    let reader = new FileReader();
    reader.addEventListener("load", function () {
        let data = window.event.target.result;
        let resource = JSON.parse(data);

        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let textArea = divAppBody.querySelector("textArea");

        spanBold.setAttribute("pressed", !resource.isBold);
        spanItalic.setAttribute("pressed", !resource.isItalic);
        spanUnderline.setAttribute("pressed", !resource.isUnderline);
        inputBGColor.value = resource.bgColor;
        inputTextColor.value = resource.textColor;
        selectFontFamily.value = resource.fontFamily;
        selectFontSize.value = resource.fontSize;
        textArea.value = resource.content;

        spanBold.dispatchEvent(new Event("click"));
        spanItalic.dispatchEvent(new Event("click"));
        spanUnderline.dispatchEvent(new Event("click"));
        inputBGColor.dispatchEvent(new Event("change"));
        inputTextColor.dispatchEvent(new Event("change"));
        selectFontFamily.dispatchEvent(new Event("change"));
        selectFontSize.dispatchEvent(new Event("change"));
    })
    reader.readAsText(file);
}

function saveNotepad() {
    let fid = parseInt(divAppTitle.getAttribute("rid"));
    let resource = resources.find(r => r.rid == fid);

    let spanBold = divAppMenuBar.querySelector("[action=bold]");
    let spanItalic = divAppMenuBar.querySelector("[action=italic]");
    let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
    let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
    let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
    let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
    let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
    let textArea = divAppBody.querySelector("textArea");

    resource.isBold = spanBold.getAttribute("pressed") == "true";
    resource.isItalic = spanItalic.getAttribute("pressed") == "true";
    resource.isUnderline = spanUnderline.getAttribute("pressed") == "true";
    resource.bgColor = inputBGColor.value;
    resource.textColor = inputTextColor.value;
    resource.fontFamily = selectFontFamily.value;
    resource.fontSize = selectFontSize.value;
    resource.content = textArea.value;

    saveToStorage();
}

function makeNotepadBold() {
    let textArea = divAppBody.querySelector("textArea");
    let isPressed = this.getAttribute("pressed") == "true";
    if (isPressed == false) {
        this.setAttribute("pressed", true);
        textArea.style.fontWeight = "bold";
    } else {
        this.setAttribute("pressed", false);
        textArea.style.fontWeight = "normal";
    }
}
function makeNotepadItalic() {
    let textArea = divAppBody.querySelector("textArea");
    let isPressed = this.getAttribute("pressed") == "true";
    if (isPressed == false) {
        this.setAttribute("pressed", true);
        textArea.style.fontStyle = "italic";
    } else {
        this.setAttribute("pressed", false);
        textArea.style.fontStyle = "normal";
    }
}
function makeNotepadUnderline() {
    let textArea = divAppBody.querySelector("textArea");
    let isPressed = this.getAttribute("pressed") == "true";
    if (isPressed == false) {
        this.setAttribute("pressed", true);
        textArea.style.textDecoration = "underline";
    } else {
        this.setAttribute("pressed", false);
        textArea.style.textDecoration = "none";
    }
}

function changeNotepadBGColor() {
    let color = this.value;
    let textArea = divAppBody.querySelector("textArea");
    textArea.style.backgroundColor = color;
}

function changeNotepadTextColor() {
    let color = this.value;
    let textArea = divAppBody.querySelector("textArea");
    textArea.style.color = color;
}

function changeNotepadFontFamily() {
    let fontFamily = this.value;
    let textArea = divAppBody.querySelector("textArea");
    textArea.style.fontFamily = fontFamily;
}

function changeNotepadFontSize() {
    let fontSize = this.value;
    let textArea = divAppBody.querySelector("textArea");
    textArea.style.fontSize = fontSize;
}