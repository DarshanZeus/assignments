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

async function loadTableData(tableInstance, x = 0, y = 0) {
    await tableInstance.loadData(x,y);
    tableInstance.drawTableHeading(x,y);
    tableInstance.drawTableData(x,y);
}


async function createTableInstance() {
    const tableInstance = new Table();
    tableInstance.drawGrid();
    tableInstance.drawTopHeadingsGrid();
    tableInstance.drawLeftHeadingsGrid();
    await loadTableData(tableInstance);
    return tableInstance;
}

function loadCanvases(){

    const canvasDiv = document.getElementById("canvasDiv");
    const canvasD = document.getElementById("canvasD");
    if(canvasDiv.clientHeight*2 >= document.documentElement.scrollHeight){
        console.log("heaven");
        const canvas1 = document.createElement("canvas");
        canvas1.id = "canvas";
        canvas1.height = 880;
        canvas1.width = 4400;
        canvasD.appendChild(canvas1);
    }
    
    // if(canvasDiv.)
}
// Usage example
async function main() {

    // const table = await createTableInstance();
    // const canvasD = document.getElementById("canvasD");
    loadCanvases();
    const table = await createTableInstance();

}

main();