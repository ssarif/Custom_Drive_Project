let divAlbumApp = document.querySelector("#album-app");
let divAlbumAppTitleBar = document.querySelector("#album-app-title-bar");
let divAlbumAppTitle = document.querySelector("#album-app-title-bar > #app-title");
let albumAppClose = document.querySelector("#album-app-title-bar > #app-close");
let divAlbumAppMenuBar = document.querySelector("#album-app-menu-bar");
let appOverlay = document.querySelector("#app-overlay");
let divImgContainer = document.querySelector("#img-container");
let divImgListContainer = document.querySelector("#img-list-container");
let divImgShowContainer = document.querySelector("#img-show-container");
let parentImg = document.querySelector("#parent-img");
let leftArrow = document.querySelector("#left");
let rightArrow = document.querySelector("#right");
let leftImgShow = document.querySelector("#left_img_show");
let rightImgShow = document.querySelector("#right_img_show");

let addImage = document.querySelector("#add-img");
let importImage = document.querySelector("#import-img");
let downloadImage = document.querySelector("#export-img");
let playAlbum = document.querySelector("#playAlbum");
let deleteImage = document.querySelector("#delete-img");
let uploadFile = document.querySelector("#uploadFile");

let albumId = -1;
let imgId = -1;
let images = [];

albumAppClose.addEventListener("click", closePopup);
playAlbum.addEventListener("click", handlePlayAlbum);
importImage.addEventListener("click", function () {
    uploadFile.click();
});
uploadFile.addEventListener("change", handleImportImage);
downloadImage.addEventListener("click", handleDownloadImage);

addImage.addEventListener("click", addImageToList);
deleteImage.addEventListener("click", deleteActiveImage);

function handlePlayAlbum() {
    let div = document.createElement("div");
    let imgOnDiv = document.createElement("img");
    div.innerHTML = "";
    div.style.display = "flex";
    div.style.alignContent = "center";
    div.style.justifyContent = "center";
    div.style.position = "fixed";
    div.style.zIndex = "12";
    div.style.height = "100%"
    div.style.width = "100%"
    div.style.backgroundColor = "#111111d7";
    imgOnDiv.style.maxHeight = "100%";
    imgOnDiv.style.objectFit = "contain";
    div.appendChild(imgOnDiv);
    document.body.insertBefore(div, document.body.firstChild);

    let i = 0;
    let id = setInterval(function () {
        if (i < divImgListContainer.children.length) {
            imgOnDiv.src = divImgListContainer.children[i].src;
            i++;
        } else if (i == divImgListContainer.children.length) {
            document.body.removeChild(div);
            clearInterval(id);
        }
    }, 1000);
}

function addImageToList() {
    let imgLink = prompt("Please enter image url");
    if (imgLink == null) {
        return;
    }
    imgLink = imgLink.trim();

    if (imgLink == "") {
        alert("Please enter img src");
        return;
    }

    // add in HTML
    imgId++;
    addImageHTML(imgId, imgLink);

    // add in Ram
    let imgObj = {
        imgId: imgId,
        imgLink: imgLink,
        albumId: albumId
    };
    images.push(imgObj);

    // update in local storage
    saveImagesInLocalStorage();
}

function addImageHTML(imgId, imgLink) {
    // add in img list
    let previewImg = document.createElement("img");
    previewImg.setAttribute("class", "img_preview");
    previewImg.setAttribute("imgId", imgId);

    previewImg.setAttribute("src", imgLink);
    divImgListContainer.appendChild(previewImg);

    // img show
    // to enable image change on click

    previewImg.addEventListener("click", handlePrevieImgClick);
    previewImg.click();
}

function handlePrevieImgClick() {
    removeActiveClass();
    let previewImg = this;
    let imgLink = previewImg.getAttribute("src");
    let imgId = previewImg.getAttribute("imgId");
    let innerHTMLBlock = `<img class="final_image" src=${imgLink} alt="" imgId=${imgId}></img>`;
    parentImg.innerHTML = innerHTMLBlock;
    previewImg.classList.add("active");
}

function deleteActiveImage() {
    let activeImg = getActiveImage();
    console.log(activeImg);
    if (activeImg == false) return;

    let sure = confirm("Are you sure you want to delete this permanently ?");
    if (sure === false) return;


    // delete in img list container
    divImgListContainer.removeChild(activeImg);
    if (divImgListContainer.children.length == 0) {
        parentImg.innerHTML = "";
    }

    // delete in ram
    let imgId = parseInt(activeImg.getAttribute("imgId"));
    let imgIdx = images.findIndex(img => img.albumId == albumId && img.imgId == imgId);
    images.splice(imgIdx, 1);

    // save update
    saveImagesInLocalStorage();

    setFirstAsActiveAndClicked();
}

rightArrow.addEventListener("click", handleRightArrowClick);
function handleRightArrowClick() {
    if (parentImg.children.length > 0) {
        let cShowImg = parentImg.children[0];
        let imgId = cShowImg.getAttribute("imgId");
        for (let i = 0; i < divImgListContainer.children.length; i++) {
            if (divImgListContainer.children[i].getAttribute("imgId") == imgId) {
                let nextIndex = (i + 1) % divImgListContainer.children.length;
                let nextImg = divImgListContainer.children[nextIndex];
                nextImg.click();
                break;
            }
        }
    }
}

leftArrow.addEventListener("click", handleLeftArrowClick);
function handleLeftArrowClick() {
    if (parentImg.children.length > 0) {
        let cShowImg = parentImg.children[0];
        let imgId = cShowImg.getAttribute("imgId");
        for (let i = 0; i < divImgListContainer.children.length; i++) {
            if (divImgListContainer.children[i].getAttribute("imgId") == imgId) {
                let prevIndex = (i - 1) % divImgListContainer.children.length;
                if (prevIndex < 0) {
                    prevIndex = prevIndex + divImgListContainer.children.length;
                }
                let prevImg = divImgListContainer.children[prevIndex];
                prevImg.click();
                break;
            }
        }
    }
}

rightImgShow.addEventListener("click", function() {
    if (parentImg.children.length > 0) {
        let cShowImg = parentImg.children[0];
        let imgId = cShowImg.getAttribute("imgId");
        for (let i = 0; i < divImgListContainer.children.length; i++) {
            if (divImgListContainer.children[i].getAttribute("imgId") == imgId) {
                let nextIndex = (i + 1) % divImgListContainer.children.length;
                let nextImg = divImgListContainer.children[nextIndex];
                nextImg.click();
                break;
            }
        }
    }
})

leftImgShow.addEventListener("click", function() {
    if (parentImg.children.length > 0) {
        let cShowImg = parentImg.children[0];
        let imgId = cShowImg.getAttribute("imgId");
        for (let i = 0; i < divImgListContainer.children.length; i++) {
            if (divImgListContainer.children[i].getAttribute("imgId") == imgId) {
                let prevIndex = (i - 1) % divImgListContainer.children.length;
                if (prevIndex < 0) {
                    prevIndex = prevIndex + divImgListContainer.children.length;
                }
                let prevImg = divImgListContainer.children[prevIndex];
                prevImg.click();
                break;
            }
        }
    }
})

function removeActiveClass() {
    let allImagesInList = document.querySelector("#img-list-container");
    if (allImagesInList.children.length == 0) {
        return;
    }
    for (let i = 0; i < allImagesInList.children.length; i++) {
        allImagesInList.children[i].classList.remove("active");
    }
}

function getActiveImage() {
    if (divImgListContainer.children.length == 0) {
        return false;
    }
    for (let i = 0; i < divImgListContainer.children.length; i++) {
        if (divImgListContainer.children[i].classList.contains("active") == true) {
            return divImgListContainer.children[i];
        }
    }
    return false;
}

function setFirstAsActiveAndClicked() {
    removeActiveClass();
    if (divImgListContainer.children.length == 0) {
        leftArrow.style.display = "none";
        rightArrow.style.display = "none";
        return;
    }
    divImgListContainer.children[0].classList.add("active");
    divImgListContainer.children[0].click();
    leftArrow.style.display = "block";
    rightArrow.style.display = "block";
}


function openAlbumApp(resourceBox) {
    albumId = parseInt(resourceBox.getAttribute("rid"));
    openPopup();
    let rname = resourceBox.querySelector("[purpose='name']").innerHTML;
    divImgListContainer.innerHTML = "";
    parentImg.innerHTML = "";
    divAlbumAppTitle.innerHTML = rname;
    loadFromimages();
    setFirstAsActiveAndClicked();
}

function closePopup() {
    divAlbumApp.style.display = "none";
    appOverlay.style.display = "none";
}

function openPopup() {
    divAlbumApp.style.display = "block";
    appOverlay.style.display = "block";
}

function handleImportImage() {
    let reader = new FileReader();
    reader.addEventListener("load", function () {
        let uploadImgLink = reader.result;

        // add in HTML
        imgId++;
        addImageHTML(imgId, uploadImgLink);

        // add in RAM
        let imgObj = {
            imgId: imgId,
            imgLink: uploadImgLink,
            albumId: albumId
        };
        images.push(imgObj);

        //update in local storage
        saveImagesInLocalStorage();

    })
    reader.readAsDataURL(window.event.target.files[0]);
}

function handleDownloadImage() {
    let activeImg = getActiveImage();
    if(activeImg == false) return;

    let a = document.createElement('a');
    // a.setAttribute("href", "data:image/jpeg;base64,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");
    a.setAttribute("href", activeImg.getAttribute("src"));
    a.setAttribute("download", "output.jpeg");
    a.setAttribute("target","_blank");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function saveImagesInLocalStorage() {
    let imagesString = JSON.stringify(images);
    localStorage.setItem("images", imagesString);
}

function loadFromimages() {
    let imagesString = localStorage.getItem("images");
    if (!imagesString) {
        return;
    }
    images = JSON.parse(imagesString);
    let imagesOfThisAlbum = images.filter(img => img.albumId == albumId);
    for (let i = 0; i < imagesOfThisAlbum.length; i++) {
        let imgObject = imagesOfThisAlbum[i];
        addImageHTML(imgObject.imgId, imgObject.imgLink);
        if (imgObject.imgId > imgId) {
            imgId = imgObject.imgId;
        }
    }
}

