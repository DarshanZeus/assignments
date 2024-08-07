import Table from "./Table.js";



// async function createTableObject(){
//     await table = new Table();
// }
// const table = new Table();
// const table = createTableObject();

// console.log(table.data)
// table.drawTableData(table.data,3,3);
// let year = date.getFullYear();

// const myCar = new Car("Ford", 2014);
// document.getElementById("demo").innerHTML =
//   "My car is " + myCar.age(year) + " years old.";

// async function loadTableData(tableInstance, x = 0, y = 0) {
//     await tableInstance.loadData(x,y);
//     tableInstance.drawTableTopHeading(x,y);
//     tableInstance.drawTableLeftHeading(x,y);
//     tableInstance.drawTableData(x,y);
// }


async function createTableInstance(mainCanvasName = `canvas`) {
    const tableInstance = new Table(mainCanvasName);
    window.t = tableInstance
    return tableInstance;
    // tableInstance.drawGrid();
    // tableInstance.drawTopHeadingsGrid();
    // tableInstance.drawLeftHeadingsGrid();
    // await loadTableData(tableInstance);
    // return tableInstance;
}

async function loadCanvases(arrCanvas){

    const canvasDiv = document.getElementById("canvasDiv");
    const canvasD = document.getElementById("canvasD");

    let canvasRow = document.createElement("div");
    canvasRow.classList.add("canvasRow", `canvasRow${arrCanvas.length}`);

    let canvas1 = document.createElement("canvas");
    canvas1.id = `canvas${arrCanvas.length}`;
    canvas1.height = 880;
    canvas1.width = 3900;
    // canvasD.appendChild(canvas1);
    canvasRow.appendChild(canvas1);
    canvasD.appendChild(canvasRow);

    let table = await createTableInstance(`canvas${arrCanvas.length}`);
    arrCanvas.push(canvas1);
}

// Usage example
async function main() {


    var arrCanvas = [];
    
    let table = new Table('canvas');
    arrCanvas.push(table);
    arrCanvas[0].show();
    
    let insertSheetBtn = document.getElementById("insertSheet");
    let deleteLastSheetBtn = document.getElementById("deleteLastSheet");
    
    insertSheetBtn.addEventListener("click", async (e) => {
        arrCanvas[arrCanvas.length - 1].hide();
        let newSheet = await createTableInstance();
        arrCanvas.push(newSheet);

        arrCanvas[arrCanvas.length - 1].show();
        console.log(arrCanvas.length);

    });

    deleteLastSheetBtn.addEventListener("click", async (e) => {
        console.log("delete");
        arrCanvas[arrCanvas.length - 1].hide();
        
        if(arrCanvas.length > 1) arrCanvas.pop();

        arrCanvas[arrCanvas.length - 1].show();
        console.log(arrCanvas.length);
    });

    let x = document.createElement('div')

}

main();