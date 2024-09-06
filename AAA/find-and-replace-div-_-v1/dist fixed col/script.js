var FindipBox = document.getElementById("findTextId");
var searchSuggestion = document.getElementById("searchSuggestion");
var findAllBtn = document.getElementById("findAllBtn");

FindipBox.addEventListener("keyup", (e) => {
    if(FindipBox.value.length >= 2 && FindipBox === document.activeElement){
        searchSuggestion.style.display = `block`;
    }
    else{
        searchSuggestion.style.display = `none`;
    }
});
FindipBox.addEventListener("blur", (e) => {
    searchSuggestion.style.display = `none`;
})

findAllBtn.addEventListener("click",(e) => {
    var checks = document.getElementsByClassName("searchOptions");
    for(let i = 0; i < checks.length; ++i){
        console.log(checks[i].checked, checks[i].value);
    }
})