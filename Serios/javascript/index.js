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






    ///////////////////////////////////////////////////////
    // canvasRow = document.createElement("div");
    // canvasRow.classList.add("canvasRow", `canvasRow${arrCanvas.length}`);

    // canvas1 = document.createElement("canvas");
    // canvas1.id = `canvas${arrCanvas.length}`;
    // canvas1.height = 880;
    // canvas1.width = 3900;

    // canvasRow.appendChild(canvas1);
    // canvasD.appendChild(canvasRow);
    
    // table = await createTableInstance(`canvas${arrCanvas.length}`);
    // arrCanvas.push(canvas1);



    
    //////////////////////////////////////////////////////
    // canvasDiv.addEventListener("scroll", async (e) => {
    //     // console.log(canvasDiv.scrollHeight,canvasD.clientHeight,document.documentElement.scrollHeight);
        
        
    //     // console.log(canvasDiv.scrollTop,canvasD.clientHeight,canvasDiv.scrollHeight);
    //     if(canvasDiv.scrollTop + 880 >= canvasDiv.scrollHeight){
    //         console.log("add down");

    //         const canvasRow = document.createElement("div");
    //         canvasRow.classList.add("canvasRow", `canvasRow${arrCanvas.length}`);

    //         const canvas1 = document.createElement("canvas");
    //         canvas1.id = `canvas${arrCanvas.length}`;
    //         canvas1.height = 880;
    //         canvas1.width = 3900;

    //         canvasRow.appendChild(canvas1);
    //         canvasD.appendChild(canvasRow);
            
    //         // const table = await createTableInstance(`canvas${arrCanvas.length}`);
    //         arrCanvas.push(canvas1);
    //         // const tableInstance = new Table();
    //     }
    //     // console.log(canvasDiv.clientWidth);
    //     // console.log(canvasDiv.scrollLeft, canvasDiv.scrollWidth)

    //     if(canvasDiv.scrollLeft + canvasDiv.clientWidth >= canvasDiv.scrollWidth){
    //         console.log("add right");
    //         const canvas1 = document.createElement("canvas");
    //         console.log(Math.floor(canvasDiv.scrollTop/880));
    //         const canvasRow = document.querySelector(`.canvasRow${Math.floor(canvasDiv.scrollTop/880)}`);
    //         canvas1.id = "canvas";
    //         canvas1.height = 880;
    //         canvas1.width = 3900;

    //         canvasRow.appendChild(canvas1);
    //         // arrCanvas.push(canvas1);
    //     }

    //     console.log(arrCanvas.length);
        
    // });

}
// Usage example
async function main() {

    // const table = await createTableInstance();
    // const canvasD = document.getElementById("canvasD");
    var arrCanvas = [];
    // loadCanvases(arrCanvas);
    // console.log(arrCanvas);
    const table = await createTableInstance();

}

main();