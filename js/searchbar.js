let inputText = document.querySelector("#search-input");
let searchBtn = document.querySelector("#search");
let footerHomeIcon = document.querySelector("#footer-home-icon");
let body = document.querySelector("body");

searchBtn.addEventListener("click", searchResource);

function searchResource() {
    searchText = inputText.value;
    if (!searchText) {
        inputText.value = "";
        alert("Input not valid!!");
        return;
    }
    searchText = searchText.trim();
    divbreadcrumb.style.opacity = "0";
    divbreadcrumb.style['pointer-events'] = 'none';


    let arr = resources.filter(r => r.rname.includes(searchText) == true);


    if (arr.length == 0) {
        resourceContainer.innerHTML = `<div style="color:white; background-color:black; position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); font-size:2rem; border-radius:1rem; padding:1rem;">No Matching Results Found</div>`;
        return;
    }

    resourceContainer.innerHTML = "";
    divSearchTitle.style.display = "block";
    divSearchTitle.innerHTML = `<div style="color:blue; font-size:20px; position:absolute; top:14%; left:2%">Search Result for '${searchText}'</div>`;
    body.appendChild(divSearchTitle);
    for (let i = 0; i < arr.length; i++) {
        addResourceHTML(arr[i].rname, arr[i].rtype, arr[i].rid, arr[i].pid);
    }
    inputText.value = "";
}

footerHomeIcon.addEventListener("click", function () {
    location.reload();
})