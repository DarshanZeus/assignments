export default class Table {
    canvas = document.getElementById("canvas");
    canvasTop = document.getElementById("canvasTop");
    canvasLeft = document.getElementById("canvasLeft");
    canvasDiv = document.getElementById("canvasDiv");

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
    startX = 0;
    startY = 0;
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
        this.ctxCanvas.font = "14px Arial";
        this.ctxCanvas.textAlign = "center";
        this.ctxCanvas.textBaseline = "middle";
        this.ctxCanvas.lineWidth = 2;

        this.ctxCanvasTop.font = "16px Roman bold";
        this.ctxCanvasTop.textAlign = "center";
        this.ctxCanvasTop.textBaseline = "middle";
        this.ctxCanvasTop.lineWidth = 2;

        this.ctxCanvasLeft.font = "16px Roman bold";
        this.ctxCanvasLeft.textAlign = "center";
        this.ctxCanvasLeft.textBaseline = "middle";
        this.ctxCanvasLeft.lineWidth = 2;
        
        // console.log("beginned");
        // drawGrid();
            // await this.data = getTableData();
        this.scrollXaxis();
        
    }

    scrollXaxis(){
        this.canvasDiv.addEventListener("scroll", (e) => {
            console.log(this.canvasDiv.clientHeight);
        });
    }

    async loadData(startX = 0 , startY = 0){
        this.startX=startX;
        this.startY=startY;
        await axios.get("http://localhost:5003/userDetail")
        .then((response) => {
            this.data = response.data;
            console.log(response.data);
            this.drawTableData();
        })
        .catch(
            (error) => {
                console.error("Error:", error);
            }
        );
    }

    drawBorder(ctx, xPos, yPos, width, height, thickness = 1, color='#FF4C4C') {
        ctx.fillStyle=color;
        ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
    }

    convertToTitle(columnNumber) {
        let res = '';
        while (columnNumber > 0) {
            let r = columnNumber % 26;
            let q = parseInt(columnNumber / 26);
            if (r === 0) {
                r = 26;
                q--;
            }
    
            res = String.fromCharCode(64 + r) + res;
            columnNumber = q;
        }
        return res;
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

    drawTableHeading(startX = 0 , startY = 0){
        this.startX=startX;
        this.startY=startY;

        this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        this.drawTopHeadingsGrid();
        this.ctxCanvasTop.fillStyle = "rgba(0,0,0,1)";
        var start = startY;
        var end = startY + 21;

        for (var j = 0; start < end; j++, start++) {
            this.ctxCanvasTop.fillText(
                // this.data[this.startX][this.startY],
                this.convertToTitle(start+1),
                j * this.columnWidth + this.columnWidth / 2,
                this.rowHeight / 2
            );
        }

        this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
        this.drawLeftHeadingsGrid();
        this.ctxCanvasLeft.fillStyle = "rgba(0,0,0,1)";
        start = startX;
        end = startX + 23;

        for (var j = 0; start < end; j++, start++) {
            this.ctxCanvasLeft.fillText(
                // this.data[this.startX][this.startY],
                start + 1,
                20,
                j * this.rowHeight + this.rowHeight / 2
            );
        }
    }

    drawTableData(startX = 0 , startY = 0) {
        this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.ctxCanvas.fillStyle = "rgba(0,0,0,1)";
        this.startX=startX;
        this.startY=startY;
        // this.data=tableData;
        // console.log(this.data);
        for (var i = 0; this.startX < this.data.length; i++,this.startX++) {
            // ctx.fillText(columnHeaders[i], columnWidth * i + columnWidth / 2, rowHeight / 2);
            for (var j = 0; this.startY < this.data[0].length; j++,this.startY++) {

                // if(startCellsX<=i && i<=endCellsX && startCellsY<=j && j<=endCellsY){
                //     console.log(startCellsX,startCellsY)
                //     ctxx.fillStyle = "rgb(243, 254, 184)";
                //     ctxx.fillRect(i * columnWidth, j * rowHeight, columnWidth, rowHeight);
                //     //
                // }
                // // console.log(i,j);
                // ctx.fillStyle = "rgba(0,0,0,1)";
                // console.log(i,j,this.data[this.startX][this.startY]);
                // if(startX>=tableData.length || startY>=tableData[0].length) break;
                this.ctxCanvas.fillText(
                    this.data[this.startX][this.startY],
                    j * this.columnWidth + this.columnWidth / 2,
                    i * this.rowHeight + this.rowHeight / 2
                );
            }
            this.startY=startY;
        }
    }


    // this.canvas.addEvent
    

    
}