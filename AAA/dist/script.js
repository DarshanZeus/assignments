function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab-content");
    var tabs = document.getElementsByClassName("tab-button");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
        tabs[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.classList.add("active");
}

// Set initial active tab
document.getElementById("find").style.display = "block";

function addResult(sheet, cell, value) {
    var resultTable = document.querySelector(".result-table");
    var newRow = document.createElement("div");
    newRow.classList.add("result-row");

    newRow.innerHTML = `
        <div>${sheet}</div>
        <div>${cell}</div>
        <div>${value}</div>
    `;

    resultTable.appendChild(newRow);
}

// Example usage
addResult('in', 'B41', 'Alex TdA3y');