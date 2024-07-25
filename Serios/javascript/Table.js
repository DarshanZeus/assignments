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

    isClickedOnTopHeadingCanvas = 0;
    isClickedOnLeftHeadingCanvas = 0;
    isClickedOnMainCanvas = 0;

    selection = 0;
    selectionTop = 0;
    selectionLeft = 0;
    
    colSelection = 0;
    isSelectedCol = 0;

    rowSelection = 0;
    isSelectedRow = 0;

    tableWidth = 3900;
    tableHeight = 880;
    data = [ [ ] ];

    startX = -1;
    startY = -1;
    endX = -1;
    endY = -1;

    moveStartX = -1;
    moveStartY = -1;

    startAbsX = -1;
    startAbsY = -1;
    endAbsX = -1;
    endAbsY = -1;

    prevSizeX = 0;
    prevSizeY = 0;

    startTopX = -1;
    startLeftY = -1;
    endTopX = -1;
    endTopY = -1;

    startColX = -1;
    endColX = -1;

    startRowY = -1;
    endRowY = -1;
    // var tableHeight = canvas.height;
    topSizeMap = new Object();
    leftSizeMap = new Object();

    // ipBox = document.getElementById("ipBox");
    ipBox;
    selectionDiv;

    


    constructor(mainCanvasName) {
        console.log("called constructer", window.devicePixelRatio);


        this.canvas = document.getElementById(`${mainCanvasName}`);
        this.canvasTop = document.getElementById("canvasTop");
        this.canvasLeft = document.getElementById("canvasLeft");

        this.ipBox = document.getElementById("ipBox");
        this.selectionDiv = document.getElementById("selectionDiv");
        // console.log(this.ipBox);


        if (!this.canvas) {
            console.error("No element found with ID 'canvas'");
            return;
        }
        
        this.canvas.height=this.tableHeight * window.devicePixelRatio;
        this.canvas.width=this.tableWidth * window.devicePixelRatio;

        this.ctxCanvas = this.canvas.getContext("2d");
        // this.ctxCanvasTop = this.canvasTop.getContext("2d");
        // this.ctxCanvasLeft = this.canvasLeft.getContext("2d");

        if (!this.ctxCanvas) {
            console.error("Could not get context for canvas");
            return;
        }

        // document.body.style.cursor = *cursor-url*;

        

        

        
        
        
        
        // console.log("beginned");
        // drawGrid();
            // await this.data = getTableData();
        // this.scrollXaxis();
        this.loadData();
        
        // this.topSizeMap[3] = 40;
        // this.leftSizeMap[4] = 40;
        
        this.isIntersectRegionTop = this.isIntersectRegionTop.bind(this);
        this.resizeColumnPointerDown = this.resizeColumnPointerDown.bind(this);
        this.resizeColumnPointerMove = this.resizeColumnPointerMove.bind(this);
        this.resizeColumnPointerUp = this.resizeColumnPointerUp.bind(this);
        this.getColumnNumber = this.getColumnNumber.bind(this);

        
        this.isIntersectRegionLeft = this.isIntersectRegionLeft.bind(this);
        this.resizeRowPointerDown = this.resizeRowPointerDown.bind(this);
        this.resizeRowPointerMove = this.resizeRowPointerMove.bind(this);
        this.resizeRowPointerUp = this.resizeRowPointerUp.bind(this);
        this.getRowNumber = this.getRowNumber.bind(this);


        
        this.selectionPointerDown = this.selectionPointerDown.bind(this);
        this.selectionPointerMove = this.selectionPointerMove.bind(this);
        this.selectionPointerUp = this.selectionPointerUp.bind(this);

        this.drawWhiteSelectionBlock = this.drawWhiteSelectionBlock.bind(this);

        this.mainCanvasKeyDown = this.mainCanvasKeyDown.bind(this);
        this.mainCanvasKeyUp = this.mainCanvasKeyUp.bind(this);

        
        this.placeInputBox = this.placeInputBox.bind(this);

        this.drawSelection = this.drawSelection.bind(this);
        this.drawSelectionDiv = this.drawSelectionDiv.bind(this);

        
        this.drawTopHeadingsGrid = this.drawTopHeadingsGrid.bind(this);
        this.drawTableTopHeading = this.drawTableTopHeading.bind(this);
        
        this.topHeadingPointerMove = this.topHeadingPointerMove.bind(this);
        
        this.windowPointerMove = this.windowPointerMove.bind(this);
        this.windowPointerUp = this.windowPointerUp.bind(this);

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

        this.ctxCanvasLeft.font = "10px Calibri";
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
        this.canvas.addEventListener("pointerdown", this.selectionPointerDown);
        // this.canvas.addEventListener('pointermove', this.selectionPointerMove);
        // this.canvas.addEventListener('pointerup', this.selectionPointerUp);
        // this.canvas.addEventListener('pointerleave', this.selectionPointerUp);
        document.addEventListener('keydown', this.mainCanvasKeyDown);
        document.addEventListener('keyup', this.mainCanvasKeyUp);
        
        this.canvas.addEventListener('dblclick', this.placeInputBox);

        
        this.canvasTop.addEventListener("pointerdown", this.resizeColumnPointerDown);
        this.canvasTop.addEventListener('pointermove', this.topHeadingPointerMove);
        // this.canvasTop.addEventListener('pointerup', this.resizeColumnPointerUp);
        // this.canvasTop.addEventListener('pointerleave', this.resizeColumnPointerUp);


        this.canvasLeft.addEventListener("pointerdown", this.resizeRowPointerDown);
        // this.canvasLeft.addEventListener('pointermove', this.resizeRowPointerMove);
        // this.canvasLeft.addEventListener('pointerup', this.resizeRowPointerUp);
        // this.canvasLeft.addEventListener('pointerleave', this.resizeRowPointerUp);
        // this.deleteButton.addEventListener('click', this.handleDelete);

        
        // this.canvasLeft.addEventListener('pointermove', this.resizeRowPointerMove);
        // this.canvasLeft.addEventListener('pointerup', this.resizeRowPointerUp);
        // this.canvasLeft.addEventListener('pointerleave', this.resizeRowPointerUp);
        // document.addEventListener("pointerdown", (e)=>{
        //     console.log('Viewport Coordinates:', e.clientX, e.clientY);
        //     console.log('Screen Coordinates:', e.screenX, e.screenY);
        // })
        
        window.addEventListener('pointermove', this.windowPointerMove);
        window.addEventListener('pointerup', this.windowPointerUp);
        window.addEventListener('pointerleave', this.windowPointerUp);

        
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

    isIntersectRegionTop(clickX){
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
            if(((pixelCount-2) <= clickY) && (clickY <= (pixelCount + 2))) return true;
        }

        return false;
    }

    resizeColumnPointerDown(e){
        this.isClickedOnTopHeadingCanvas = 1;

        this.startRowY = -1;
        this.endRowY = -1;
        this.rowSelection = 0;
        this.isSelectedRow = 0;
        this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
        this.drawLeftHeadingsGrid();
        this.drawTableLeftHeading()

        if(this.isIntersectRegionTop(e.offsetX)){
            
            // this.startColX = -1;
            // this.endColX = -1;
            this.moveStartX = this.getColumnNumber(e.offsetX - 20);
            this.startTopX = e.offsetX;
            this.selectionTop = 1;
            this.prevSizeX = (this.topSizeMap[this.moveStartX + 1] || 0);
        }
        else{
            let clickX = this.getColumnNumber(e.offsetX);
            this.startColX = clickX;
            this.endColX = clickX;
            this.colSelection = 1;
            this.isSelectedCol = 1;
            this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
            this.drawTopHeadingsGrid();
            this.drawTableTopHeading();

            this.startCellsX = this.startColX;
            this.endCellsX = this.endColX;
            this.startCellsY = 0;
            this.endCellsY = this.getRowNumber(this.canvas.height);

            this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.selection = 1;
            this.drawSelection();
            this.selection = 0;
            // this.drawGrid();
            // this.drawTableData();
        }
        

    }

    resizeColumnPointerMove(e){
        let offset = this.canvasTop.getBoundingClientRect();
        if(this.selectionTop === 1){
            // Math.min((this.startTopX - e.offsetX),20);
            const newWidth = Math.max(
                40 -  this.columnWidth,
                e.clientX - offset.x - this.startTopX + this.prevSizeX
            )
            // + (this.topSizeMap[this.startCellsX + 1] || 0)
            ;
            this.topSizeMap[this.moveStartX + 1] = newWidth;
            
            this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
            this.drawTopHeadingsGrid();
            this.drawTableTopHeading();
        }
        if(this.colSelection === 1){
            console.log(e.clientY ,offset.x);
            let clickX = this.getColumnNumber(e.clientX - offset.x);
            this.endColX = clickX;
            this.endCellsX = this.endColX;
            this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
            this.drawTopHeadingsGrid();
            this.drawTableTopHeading();
            this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.selection = 1;
            this.drawSelection();
            this.selection = 0;
            // this.drawGrid();
            // this.drawTableData();
            // console.log(this.startColX,this.endColX);
        }
    }

    resizeColumnPointerUp(e){
        let offset = this.canvasTop.getBoundingClientRect();
        if(this.selectionTop === 1){
            // console.log(e.offsetX);
            // (this.topSizeMap[this.startCellsX + 1] || 0)
            const newWidth = Math.max(
                40 -  this.columnWidth,
                e.clientX - offset.x - this.startTopX + this.prevSizeX
            )
            ;
            this.topSizeMap[this.moveStartX + 1] = newWidth ;
            // console.log(newWidth);
            this.selectionTop = 0;
            this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
            this.drawTopHeadingsGrid();
            this.drawTableTopHeading();
            this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // this.drawGrid();
            // this.drawTableData();
            this.selection = 1;
            this.drawSelection();
            this.selection = 0;
            // if(this.selection === 1) this.drawSelection();
            console.log(this.topSizeMap);
        }
        else this.colSelection = 0;
    }

    resizeRowPointerDown(e){
        this.isClickedOnLeftHeadingCanvas = 1;

        this.startColX = -1;
        this.endColX = -1;
        this.colSelection = 0;
        this.isSelectedCol = 0;
        this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        this.drawTopHeadingsGrid();
        this.drawTableTopHeading();
        // console.log(e.offsetY);
        if(this.isIntersectRegionLeft(e.offsetY)){
            this.moveStartY = this.getRowNumber(e.offsetY - 2);
            this.startLeftY = e.offsetY;
            this.selectionLeft = 1;
            this.prevSizeY = (this.leftSizeMap[this.moveStartY + 1] || 0);
            // console.log("hel")
        }
        else{
            let clickY = this.getRowNumber(e.offsetY);
            this.startRowY = clickY;
            this.endRowY = clickY;
            this.rowSelection = 1;
            this.isSelectedRow = 1;
            this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
            this.drawLeftHeadingsGrid();
            this.drawTableLeftHeading();

            this.startCellsX = 0;
            this.endCellsX = this.getRowNumber(this.canvas.width);
            this.startCellsY = this.startRowY;
            this.endCellsY = this.endRowY;

            this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.selection = 1;
            this.drawSelection();
            this.selection = 0;

        }

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
        let offset = this.canvas.getBoundingClientRect();

        if(this.selectionLeft === 1){
            const newHeight = Math.max(
                10 - this.rowHeight,
                e.clientY - offset.y - this.startLeftY + this.prevSizeY
            )
            ;

            this.leftSizeMap[this.moveStartY + 1] =  newHeight;

            this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
            this.drawLeftHeadingsGrid();
            this.drawTableLeftHeading();
        }
        if(this.rowSelection === 1){
            let clickY = this.getRowNumber(e.clientY - offset.y);
            this.endRowY = clickY;
            this.endCellsY = this.endRowY;
            this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
            this.drawLeftHeadingsGrid();
            this.drawTableLeftHeading();
            
            this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.selection = 1;
            this.drawSelection();
            this.selection = 0;
        }
    }

    resizeRowPointerUp(e){
        if(this.selectionLeft === 1){
            const newHeight = Math.max(
                10 - this.rowHeight,
                e.offsetY - this.startLeftY + this.prevSizeY
            )
            ;

            this.leftSizeMap[this.moveStartY + 1] =  newHeight;
            this.selectionLeft = 0;

            this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
            this.drawLeftHeadingsGrid();
            this.drawTableLeftHeading();
            this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // this.drawGrid();
            // this.drawTableData();
            this.selection = 1;
            this.drawSelection();
            this.selection = 0;
            console.log(this.leftSizeMap);
        }
        else this.rowSelection = 0;
    }

    placeInputBox(e){
        this.ipBox.style.display = "none";
        // console.log(e.offsetX, e.offsetY);
        // this.selection = 1;
        // this.startCellsX = this.getColumnNumber(e.offsetX);
        // this.startCellsY = this.getRowNumber(e.offsetY);

        const ipBoxCellX = this.startCellsX;
        const ipBoxCellY = this.startCellsY;
        

        let ipBoxX = this.canvasLeft.width;
        let ipBoxY = this.canvasTop.height;

        for(let x = 0; x < ipBoxCellX; ++x){
            ipBoxX += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        }
        for(let y = 0; y < ipBoxCellY; ++y){
            ipBoxY += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        }

        this.ipBox.style.width = `${this.columnWidth - 2 + (this.topSizeMap[this.startCellsX + 1] || 0)}px`;        
        this.ipBox.style.height = `${this.rowHeight - 2 + (this.leftSizeMap[this.startCellsY + 1] || 0)}px`;      

        this.ipBox.style.top = `${ipBoxY + 1}px`;
        this.ipBox.style.left = `${ipBoxX + 1}px`;
        
        this.ipBox.style.display = "block";
        this.ipBox.value = this.data[this.startCellsY][this.startCellsX];
        console.log(this.data[this.startCellsY][this.startCellsX]);
        this.ipBox.focus();
    }

    mainCanvasKeyDown(e){
        // e.preventDefault()
        if(e.shiftKey){
            if(e.key === "ArrowUp"){
                // console.log("U");
                if(this.endCellsY !== -1) this.endCellsY = Math.max(0, this.endCellsY - 1);
                this.selection = 1;
                this.drawSelection();
                this.selection = 0;
            }
            else if(e.key === "ArrowDown"){
                // console.log("D");
                if(this.endCellsY !== -1) this.endCellsY = Math.min(1048576, this.endCellsY + 1);
                this.selection = 1;
                this.drawSelection();
                this.selection = 0;
            }
            else if(e.key === "ArrowLeft"){
                // console.log("L");
                if(this.endCellsX !== -1) this.endCellsX = Math.max(0, this.endCellsX - 1);
                this.selection = 1;
                this.drawSelection();
                this.selection = 0;
            }
            else if(e.key === "ArrowRight"){
                // console.log("R");
                if(this.endCellsX !== -1) this.endCellsX = Math.min(16384, this.endCellsX + 1);
                this.selection = 1;
                this.drawSelection();
                this.selection = 0;
            }
        }
    }

    mainCanvasKeyUp(e){

    }

    selectionPointerDown(e){
        this.isClickedOnMainCanvas = 1;

        this.startColX = -1;
        this.endColX = -1;
        this.colSelection = 0;
        this.isSelectedCol = 0;
        this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        this.drawTopHeadingsGrid();
        this.drawTableTopHeading();

        this.startRowY = -1;
        this.endRowY = -1;
        this.rowSelection = 0;
        this.isSelectedRow = 0;
        this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
        this.drawLeftHeadingsGrid();
        this.drawTableLeftHeading()

        this.ipBox.style.display = "none";
        // console.log(e.offsetX, e.offsetY);
        this.selection = 1;
        this.startCellsX = this.getColumnNumber(e.offsetX);
        this.startCellsY = this.getRowNumber(e.offsetY);
        this.endCellsX = this.startCellsX;
        this.endCellsY = this.startCellsY;

        const ipBoxCellX = this.startCellsX;
        const ipBoxCellY = this.startCellsY;
        

        let ipBoxX = 0;
        // this.canvasLeft.width;
        let ipBoxY = 0;
        // this.canvasTop.height;

        for(let x = 0; x < ipBoxCellX; ++x){
            ipBoxX += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        }
        for(let y = 0; y < ipBoxCellY; ++y){
            ipBoxY += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        }

        // this.ipBox.style.width = `${this.columnWidth + (this.topSizeMap[this.startCellsX + 1] || 0)}px`;        
        // this.ipBox.style.height = `${this.rowHeight + (this.topSizeMap[this.startCellsY ] || 0)}px`;      

        // this.ipBox.style.top = `${ipBoxY}px`;
        // this.ipBox.style.left = `${ipBoxX}px`;
        this.startAbsX = ipBoxX;
        this.startAbsY = ipBoxY;
        
        // this.ipBox.type = "text";
        // this.selectionDiv.style = "block";
        
        // console.log(this.startCellsX, this.startCellsY);
        this.drawSelection();
        this.ctxCanvas.fillStyle = "#fff";
        

        // this.drawGrid();
        // this.drawTableData();


    }

    selectionPointerMove(e){
        if( this.selection === 1){
            // this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.drawGrid();
            let offset = this.canvas.getBoundingClientRect();
            this.endCellsX = this.getColumnNumber(e.clientX - offset.x);
            this.endCellsY = this.getRowNumber(e.clientY - offset.y);
            // console.log(e.offsetX,e.offsetY);
            // console.log('Viewport Coordinates:', e.clientX, e.clientY);
            // console.log('Screen Coordinates:', e.screenX, e.screenY);
            // console.log(x);
            
            this.drawSelection();
            this.ctxCanvas.fillStyle = "#fff";
            
            // this.ctxCanvas.fillRect(
            //     this.startAbsX,
            //     this.startAbsY,
            //     this.columnWidth +(this.topSizeMap[this.startCellsX + 1] || 0),
            //     this.rowHeight + (this.topSizeMap[this.startCellsY ] || 0)
            // );

            // this.drawGrid();
            // this.drawTableData();
        }
    }

    selectionPointerUp(e){
        // console.log("hiyeyeyeyeye")
        this.selection = 0;
        // this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.drawGrid();
        // this.drawTableData();

    }

    windowPointerMove(e){
        if(this.isClickedOnLeftHeadingCanvas === 1){
            this.resizeRowPointerMove(e);
        }
        else if(this.isClickedOnMainCanvas === 1){
            // if( this.selection === 1){
            //     // this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // // this.drawGrid();
            //     let offset = this.canvas.getBoundingClientRect();
            //     this.endCellsX = this.getColumnNumber(e.clientX - offset.x);
            //     this.endCellsY = this.getRowNumber(e.clientY - offset.y);
            //     // console.log(e.offsetX,e.offsetY);
            //     // console.log('Viewport Coordinates:', e.clientX, e.clientY);
            //     // console.log('Screen Coordinates:', e.screenX, e.screenY);
            //     // console.log(x);
                
            //     this.drawSelection();
            //     this.ctxCanvas.fillStyle = "#fff";
                
            //     // this.ctxCanvas.fillRect(
            //     //     this.startAbsX,
            //     //     this.startAbsY,
            //     //     this.columnWidth +(this.topSizeMap[this.startCellsX + 1] || 0),
            //     //     this.rowHeight + (this.topSizeMap[this.startCellsY ] || 0)
            //     // );
    
            //     // this.drawGrid();
            //     // this.drawTableData();
            // }
            this.selectionPointerMove(e);
        }
        else if(this.isClickedOnTopHeadingCanvas === 1){
            this.resizeColumnPointerMove(e);
        }

        // console.log(this.isClickedOnLeftHeadingCanvas, this.isClickedOnMainCanvas, this.isClickedOnTopHeadingCanvas);

    }
    windowPointerUp(e){
        this.selection = 0;

        this.resizeRowPointerUp(e);
        this.resizeColumnPointerUp(e);
        this.selectionPointerUp(e);

        this.isClickedOnLeftHeadingCanvas = 0;
        this.isClickedOnMainCanvas = 0;
        this.isClickedOnTopHeadingCanvas = 0;
    }
    

    topHeadingPointerMove(e){
        if(this.isIntersectRegionTop(e.offsetX)){
            this.canvasTop.style.cursor = "ew-resize";
        }
        else{
            this.canvasTop.style.cursor = "s-resize";
        }
    }



    drawSelection() {
        // console.log("selection");
        if(this.selection === 1 && this.startCellsX != -1){

            let selectionLeftSpace = 0;
            // this.canvasLeft.width;
            let selectionTopSpace = 0; 
            // this.canvasTop.height;

            let lx= Math.min(this.startCellsX,this.endCellsX);
            let ly= Math.min(this.startCellsY,this.endCellsY);
            let hx= Math.max(this.startCellsX,this.endCellsX);
            let hy= Math.max(this.startCellsY,this.endCellsY);
            // console.log(lx,ly,hx,hy);
            for(let x = 0; x < lx; ++x){
                selectionLeftSpace += this.columnWidth + (this.topSizeMap[x + 1] || 0);
            }
            for(let y = 0; y < ly; ++y){
                selectionTopSpace += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
            }
            // console.log(selectionLeftSpace,selectionTopSpace);

            // this.selectionDiv.style.left = `${selectionLeftSpace}px`;
            // this.selectionDiv.style.top = `${selectionTopSpace}px`;

            let selectionHeight = 0;
            let selectionWidth = 0;

            for(let x = lx; x <= hx ; ++x){
                selectionWidth += this.columnWidth + (this.topSizeMap[x + 1] || 0);
            }
            for(let y = ly; y <= hy; ++y){
                selectionHeight += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
            }

            // this.selectionDiv.style.height = `${selectionHeight}px`;
            // this.selectionDiv.style.width = `${selectionWidth}px`;
            
            // this.drawBorder(
            //     this.ctxCanvas, 
            //     selectionLeftSpace,
            //     selectionTopSpace,
            //     selectionWidth,
            //     selectionHeight,
            //     2,
            //     "rgba(19,126,67,1)"
            // );
            


            // ----------- Left Heading Canvas Selection -------------
            this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
            this.ctxCanvasLeft.fillStyle = "#caead8";
            this.ctxCanvasLeft.fillRect(
                0,
                selectionTopSpace,
                this.canvasLeft.width,
                selectionHeight
            );
            this.drawLeftHeadingsGrid();
            this.drawTableLeftHeading();
            this.ctxCanvasLeft.lineWidth = 2;
            this.ctxCanvasLeft.strokeStyle = "rgb(16,124,65)";
            this.ctxCanvasLeft.strokeRect(
                this.canvasLeft.width - 1,
                selectionTopSpace - 1,
                2,
                selectionHeight + 2
            )


            // ----------- Top Heading Canvas Selection -------------
            this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
            this.ctxCanvasTop.fillStyle = "#caead8";
            this.ctxCanvasTop.fillRect(
                selectionLeftSpace,
                0,
                selectionWidth,
                this.canvasTop.height
            );
            this.drawTopHeadingsGrid();
            this.drawTableTopHeading();
            this.ctxCanvasTop.lineWidth = 2;
            this.ctxCanvasTop.strokeStyle = "rgb(16,124,65)";
            this.ctxCanvasTop.strokeRect(
                selectionLeftSpace - 1 ,
                this.canvasTop.height - 1,
                selectionWidth + 2,
                2
            )

            // ----------- Main Canvas Selection -------------
            this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctxCanvas.fillStyle = "#e7f1ec";
            this.ctxCanvas.fillRect(
                selectionLeftSpace,
                selectionTopSpace,
                selectionWidth,
                selectionHeight
            );
            this.drawGrid();
            this.drawWhiteSelectionBlock();
            this.drawTableData();
            this.ctxCanvas.lineWidth = 2;
            this.ctxCanvas.strokeStyle = "rgb(16,124,65)";
            this.ctxCanvas.strokeRect(
                selectionLeftSpace - 1,
                selectionTopSpace - 1,
                selectionWidth + 2,
                selectionHeight + 2
            )

            
            
        }
        else{
            this.drawGrid();
            this.drawTableData();
        }

        // this.ctxCanvas.fillRect(
        //     this.startAbsX,
        //     this.startAbsY,
        //     this.columnWidth + (this.topSizeMap[this.startCellsX + 1] || 0),
        //     this.rowHeight + (this.topSizeMap[this.startCellsY ] || 0)
        // );

        

        // this.ctxCanvas.fillStyle = "#fff";
        // this.ctxCanvas.fillRect(
        //     this.startAbsX,
        //     this.startAbsY,
        //     this.columnWidth + (this.topSizeMap[this.startCellsX + 1] || 0),
        //     this.rowHeight + (this.topSizeMap[this.startCellsY ] || 0)
        // );
        // console.log(this.selection);
        
        // if(this.selection === 1){
            
        // }

        

        
        
        // console.log(
        //     this.startCellsX, 
        //     this.startCellsY, 
        //     this.endCellsX, 
        //     this.endCellsY
        // );
    }

    drawWhiteSelectionBlock(){
        // ----------- White Space during Main Selection -------------
        let leftSpace = 0;
        let topSpace = 0;

        for(let x = 0; x < this.startCellsX; ++x){
            leftSpace += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        }
        for(let y = 0; y < this.startCellsY; ++y){
            topSpace += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        }

        if(this.isSelectedRow === 0 && this.isSelectedCol === 0){
            this.ctxCanvas.fillStyle = "#fff";
            this.ctxCanvas.fillRect(
                leftSpace,
                topSpace,
                this.columnWidth + (this.topSizeMap[this.startCellsX + 1] || 0),
                this.rowHeight + (this.leftSizeMap[this.startCellsY + 1] || 0)
            );
        }
    }

    drawSelectionDiv() {

        let selectionLeftSpace = this.canvasLeft.width;
        let selectionTopSpace = this.canvasTop.height;

        let lx= Math.min(this.startCellsX,this.endCellsX);
        let ly= Math.min(this.startCellsY,this.endCellsY);
        let hx= Math.max(this.startCellsX,this.endCellsX);
        let hy= Math.max(this.startCellsY,this.endCellsY);

        for(let x = 0; x < lx; ++x){
            selectionLeftSpace += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        }
        for(let y = 0; y < ly; ++y){
            selectionTopSpace += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        }

        this.selectionDiv.style.left = `${selectionLeftSpace}px`;
        this.selectionDiv.style.top = `${selectionTopSpace}px`;

        let selectionHeight = 0;
        let selectionWidth = 0;

        for(let x = lx; x <= hx ; ++x){
            selectionWidth += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        }
        for(let y = ly; y <= hy; ++y){
            selectionHeight += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        }

        this.selectionDiv.style.height = `${selectionHeight}px`;
        this.selectionDiv.style.width = `${selectionWidth}px`;

        console.log(
            this.startCellsX, 
            this.startCellsY, 
            this.endCellsX, 
            this.endCellsY
        );
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
        thickness = 0;
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



        // this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
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
        let lx = Math.min(this.startColX, this.endColX);
        let hx = Math.max(this.startColX, this.endColX);

        
        let lowX = Math.min(this.startCellsX,this.endCellsX);
        let highX = Math.max(this.startCellsX,this.endCellsX);

        if(this.startColX != -1 && this.endColX != -1){
            let leftSpace = 0;
            let selectionWidth = 0;
            
            for(let x = 0; x < lx; ++x){
                leftSpace += this.columnWidth + (this.topSizeMap[x + 1] || 0);
            }
            for(let x = lx; x <= hx; ++x){
                selectionWidth += this.columnWidth + (this.topSizeMap[x + 1] || 0);
            }
            this.ctxCanvasTop.fillStyle = "#107c41";
            this.ctxCanvasTop.fillRect(
                leftSpace,
                0,
                selectionWidth,
                this.canvasTop.height
            );
            this.ctxCanvasTop.strokeRect(
                leftSpace,
                0,
                selectionWidth,
                this.canvasTop.height
            );
        }
        



        let cellPositionX = 0;
        for(let x = 0; cellPositionX <= this.canvasTop.width; x++){
            // if()
            cellPositionX += this.columnWidth + (this.topSizeMap[x+1] || 0);
            this.ctxCanvasTop.save();
            this.ctxCanvasTop.beginPath();
            this.ctxCanvasTop.moveTo(cellPositionX + 0.5 ,0);
            this.ctxCanvasTop.lineTo(cellPositionX + 0.5 , this.canvasTop.height);
            
            if(lx-1 == x){
                this.ctxCanvasTop.lineWidth=5;
                this.ctxCanvasTop.strokeStyle = "#107c41";
            }
            else if(x == hx){
                this.ctxCanvasTop.lineWidth=3;
                this.ctxCanvasTop.strokeStyle = "#107c41";
            }
            else if(lx <= x && x < hx){
                this.ctxCanvasTop.lineWidth=1;
                this.ctxCanvasTop.strokeStyle = "#a0d8b9";
            }
            else if(lowX - 1 <= x && x <= highX){
                this.ctxCanvasTop.lineWidth=1;
                this.ctxCanvasTop.strokeStyle = "#a0d8b9";
            }
            else{
                this.ctxCanvasTop.lineWidth=1;
                this.ctxCanvasTop.strokeStyle = "#ccc";
            }
            this.ctxCanvasTop.stroke();
            this.ctxCanvasTop.restore();
        }

        this.ctxCanvasTop.save();
        this.ctxCanvasTop.beginPath();
        this.ctxCanvasTop.moveTo(0,this.canvasTop.height - 0.5);
        this.ctxCanvasTop.lineTo(this.canvasTop.width, this.canvasTop.height - 0.5 );
        this.ctxCanvasTop.lineWidth=0.5;
        this.ctxCanvasTop.strokeStyle = "#555";
        this.ctxCanvasTop.stroke();
        this.ctxCanvasTop.restore();
        
        // fillRect()

        // leftSpace = 0;
        // selectionWidth = 0;
        // for(let x = 0; x < this.startColX; ++x){
        //     leftSpace += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        // }
        // for(let x = this.startColX; x <= this.endColX; ++x){
        //     selectionWidth += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        // }
        // this.ctxCanvasTop.fillStyle = "#ff0000";
        // this.ctxCanvasTop.fillRect(
        //     leftSpace,
        //     0,
        //     selectionWidth,
        //     this.ctxCanvasTop.height
        // );
        // console.log(selectionWidth);
    }

    drawLeftHeadingsGrid(){
        // console.log("leftgrid");
        // this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);

        // for (var y = 0; y <= this.tableHeight; y += this.rowHeight) {
        //     this.ctxCanvasLeft.moveTo(0, y);
        //     this.ctxCanvasLeft.lineTo(this.tableWidth, y);
        // }
        // this.ctxCanvasLeft.strokeStyle = "rgb(200,200,200)";
        // this.ctxCanvasLeft.stroke();
        let ly = Math.min(this.startRowY, this.endRowY);
        let hy = Math.max(this.startRowY, this.endRowY);
        let lowY = Math.min(this.startCellsY,this.endCellsY);
        let highY = Math.max(this.startCellsY,this.endCellsY);

        if(this.startRowY != -1 && this.endRowY != -1){
            let topSpace = 0;
            let selectionHeight = 0;
            
            for(let y = 0; y < ly; ++y){
                topSpace += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
            }
            for(let y = ly; y <= hy; ++y){
                selectionHeight += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
            }
            this.ctxCanvasLeft.fillStyle = "#107c41";
            this.ctxCanvasLeft.fillRect(
                0,
                topSpace,
                this.canvasLeft.width,
                selectionHeight
            );
        }


        let cellPositionY = 0;
        for(let y = 0; cellPositionY <= this.canvasLeft.height; y++){
            cellPositionY += this.rowHeight + (this.leftSizeMap[y+1] || 0);
            this.ctxCanvasLeft.save();
            this.ctxCanvasLeft.beginPath();
            this.ctxCanvasLeft.moveTo(0,cellPositionY + 0.5);
            this.ctxCanvasLeft.lineTo(this.canvasLeft.width, cellPositionY +0.5);
            // this.ctxCanvasLeft.lineWidth=1;
            // this.ctxCanvasLeft.strokeStyle = "rgb(200,200,200)";
            if(ly <= y && y < hy){
                this.ctxCanvasLeft.lineWidth=1;
                this.ctxCanvasLeft.strokeStyle = "#fff";
            }
            else if(lowY-1 <= y && y <= highY){
                this.ctxCanvasLeft.lineWidth=1;
                this.ctxCanvasLeft.strokeStyle = "#a0d8b9";
            }
            else{
                this.ctxCanvasLeft.lineWidth=1;
                this.ctxCanvasLeft.strokeStyle = "#ccc";
            }
            this.ctxCanvasLeft.stroke();
            this.ctxCanvasLeft.restore();
        }

        this.ctxCanvasLeft.save();
        this.ctxCanvasLeft.beginPath();
        this.ctxCanvasLeft.moveTo(this.canvasLeft.width - 0.5, 0);
        this.ctxCanvasLeft.lineTo(this.canvasLeft.width - 0.5, this.canvasLeft.height);
        this.ctxCanvasLeft.lineWidth=0.5;
        this.ctxCanvasLeft.strokeStyle = "#555";
        this.ctxCanvasLeft.stroke();
        this.ctxCanvasLeft.restore();

        // this.ctxCanvas.save();
        // this.ctxCanvas.beginPath();
        // this.ctxCanvas.moveTo(0.5, 0);
        // this.ctxCanvas.lineTo(0.5, this.canvas.height);
        // this.ctxCanvas.lineWidth=0.5;
        // this.ctxCanvas.strokeStyle = "#555";
        // this.ctxCanvas.stroke();
        // this.ctxCanvas.restore();
    }

    drawGrid() {
        // this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

        for(let x = 1; cellPositionX <= this.canvas.width; ++x){
            cellPositionX += this.columnWidth + (this.topSizeMap[x] || 0);
            this.ctxCanvas.save();
            this.ctxCanvas.beginPath();
            this.ctxCanvas.moveTo(cellPositionX + 0.5, 0);
            this.ctxCanvas.lineTo(cellPositionX + 0.5, this.canvas.height);
            this.ctxCanvas.lineWidth=0.4;
            this.ctxCanvas.strokeStyle = "#ccc";
            this.ctxCanvas.stroke();
            this.ctxCanvas.restore();
        }

        for(let y = 1; cellPositionY <= this.canvas.width; ++y){
            cellPositionY += this.rowHeight + (this.leftSizeMap[y] || 0);
            this.ctxCanvas.save();
            this.ctxCanvas.beginPath();
            this.ctxCanvas.moveTo(0,cellPositionY + 0.5);
            this.ctxCanvas.lineTo(this.canvas.width, cellPositionY + 0.5);
            this.ctxCanvas.lineWidth=0.4;
            this.ctxCanvas.strokeStyle = "#ccc";
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
        
        // this.ctxCanvasTop.fillStyle = "rgba(110,110,110,1)";
        let lx = Math.min(this.startColX, this.endColX);
        let hx = Math.max(this.startColX, this.endColX);

        let lowX = Math.min(this.startCellsX,this.endCellsX);
        let highX = Math.max(this.startCellsX,this.endCellsX);

        let x = 0;
        
        for (let i = 0; x <= this.tableWidth; i++) {
            const columnWidth = this.columnWidth + (this.topSizeMap[i + 1] || 0);
            if(lx <= i && i <= hx){
                this.ctxCanvasTop.font = "bold 16px Calibri";
                this.ctxCanvasTop.fillStyle = "#fff";
            }
            else if(lowX <= i && i <= highX){
                this.ctxCanvasTop.font = "15px Calibri";
                this.ctxCanvasTop.fillStyle = "#0f703b";
            }
            else{
                this.ctxCanvasTop.font = "15px Calibri";
                this.ctxCanvasTop.fillStyle = "rgba(110,110,110,1)";
            }
            
            this.ctxCanvasTop.fillText(
                this.convertToTitle(i + 1),
                x + columnWidth / 2,
                this.canvasTop.height *3 / 4
            );
            x += columnWidth;
        }

        
        // console.log(selectionWidth);
        
        // this.ctxCanvasTop.stroke();
    }


    drawTableLeftHeading(startX = 0 , startY = 0){
        // console.log("leftdata");
        // this.startX=startX;
        // this.startY=startY;

        // this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
        // this.drawLeftHeadingsGrid();
        // this.ctxCanvasTop.fillStyle = "rgba(110,110,110,1)";
        
        let lowY = Math.min(this.startCellsY,this.endCellsY);
        let highY = Math.max(this.startCellsY,this.endCellsY);
        var start = startX;
        var end = startX + Math.floor((this.tableHeight + this.rowHeight - 1) / this.rowHeight);


        let ly = Math.min(this.startRowY, this.endRowY);
        let hy = Math.max(this.startRowY, this.endRowY);
        let y = 0;

        for (var j = 0; y <= this.tableHeight; j++, start++) {
            const rowHeight = this.rowHeight + (this.leftSizeMap[j + 1] || 0);

            if(ly <= j && j <= hy){
                this.ctxCanvasLeft.font = "bold 15px Calibri";
                this.ctxCanvasLeft.fillStyle = "#fff";
            }
            else if(lowY <= j && j <= highY){
                this.ctxCanvasLeft.font = "15px Calibri";
                this.ctxCanvasLeft.fillStyle = "#0f703b";
            }
            else{
                this.ctxCanvasLeft.font = "15px Calibri";
                this.ctxCanvasLeft.fillStyle = "rgba(110,110,110,1)";
            }

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
        // this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
            y += (this.rowHeight / 2) + (this.leftSizeMap[i+1]/2  || 0);
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
                    this.shortenText(this.data[this.startX][this.startY],((((this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0))/4)-3)),
                    // j * this.columnWidth + this.columnWidth / 2,
                    x,
                    // i * this.rowHeight + (this.rowHeight / 2) + 6
                    y + 6
                );
                
                x += (this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0);
                
            }
            y += (this.rowHeight / 2) + (this.leftSizeMap[i+1]/2  || 0);
            this.startY=startY;
            x=0;
        }
    }


    // this.canvas.addEvent
    

    
}