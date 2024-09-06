var FindipBox = document.getElementById("findTextId");
var searchSuggestion = document.getElementById("searchSuggestion");

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