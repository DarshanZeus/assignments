class Table {
    canvas = document.getElementById("canvas");
    canvasTop = document.getElementById("canvasTop");
    canvasLeft = document.getElementById("canvasLeft");

    ctxCanvas = canvas.getContext("2d");
    ctxCanvasTop = canvasTop.getContext("2d");
    ctxCanvasLeft = canvasLeft.getContext("2d");

    
    ctxCanvas = canvas.getContext("2d");
    // var ctxx = canvas.getContext("2d");
    
    // Define the table dimensions
    columnWidth = 220;
    rowHeight = 40;

    startCellsX = -1;
    startCellsY = -1;
    endCellsX = -1;
    endCellsY = -1;
    selection = 0;

    tableWidth = 4440;
    tableHeight = 8000;
    data = [ [ ] ];
    // var tableHeight = canvas.height;

    ipBox = document.getElementById("ipBox");


    constructor() {
        if (!this.canvas) {
            console.error("No element found with ID 'canvas'");
            return;
        }
        if (!this.ctxCanvas) {
            console.error("Could not get context for canvas");
            return;
        }
        this.ctxCanvas.font = "16px Arial bold";
        this.ctxCanvas.textAlign = "center";
        this.ctxCanvas.textBaseline = "middle";
        this.ctxCanvas.lineWidth = 2;
        
        // console.log("beginned");
        // drawGrid();



        
            axios.get("http://localhost:5003/userDetail")
            .then((response) => {
                console.log(response.data);
                this.drawTableData(response.data);
                
            })
            .catch(
                (error) => {
                    console.error("Error:", error);
                }
            );
        // });
    }

    drawBorder(ctx, xPos, yPos, width, height, thickness = 1, color='#FF4C4C') {
        ctx.fillStyle=color;
        ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
    }

    drawTopHeadingsGrid(){
        this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        
        for (var x = 0; x <= this.tableWidth; x += this.columnWidth) {
            this.ctxCanvasTop.moveTo(x, 0);
            this.ctxCanvasTop.lineTo(x, this.tableHeight);
            // this.drawBorder(this.ctxCanvasTop , x * this.columnWidth, 0 * this.rowHeight, this.columnWidth, this.rowHeight,3,"#ff0000");
        }
        this.ctxCanvasTop.strokeStyle = "#000";
        this.ctxCanvasTop.stroke();
    }

    drawLeftHeadingsGrid(){
        this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);

        for (var y = 0; y <= this.tableHeight; y += this.rowHeight) {
            this.ctxCanvasLeft.moveTo(0, y);
            this.ctxCanvasLeft.lineTo(this.tableWidth, y);
        }
        this.ctxCanvasLeft.strokeStyle = "#000";
        this.ctxCanvasLeft.stroke();
    }

    drawGrid() {
        this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var x = 0; x <= this.tableWidth; x += this.columnWidth) {
            this.ctxCanvas.moveTo(x, 0);
            this.ctxCanvas.lineTo(x, this.tableHeight);
        }
        for (var y = 0; y <= this.tableHeight; y += this.rowHeight) {
            this.ctxCanvas.moveTo(0, y);
            this.ctxCanvas.lineTo(this.tableWidth, y);
        }
        this.ctxCanvas.strokeStyle = "#000";
        this.ctxCanvas.stroke();
        // this.ctxCanvas.fillStyle = "#F3FEB8";
        // this.ctxCanvas.fillRect(0,0,this.tableWidth,this.tableHeight);
    }

    drawTableData(tableData, startX = 0 , startY = 0 ) {
        this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.data=tableData;
        this.ctxCanvas.fillStyle = "rgba(0,0,0,1)";
        for (var i = 0; i < tableData.length; i++,startX++) {
            // ctx.fillText(columnHeaders[i], columnWidth * i + columnWidth / 2, rowHeight / 2);
            for (var j = 0; j < tableData[0].length; j++,startY++) {

                // if(startCellsX<=i && i<=endCellsX && startCellsY<=j && j<=endCellsY){
                //     console.log(startCellsX,startCellsY)
                //     ctxx.fillStyle = "rgb(243, 254, 184)";
                //     ctxx.fillRect(i * columnWidth, j * rowHeight, columnWidth, rowHeight);
                //     //
                // }
                // // console.log(i,j);
                // ctx.fillStyle = "rgba(0,0,0,1)";
                if(startX>tableData.length || startY>tableData/length) break;
                this.ctxCanvas.fillText(
                    tableData[startX][startY],
                    j * this.columnWidth + this.columnWidth / 2,
                    i * this.rowHeight + this.rowHeight / 2
                );
            }
        }
    }
}

const table = new Table();
table.drawTopHeadingsGrid();
table.drawLeftHeadingsGrid();
table.drawGrid();

table.drawTableData(table.data,3,3);
// let year = date.getFullYear();

// const myCar = new Car("Ford", 2014);
// document.getElementById("demo").innerHTML =
//   "My car is " + myCar.age(year) + " years old.";
