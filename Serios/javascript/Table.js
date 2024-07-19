export default class Table {
    
    canvasDiv = document.getElementById("canvasDiv");
    canvasD = document.getElementById("canvasD");

    

    
    // ctxCanvas = this.canvas.getContext("2d");
    // var ctxx = canvas.getContext("2d");
    
    // Define the table dimensions

    canvas ;
    canvasTop = document.getElementById("canvasTop");
    canvasLeft = document.getElementById("canvasLeft");

    ctxCanvasTop = this.canvasTop.getContext("2d");
    ctxCanvasLeft = this.canvasLeft.getContext("2d");
    ctxCanvas ;
    // ctxCanvasTop ;
    // ctxCanvasLeft ;
    columnWidth = 150;
    rowHeight = 20;

    startCellsX = -1;
    startCellsY = -1;
    endCellsX = -1;
    endCellsY = -1;
    selection = 0;

    tableWidth = 3900;
    tableHeight = 880;
    data = [ [ ] ];

    startX = 0;
    startY = 0;
    endX = 0;
    endY = 0;

    prevSize = 0;

    startTopX = 0;
    startLeftY = 0;
    endTopX = 0;
    endTopY = 0;
    // var tableHeight = canvas.height;
    topSizeMap = new Object();
    leftSizeMap = new Object();

    ipBox = document.getElementById("ipBox");

    


    constructor(mainCanvasName) {
        console.log("called constructer");

        this.canvas = document.getElementById(`${mainCanvasName}`);
        this.canvasTop = document.getElementById("canvasTop");
        this.canvasLeft = document.getElementById("canvasLeft");


        if (!this.canvas) {
            console.error("No element found with ID 'canvas'");
            return;
        }
        
        this.canvas.height=this.tableHeight;
        this.canvas.width=this.tableWidth;

        this.ctxCanvas = this.canvas.getContext("2d");
        // this.ctxCanvasTop = this.canvasTop.getContext("2d");
        // this.ctxCanvasLeft = this.canvasLeft.getContext("2d");

        if (!this.ctxCanvas) {
            console.error("Could not get context for canvas");
            return;
        }

        

        

        
        
        
        
        // console.log("beginned");
        // drawGrid();
            // await this.data = getTableData();
        // this.scrollXaxis();
        
        this.topSizeMap[3] = 40;
        this.leftSizeMap[4] = 40;
        
        this.isIntersectRegion = this.isIntersectRegion.bind(this);
        this.resizeColumnPointerDown = this.resizeColumnPointerDown.bind(this);
        this.resizeColumnPointerMove = this.resizeColumnPointerMove.bind(this);
        this.resizeColumnPointerUp = this.resizeColumnPointerUp.bind(this);
        this.getColumnNumber = this.getColumnNumber.bind(this);

        
        this.drawTopHeadingsGrid = this.drawTopHeadingsGrid.bind(this);
        this.drawTableTopHeading = this.drawTableTopHeading.bind(this);
        this.drawTopHeadingsGrid = this.drawTopHeadingsGrid.bind(this);
        this.drawTopHeadingsGrid = this.drawTopHeadingsGrid.bind(this);
        this.drawTopHeadingsGrid = this.drawTopHeadingsGrid.bind(this);

        this.addEventListeners();
        this.drawGrid();
        this.drawTopHeadingsGrid();
        this.drawLeftHeadingsGrid();
        // this.ctxCanvasTop.stroke();

        this.ctxCanvas.font = "15px Calibri";
        this.ctxCanvas.textAlign = "center";
        this.ctxCanvas.textBaseline = "Top";
        this.ctxCanvas.lineWidth = 1;

        this.ctxCanvasTop.font = "16px Calibri";
        this.ctxCanvasTop.textAlign = "center";
        this.ctxCanvasTop.textBaseline = "middle";
        this.ctxCanvasTop.lineWidth = 1;

        this.ctxCanvasLeft.font = "16px Calibri";
        this.ctxCanvasLeft.textAlign = "center";
        this.ctxCanvasLeft.textBaseline = "middle";
        this.ctxCanvasLeft.lineWidth = 1;

        this.drawTableTopHeading();
        this.drawTableLeftHeading();
        
        
    }

    scrollXaxis(){
        this.canvasDiv.addEventListener("scroll", (e) => {
            // console.log(this.canvasDiv.scrollHeight,this.canvasD.clientHeight,document.documentElement.scrollHeight);
            
            
            // console.log(this.canvasDiv.scrollTop,this.canvasD.clientHeight,this.canvasDiv.scrollHeight);
            if(this.canvasDiv.scrollTop + 880 >= this.canvasDiv.scrollHeight){
                console.log("add down");
                const canvas1 = document.createElement("canvas");
                canvas1.id = "canvas";
                canvas1.height = 880;
                canvas1.width = 3900;
                if(canvasD) canvasD.appendChild(canvas1);
                else console.log("nahi dikh raha")
                // const tableInstance = new Table();
            }
            console.log(this.canvasDiv.clientWidth);
            console.log(this.canvasDiv.scrollLeft, this.canvasDiv.scrollWidth)

            if(this.canvasDiv.scrollLeft + this.canvasDiv.clientWidth >= this.canvasDiv.scrollWidth){
                console.log("add right");
                const canvas1 = document.createElement("canvas");
                canvas1.id = "canvas";
                canvas1.height = 880;
                canvas1.width = 3900;
                if(canvasD) canvasD.appendChild(canvas1);
                else console.log("nahi dikh raha")
                // const tableInstance = new Table();
            }
        });
    }

    addEventListeners() {
        this.canvasTop.addEventListener("pointerdown", this.resizeColumnPointerDown);
        this.canvasTop.addEventListener('pointermove', this.resizeColumnPointerMove);
        this.canvasTop.addEventListener('pointerup', this.resizeColumnPointerUp);


        this.canvasTop.addEventListener("pointerdown", this.resizeRowPointerDown);
        this.canvasTop.addEventListener('pointermove', this.resizeRowPointerMove);
        this.canvasTop.addEventListener('pointerup', this.resizeRowPointerUp);
        // this.deleteButton.addEventListener('click', this.handleDelete);

        
        // this.canvasTop.addEventListener("mousedown", (e) => {
        //     console.log(e.offsetX);
        //     // console.log(e.offsetX,  this.getColumnNumber(e.offsetX));
        //     if(this.isIntersectRegion(e.offsetX)){
        //         let clickX = this.getColumnNumber(e.offsetX - 20);
        //         // console.log(clickX);
        //         this.startCellsX = this.getColumnNumber(e.offsetX - 20);
        //         this.startTopX = e.offsetX;
        //         this.selection = 1;
        //         this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        //         // this.ctxCanvasLeft.stroke();
        //         // console.log(e.offsetX, this.convertToTitle(clickX+1));
        //         // this.drawTopHeadingsGrid();
        //         // this.drawTableHeading();
        //     }
            
        // });
        // this.canvasTop.addEventListener('mousemove', (e) => {
        //     if(this.selection == 1){
        //         // Math.min((this.startTopX - e.offsetX),20);
        //         console.log(this.startTopX);
        //         this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        //         // this.drawTopHeadingsGrid();
        //         // this.drawTableTopHeading();
                
        //         // this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
                
        //         // this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        //     }
        // });
        // this.canvasTop.addEventListener('mouseup', (e) => {
        //     console.log(e.offsetX);
            
        //     if(this.topSizeMap[this.startCellsX + 1]) this.topSizeMap[this.startCellsX + 1] += (e.offsetX - this.startTopX);
        //     else this.topSizeMap[this.startCellsX + 1] = (e.offsetX - this.startTopX);
        //     this.selection = 0;
        //     // this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        //     // this.ctxCanvasLeft.stroke();
        //     this.drawTopHeadingsGrid();
        //     this.drawTableTopHeading();
        //     // this.drawGrid();
        //     // this.drawTableData();
        //     console.log(this.topSizeMap);
    
        // });
    }

    getColumnNumber(clickX) {
        let pixelCount = 0;
        let pre = 0;
        let end = 0;
        for(let i = 0; i < this.tableWidth ; ++i){
            
            pre = end;
            end += this.columnWidth + (this.topSizeMap[i + 1] || 0);

            if((pre <= clickX) && (clickX <= end)){ 
                return i;
            }
        }
        return 0;
    }

    getRowNumber(clickY){
        let pre = 0;
        let end = 0;
        for(let i = 0; i < this.tableHeight; ++i){
            pre = end;
            end += this.rowHeight + (this.leftSizeMap[i + 1] || 0);
            
            if((pre <= clickY) && (clickY <= end)){ 
                return i;
            }
        }
        return 0;
    }

    isIntersectRegion(clickX){
        let pixelCount = 0;

        for(let i = 0; pixelCount - this.columnWidth < this.tableWidth ; ++i){
            pixelCount+= (this.topSizeMap[i] || this.columnWidth);
            // console.log(i,pixelCount);
            if(((pixelCount-10) <= clickX) && (clickX <= (pixelCount + 10))) return true;

            // if(pixelCount >= clickX) return false;
        }
        return false;
    }
    
    isIntersectRegionLeft(clickY){
        let pixelCount = 0;

        for(let i = 0; pixelCount - this.rowHeight < this.tableHeight ; ++i){
            pixelCount+= (this.leftSizeMap[i] || this.rowHeight);
            // console.log(i,pixelCount);
            if(((pixelCount-10) <= clickY) && (clickY <= (pixelCount + 10))) return true;
        }

        return false;
    }

    resizeColumnPointerDown(e){
        console.log(e.offsetX);
        // console.log(e.offsetX,  this.getColumnNumber(e.offsetX));
        if(this.isIntersectRegion(e.offsetX)){
            let clickX = this.getColumnNumber(e.offsetX - 20);
            // console.log(clickX);
            this.startCellsX = this.getColumnNumber(e.offsetX - 20);
            this.startTopX = e.offsetX;
            this.selection = 1;
            this.prevSize = (this.topSizeMap[this.startCellsX + 1] || 0);
            // console.log(e.offsetX, this.convertToTitle(clickX+1));
            // this.drawTopHeadingsGrid();
            // this.drawTableHeading();
        }
        
    }

    resizeColumnPointerMove(e){
        if(this.selection === 1){
            // Math.min((this.startTopX - e.offsetX),20);
            const newWidth = e.offsetX - this.startTopX + this.prevSize
            // + (this.topSizeMap[this.startCellsX + 1] || 0)
            ;
            this.topSizeMap[this.startCellsX + 1] = newWidth;
            console.log(this.startTopX);
            
            this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
            // this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
            this.drawTopHeadingsGrid();
            this.drawTableTopHeading();
            this.drawGrid()
            
            // this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
            
            // this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        }
    }

    resizeColumnPointerUp(e){
        if(this.selection === 1){
            console.log(e.offsetX);
            // (this.topSizeMap[this.startCellsX + 1] || 0)
            const newWidth = e.offsetX - this.startTopX + this.prevSize;
            this.topSizeMap[this.startCellsX + 1] = newWidth ;
            this.selection = 0;
            this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
            this.drawTopHeadingsGrid();
            this.drawTableTopHeading();
            this.drawGrid();
            // this.drawTableData();
            console.log(this.topSizeMap);
        }
        

    }

    resizeRowPointerDown(e){
        console.log(e.offsetY);
        // console.log(e.offsetX,  this.getColumnNumber(e.offsetX));
        // if(this.isIntersectRegionLeft(e.offsetY)){
        //     let clickX = this.getRNumber(e.offsetX - 20);
        //     // console.log(clickX);
        //     this.startCellsX = this.getColumnNumber(e.offsetX - 20);
        //     this.startTopX = e.offsetX;
        //     this.selection = 1;
        //     this.prevSize = (this.topSizeMap[this.startCellsX + 1] || 0);
        //     // console.log(e.offsetX, this.convertToTitle(clickX+1));
        //     // this.drawTopHeadingsGrid();
        //     // this.drawTableHeading();
        // }
    }

    resizeRowPointerMove(e){
        
    }

    resizeRowPointerUp(e){
        
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

    shortenText(textToBeShort, length){
        if(textToBeShort.length < length ) return textToBeShort;
        return textToBeShort.substring(0,length) + "...";
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

    // drawTopHeadingsGrid(){
    //     this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        
    //     for (var x = 0; x <= this.tableWidth; x += this.columnWidth) {
    //         x += (this.topSizeMap[this.getColumnNumber(x) + 1] || 0);
    //         // console.log(x);
    //         this.ctxCanvasTop.moveTo(x, 0);
    //         this.ctxCanvasTop.lineTo(x, this.tableHeight);
    //         // this.drawBorder(this.ctxCanvasTop , x * this.columnWidth, 0 * this.rowHeight, this.columnWidth, this.rowHeight,3,"#ff0000");
    //     }
        
    //     this.ctxCanvasTop.lineWidth = 1;
    //     this.ctxCanvasTop.strokeStyle = "rgb(200,200,200)";
    //     this.ctxCanvasTop.stroke();
    // }

    resetCanvasStroke(ctx) {
        ctx.strokeStyle = '#000000'; // default stroke color
        ctx.lineWidth = 1;           // default line width
        ctx.lineCap = 'butt';        // default line cap
        ctx.lineJoin = 'miter';      // default line join
        ctx.miterLimit = 10;         // default miter limit
        ctx.setLineDash([]);         // default line dash (no dash)
        ctx.lineDashOffset = 0;      // default line dash offset
    }

    drawTopHeadingsGrid() {
        // console.log('called top grid')
        // let tempCtx = this.canvasTop.getContext("2d");
        // tempCtx.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        // // let x = 0;
        // for (let i = 0; x <= this.tableWidth; i++) {
        //     const columnWidth = this.columnWidth + (this.topSizeMap[i + 1] || 0);
        //     x += columnWidth;
        //     tempCtx.moveTo(x, 0);
        //     tempCtx.lineTo(x, this.rowHeight);
        // }
        // tempCtx.lineWidth = 1;
        // tempCtx.strokeStyle = "rgb(200,200,200)";
        // tempCtx.stroke();
        // this.resetCanvasStroke(tempCtx);



        this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        // this.ctxCanvasTop.save();
        // let x = 0;
        // for (let i = 0; x <= this.tableWidth; i++) {
        //     const columnWidth = this.columnWidth + (this.topSizeMap[i + 1] || 0);
        //     x += columnWidth;
        //     this.ctxCanvasTop.moveTo(x, 0);
        //     this.ctxCanvasTop.lineTo(x, this.rowHeight);
        // }
        // this.ctxCanvasTop.lineWidth = 1;
        // this.ctxCanvasTop.strokeStyle = "rgb(200,200,200)";
        // this.ctxCanvasTop.stroke();
        // this.ctxCanvasTop.restore();
        // this.resetCanvasStroke(this.ctxCanvasTop);
        let cellPositionX = 0;
        for(let x = 0; cellPositionX <= this.canvasTop.width; x++){
            cellPositionX += this.columnWidth + (this.topSizeMap[x+1] || 0);
            this.ctxCanvasTop.save();
            this.ctxCanvasTop.beginPath();
            this.ctxCanvasTop.moveTo(cellPositionX,0);
            this.ctxCanvasTop.lineTo(cellPositionX, this.canvasTop.height);
            this.ctxCanvasTop.lineWidth=1;
            this.ctxCanvasTop.strokeStyle = "rgb(200,200,200)";
            this.ctxCanvasTop.stroke();
            this.ctxCanvasTop.restore();
        }
    }

    drawLeftHeadingsGrid(){
        // this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);

        // for (var y = 0; y <= this.tableHeight; y += this.rowHeight) {
        //     this.ctxCanvasLeft.moveTo(0, y);
        //     this.ctxCanvasLeft.lineTo(this.tableWidth, y);
        // }
        // this.ctxCanvasLeft.strokeStyle = "rgb(200,200,200)";
        // this.ctxCanvasLeft.stroke();

        let cellPositionY = 0;
        for(let y = 0; cellPositionY <= this.canvasLeft.height; y++){
            cellPositionY += this.rowHeight + (this.leftSizeMap[y+1] || 0);
            this.ctxCanvasLeft.save();
            this.ctxCanvasLeft.beginPath();
            this.ctxCanvasLeft.moveTo(0,cellPositionY);
            this.ctxCanvasLeft.lineTo(this.canvasLeft.width, cellPositionY);
            this.ctxCanvasLeft.lineWidth=1;
            this.ctxCanvasLeft.strokeStyle = "rgb(200,200,200)";
            this.ctxCanvasLeft.stroke();
            this.ctxCanvasLeft.restore();
        }
    }

    drawGrid() {
        this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // for (var x = 1; x <= this.tableWidth; x += this.columnWidth) {
        //     // console.log(x);
        //     this.ctxCanvas.moveTo(x , 0);
        //     this.ctxCanvas.lineTo(x, this.tableHeight);
        //     x += (this.topSizeMap[this.getColumnNumber(x) + 1] || 0);
        // }
        // for (var y = 1; y <= this.tableHeight; y += this.rowHeight) {
        //     this.ctxCanvas.moveTo(0, y);
        //     this.ctxCanvas.lineTo(this.tableWidth, y);
        // }
        
        // this.ctxCanvas.lineWidth = 1;
        // this.ctxCanvas.strokeStyle = "rgb(200,200,200)";
        // this.ctxCanvas.stroke();

        let cellPositionX = 0;
        let cellPositionY = 0;

        for(let x = 1; cellPositionX <= this.canvasTop.width; x++){
            cellPositionX += this.columnWidth + (this.topSizeMap[x] || 0);
            this.ctxCanvas.save();
            this.ctxCanvas.beginPath();
            this.ctxCanvas.moveTo(cellPositionX,0);
            this.ctxCanvas.lineTo(cellPositionX, this.canvas.height);
            this.ctxCanvas.lineWidth=1;
            this.ctxCanvas.strokeStyle = "rgb(200,200,200)";
            this.ctxCanvas.stroke();
            this.ctxCanvas.restore();
        }
        // this.ctxCanvas.fillStyle = "#F3FEB8";
        // this.ctxCanvas.fillRect(0,0,this.tableWidth,this.tableHeight);
    }

    // drawTableTopHeading(startX = 0 , startY = 0){
    //     this.startX=startX;
    //     this.startY=startY;
    //     // console.log(this.canvasTop.width, this.canvasTop.height);
    //     this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
    //     this.drawTopHeadingsGrid();
    //     this.ctxCanvasTop.fillStyle = "rgba(110,110,110,1)";
    //     var start = startY;
    //     var end = startY + Math.floor((this.tableWidth + this.columnWidth - 1) / this.columnWidth);
    //     // console.log(this.convertToTitle(start+1),this.convertToTitle(end));

    //     let x = 0;

    //     for (var j = 0; start < end; j++, start++) {
    //         x += (this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0);
    //         this.ctxCanvasTop.fillText(
    //             // this.data[this.startX][this.startY],
    //             this.convertToTitle(start+1),
    //             // j * this.columnWidth + this.columnWidth / 2,
    //             x,
    //             this.rowHeight
    //         );
    //         x += (this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0);
    //     }
    // }
    drawTableTopHeading() {
        // this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        this.ctxCanvasTop.fillStyle = "rgba(110,110,110,1)";
        let x = 0;
        for (let i = 0; x <= this.tableWidth; i++) {
            const columnWidth = this.columnWidth + (this.topSizeMap[i + 1] || 0);
            this.ctxCanvasTop.fillText(
                this.convertToTitle(i + 1),
                x + columnWidth / 2,
                this.canvasTop.height / 2
            );
            x += columnWidth;
        }
        
        // this.ctxCanvasTop.stroke();
    }


    drawTableLeftHeading(startX = 0 , startY = 0){
        this.startX=startX;
        this.startY=startY;

        // this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
        // this.drawLeftHeadingsGrid();
        this.ctxCanvasTop.fillStyle = "rgba(110,110,110,1)";
        var start = startX;
        var end = startX + Math.floor((this.tableHeight + this.rowHeight - 1) / this.rowHeight);

        let y = 0;

        for (var j = 0; start < end; j++, start++) {
            const rowHeight = this.rowHeight + (this.leftSizeMap[j+1] || 0);
            this.ctxCanvasLeft.fillText(
                // this.data[this.startX][this.startY],
                start + 1,
                this.canvasLeft.width / 2,
                y + rowHeight / 2
            );
            y += rowHeight;
        }
    }

    // drawTableHeading(startX = 0 , startY = 0){
    //     this.startX=startX;
    //     this.startY=startY;

    //     this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
    //     this.drawTopHeadingsGrid();
    //     this.ctxCanvasTop.fillStyle = "rgba(0,0,0,1)";
    //     var start = startY;
    //     var end = startY + Math.floor((this.tableWidth + this.columnWidth - 1) / this.columnWidth);
    //     // console.log(this.convertToTitle(start+1),this.convertToTitle(end));

    //     let x = 0;
    //     let y = 0;

    //     for (var j = 0; start < end; j++, start++) {
    //         x += (this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0);
    //         this.ctxCanvasTop.fillText(
    //             // this.data[this.startX][this.startY],
    //             this.convertToTitle(start+1),
    //             // j * this.columnWidth + this.columnWidth / 2,
    //             x,
    //             this.rowHeight
    //         );
    //         x += (this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0);
    //     }

    //     this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
    //     this.drawLeftHeadingsGrid();
    //     this.ctxCanvasLeft.fillStyle = "rgba(0,0,0,1)";
    //     start = startX;
    //     end = startX + Math.floor((this.tableHeight + this.rowHeight - 1) / this.rowHeight);

    //     for (var j = 0; start < end; j++, start++) {
    //         this.ctxCanvasLeft.fillText(
    //             // this.data[this.startX][this.startY],
    //             start + 1,
    //             20,
    //             j * this.rowHeight + this.rowHeight / 2
    //         );
    //     }
    // }

    drawTableData(startX = 0 , startY = 0) {
        this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.ctxCanvas.fillStyle = "rgba(0,0,0,1)";
        this.startX=startX;
        this.startY=startY;
        // this.data=tableData;
        // console.log(this.data);
        let x = 0;
        let y = 0;
        let cellPositionX = 0;
        let cellPositionY = 0;

        // for (var i = 0; this.startX < this.data.length; i++,this.startX++) {
        //     // ctx.fillText(columnHeaders[i], columnWidth * i + columnWidth / 2, rowHeight / 2);
        //     for (var j = 0; this.startY < this.data[0].length; j++,this.startY++) {

        //     }
        // }

        
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
                // console.log(this.topSizeMap[j]);
                x += (this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0);
                
                this.ctxCanvas.fillText(
                    this.shortenText(this.data[this.startX][this.startY],17),
                    // j * this.columnWidth + this.columnWidth / 2,
                    x,
                    i * this.rowHeight + (this.rowHeight / 2) + 6
                );
                x += (this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0);
            }
            this.startY=startY;
            x=0;
        }
    }


    // this.canvas.addEvent
    

    
}