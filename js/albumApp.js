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

let addImage = document.querySelector("#add-img");
let importImage = document.querySelector("#import-img");
let exportImage = document.querySelector("#export-img");
let playAlbum = document.querySelector("#playAlbum");
let deleteImage = document.querySelector("#delete-img");

let albumId = -1;
let imgId = -1;
let images = [];

albumAppClose.addEventListener("click", closePopup);

addImage.addEventListener("click", addImageToList);
deleteImage.addEventListener("click", deleteActiveImage);

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
    // handleImgClick(previewImg);

    // setShowImg(imgLink, imgId);


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

// function loadFromimages() {
//     let resourcesString = localStorage.getItem("data");
//     if (!resourcesString) {
//         return;
//     }
//     let resources = JSON.parse(resourcesString);
//     let resource = resources.find(r => r.rid == albumId);
//     images = resource.images;
//     // let imagesOfThisAlbum = images.filter(img => img.albumId == albumId);
//     for (let i = 0; i < images.length; i++) {
//         let imgObject = images[i];
//         addImageHTML(imgObject.imgId, imgObject.imgLink);
//         if (imgObject.imgId > imgId) {
//             imgId = imgObject.imgId;
//         }
//     }
// }
