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


async function createTableInstance(mainCanvasName = 1) {
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

async function main() {
    handleUploadBar();


    var arrCanvas = [];
    
    let table = new Table(1);
    arrCanvas.push(table);
    arrCanvas[0].show();
    
    let insertSheetBtn = document.getElementById("insertSheet");
    let deleteLastSheetBtn = document.getElementById("deleteLastSheet");
    let UploadBtn = document.getElementById("UploadBtn");
    let curSheetID = document.getElementById("CurrentSheet");
    let fileIP = document.getElementById("ChooseFile");
    let chooseFileLabel = document.getElementById("chooseFileLabel");
    let uploadform = document.getElementById("uploadForm");
    
    
    insertSheetBtn.addEventListener("click", async (e) => {
        arrCanvas[arrCanvas.length - 1].hide();
        let newSheet = await createTableInstance(arrCanvas.length + 1);
        arrCanvas.push(newSheet);

        arrCanvas[arrCanvas.length - 1].show();
        console.log(arrCanvas.length);
        curSheetID.innerHTML = `Sheet - ${arrCanvas.length}`;

    });


    deleteLastSheetBtn.addEventListener("click", async (e) => {
        console.log("delete");
        arrCanvas[arrCanvas.length - 1].hide();
        
        if(arrCanvas.length > 1) arrCanvas.pop();

        arrCanvas[arrCanvas.length - 1].show();
        console.log(arrCanvas.length);
        curSheetID.innerHTML = `Sheet - ${arrCanvas.length}`;
    });
    

    uploadform.addEventListener("submit", async (e) => {
        e.preventDefault(); // Ensure this is at the top to stop the form from submitting
    
        console.log("Upload");
    
        if (fileIP.value === "") {
            console.log("noFile");
            alert("Please choose a file");
        } else {
            const fileInput = document.getElementById("ChooseFile");
            const formData = new FormData();
    
            formData.append("file", fileInput.files[0]);
    
            try {
                handleUploadBar(); // Assuming this is a function to handle the progress bar
    
                await axios.post("http://localhost:5163/api/CSVfileUpload", formData)
                    .then((response) => {
                        console.log(response.data);
                        console.log(response);
                        // loading = true;
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        alert(error);
                    });
    
            } catch (error) {
                console.error("Error ", error);
                alert("Error ", error);
            }
        }
        // e.preventDefault();  // Remove redundant e.preventDefault()
    });
    

}

async function handleUploadBar(){
    var fillBar = document.getElementById("fillBar");
    if(!fillBar){
        var secondTopLine = document.getElementById("secondTopLine");
        var bar = document.createElement("div");
        fillBar = document.createElement("div");
        fillBar.id = "fillBar";
        secondTopLine.append(bar);
        bar.append(fillBar);

        bar.style.marginTop = `40px`;
        bar.style.height = `20px`;
        bar.style.width = `500px`;
        bar.style.border = `1px solid black`;

        fillBar.style.height = `100%`;
        fillBar.style.backgroundColor = '#137e43'
    }
    

    await axios.get(`http://localhost:5163/api/getUploadStatus`)
        .then((response) => {
            fillBar.style.width = `${response.data}%`;
            if(response.data === -1){
                window.location.reload();
                return;
            }
            else if(response.data < 100){
                // setInterval(() => {
                    setTimeout(handleUploadBar(), 1000);
                // },1000);
            }
            else{
                // arrCanvas[arrCanvas.length - 1].show();
                // window.location.reload();
                console.log("object");
                return;
            }
        })
        .catch(
            (error) => {
                console.error("Error:", error);
            }
        );
    
}

main();
