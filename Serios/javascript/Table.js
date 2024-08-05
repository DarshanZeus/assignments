export default class Table {
    /**
     * @type {HTMLCanvasElement}
     */
    canvasDiv = document.getElementById("canvasDiv");
    canvasD = document.getElementById("canvasD");


    canvas ;
    canvasTop = document.getElementById("canvasTop");
    canvasLeft = document.getElementById("canvasLeft");

    ctxCanvasTop = this.canvasTop.getContext("2d");
    ctxCanvasLeft = this.canvasLeft.getContext("2d");
    ctxCanvas ;
    // ctxCanvasTop ;
    // ctxCanvasLeft ;
    columnWidth = 100;
    rowHeight = 20;

    minCountRow = 0;
    minCountCol = 0;
    maxCountRow = 1048576;
    maxCountCol = 16384;

    startCellsX = 0;
    startCellsY = 0;
    endCellsX = 0;
    endCellsY = 0;

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
    data = Array.from({ length: 100 }, () => Array(100).fill());;
    
    isCellsCopyCut = 0;
    isCutFlag = 0;
    copyCutData = [];
    copyCutStartX = -1;
    copyCutStartY = -1;
    copyCutEndX = -1;
    copyCutEndY = -1;


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

    ipBox;
    selectionDiv;
    copyCutAnimationDiv;

    


    constructor(mainCanvasName) {
        console.log("Window Device Pixel Ratio", window.devicePixelRatio);


        this.canvas = document.getElementById(`${mainCanvasName}`);
        this.canvasTop = document.getElementById("canvasTop");
        this.canvasLeft = document.getElementById("canvasLeft");
        
        this.barChart = document.getElementById("barChart");
        this.lineChart = document.getElementById("lineChart");

        this.ipBox = document.getElementById("ipBox");
        this.selectionDiv = document.getElementById("selectionDiv");
        this.dottedVerticalLineDiv = document.getElementById("dottedVerticalLineDiv");
        this.dottedHorizontalLineDiv = document.getElementById("dottedHorizontalLineDiv");
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

        // this.startMarchingAntsAnimation = this.startMarchingAntsAnimation.bind(this);

        this.mainCanvasKeyDown = this.mainCanvasKeyDown.bind(this);
        this.mainCanvasKeyUp = this.mainCanvasKeyUp.bind(this);

        
        this.placeInputBox = this.placeInputBox.bind(this);
        this.ipBoxKeyDown = this.ipBoxKeyDown.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.handlePaste = this.handlePaste.bind(this);

        this.drawSelection = this.drawSelection.bind(this);
        this.drawSelectionDiv = this.drawSelectionDiv.bind(this);

        
        this.drawTopHeadingsGrid = this.drawTopHeadingsGrid.bind(this);
        this.drawTableTopHeading = this.drawTableTopHeading.bind(this);
        
        this.topHeadingPointerMove = this.topHeadingPointerMove.bind(this);
        this.leftHeadingPointerMove = this.leftHeadingPointerMove.bind(this);
        
        this.windowPointerMove = this.windowPointerMove.bind(this);
        this.windowPointerUp = this.windowPointerUp.bind(this);

        
        this.makeChartDraggable = this.makeChartDraggable.bind(this);
        this.createBarChart = this.createBarChart.bind(this);
        this.createLineChart = this.createLineChart.bind(this);

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
        this.ctxCanvasLeft.textAlign = "right";
        this.ctxCanvasLeft.textBaseline = "middle";
        this.ctxCanvasLeft.lineWidth = 1;

        this.drawTableTopHeading();
        this.drawTableLeftHeading();
        this.selection = 1;
        this.drawSelection();
        this.selection = 0;

        
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
        
        window.addEventListener('keydown', this.mainCanvasKeyDown);
        window.addEventListener('keyup', this.mainCanvasKeyUp);
        
        this.canvas.addEventListener('dblclick', this.placeInputBox);

        
        this.canvasTop.addEventListener("pointerdown", this.resizeColumnPointerDown);
        this.canvasTop.addEventListener('pointermove', this.topHeadingPointerMove);

        this.canvasLeft.addEventListener("pointerdown", this.resizeRowPointerDown);
        this.canvasLeft.addEventListener('pointermove', this.leftHeadingPointerMove);
        
        window.addEventListener('pointermove', this.windowPointerMove);
        window.addEventListener('pointerup', this.windowPointerUp);
        window.addEventListener('pointerleave', this.windowPointerUp);
        window.addEventListener('pointercancel', this.windowPointerUp);

        this.ipBox.addEventListener("keypress", this.ipBoxKeyDown);

        
        this.barChart.addEventListener("click", this.createBarChart);
        this.lineChart.addEventListener("click", this.createLineChart);





        
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
        document.addEventListener('paste', function(e) {
            // console.log(e);
            // console.log(e.clipboardData);
            // e.clipboardData contains the data that is about to be pasted.
            if (e.clipboardData.types.indexOf('text/html') > -1) {
                var oldData = e.clipboardData.getData('text/html');
                var newData = '<b>Ha Ha!</b> ' + oldData;
                console.log(oldData);
                // console.log(newData);
            
                // Since we are canceling the paste operation, we need to manually
                // paste the data into the document.
                // pasteClipboardData(newData);
            
                // This is necessary to prevent the default paste action.
                e.preventDefault();
            }
        });
    }


    makeChartDraggable(chartDiv){
        
        let offsetX, offsetY;

        chartDiv.addEventListener('mousedown', (e) => {
            offsetX = e.clientX - chartDiv.getBoundingClientRect().left + this.canvasD.getBoundingClientRect().left;
            offsetY = e.clientY - chartDiv.getBoundingClientRect().top + this.canvasD.getBoundingClientRect().top;

            document.addEventListener('mousemove', moveElement);
            document.addEventListener('mouseup', stopMovingElement);
        });

        function moveElement(e) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            chartDiv.style.left = `${Math.max(x,0)}px`;
            chartDiv.style.top = `${Math.max(y,0)}px`;
        }

        function stopMovingElement() {
            document.removeEventListener('mousemove', moveElement);
            document.removeEventListener('mouseup', stopMovingElement);
        }
    }
    
    setChartDivProperties(chartDiv){
        chartDiv.style.height = `288px`;
        chartDiv.style.width = `480px`;
        chartDiv.style.position = `absolute`;
        chartDiv.style.top = `100px`;
        chartDiv.style.left = `100px`;
        chartDiv.style.backgroundColor = `#fff`;
        chartDiv.style.padding = `10px`;
        chartDiv.style.border = `1px solid rgb(210,210,210)`;
        chartDiv.id = 'chartDiv';
        chartDiv.classList.add('chartDiv');
    }

    setChartCanvasProperties(chartCanvas){
        chartCanvas.height = 288;
        chartCanvas.width = 480;
    }

    handleBarChart(){
        chartDataX = this.startCellsX;
        chartDataY = this.startCellsY;
        chartData = [];
        chartLabel = [];

        for(let i = 0; i < this.endCellsX - this.startCellsX + 1; ++i){
            let isNum = 0;
            for(let j = 0; j < this.endCellsY - this.startCellsX + 1; ++j){

            }
        }

    }
    
    createBarChart(data){
        let chartCanvas = document.createElement("canvas");
        let chartDiv = document.createElement("div");

        this.setChartCanvasProperties(chartCanvas);
        this.setChartDivProperties(chartDiv);
        
        if(this.canvasD) this.canvasD.append(chartDiv);
        if(chartDiv) chartDiv.append(chartCanvas);

        let xChart = new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    barPercentage: 1,
                    barThickness: 21,
                    backgroundColor : ['#4472c4'],
                    label: 'Chart Title',
                    data: [12, 19, 3, 5, 2, 3]
                    // borderWidth: 5
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        this.makeChartDraggable(chartDiv);
    }

    createLineChart(data){
        let chartCanvas = document.createElement("canvas");
        let chartDiv = document.createElement("div");

        this.setChartCanvasProperties(chartCanvas);
        this.setChartDivProperties(chartDiv);
        
        if(this.canvasD) this.canvasD.append(chartDiv);
        if(chartDiv) chartDiv.append(chartCanvas);
        

        let xChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    backgroundColor : '#4472c4',
                    borderColor : '#4472c4',
                    label: 'Chart Title',
                    data: [12, 19, 3, 5, 2, 3]
                    // borderWidth: 5
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        this.makeChartDraggable(chartDiv);
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

        for(let i = 1; pixelCount - this.columnWidth < this.tableWidth ; ++i){
            pixelCount+= this.columnWidth + (this.topSizeMap[i] || 0);
            // console.log(i,pixelCount);
            if(((pixelCount-10) <= clickX) && (clickX <= (pixelCount + 10))) return true;

            // if(pixelCount >= clickX) return false;
        }
        return false;
    }
    
    isIntersectRegionLeft(clickY){
        let pixelCount = 0;

        for(let i = 1; pixelCount - this.rowHeight < this.tableHeight ; ++i){
            pixelCount+= this.rowHeight + (this.leftSizeMap[i] || 0);
            // console.log(i,pixelCount);
            if(((pixelCount-2) <= clickY) && (clickY <= (pixelCount + 2))) return true;
        }

        return false;
    }

    createCopyCutAnimationDiv(){
        this.copyCutAnimationDiv = document.createElement("div");
        this.copyCutAnimationDiv.classList.add("copyCutAnimationDiv");
        this.copyCutAnimationDiv.id = "copyCutAnimationDiv";

        this.copyCutAnimationDiv.style.position = "absolute";
        this.copyCutAnimationDiv.style.display = "block";
        this.copyCutAnimationDiv.style.pointerEvents = "none";

        // copyCutAnimationDiv.style.border = "black 2px solid";

        this.copyCutAnimationDiv.style.background = 
        `linear-gradient(90deg, #217346 70%, #fff 30%), 
        linear-gradient(90deg, #217346 70%, #fff 30%), 
        linear-gradient(0deg, #217346 70%, #fff 30%), 
        linear-gradient(0deg, #217346 70%, #fff 30%)`;

        this.copyCutAnimationDiv.style.backgroundRepeat = 
        `repeat-x, repeat-x, repeat-y, repeat-y`;
        
        this.copyCutAnimationDiv.style.backgroundSize = `6px 2px, 6px 2px, 2px 6px, 2px 6px`;
        this.copyCutAnimationDiv.style.padding = `10px`;
        this.copyCutAnimationDiv.style.animation = `border-dance 4s infinite linear`;

    }

    resizeColumnPointerDown(e){
        // if(this.ipBox.style.display != "none"){
        //     console.log(ipBox.value);
        //     this.data[this.startCellsY][this.startCellsX] = ipBox.value;
        //     this.ipBox.value = "";
        
            this.ipBox.style.display = "none";
        // }

        this.isClickedOnTopHeadingCanvas = 1;

        this.startRowY = -1;
        this.endRowY = -1;
        this.rowSelection = 0;
        this.isSelectedRow = 0;
        this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
        this.drawLeftHeadingsGrid();
        this.drawTableLeftHeading();

        let offset = this.canvasTop.getBoundingClientRect();

        if(this.isIntersectRegionTop(e.clientX - offset.x)){
            
            // this.startColX = -1;
            // this.endColX = -1;

            
            this.moveStartX = this.getColumnNumber(e.clientX - offset.x - 10);
            this.startTopX = e.clientX - offset.x;
            this.selectionTop = 1;
            this.prevSizeX = (this.topSizeMap[this.moveStartX + 1] || 0);


            let selectionLeftSpace = 0;
            for(let x = 0; x < this.moveStartX; ++x){
                selectionLeftSpace += this.columnWidth + (this.topSizeMap[x + 1] || 0);
            }
            let selectionWidth = this.columnWidth + (this.topSizeMap[this.moveStartX + 1] || 0);

            this.ctxCanvas.lineWidth = 2;
            this.ctxCanvas.strokeStyle = "rgb(16,124,65)";
            this.ctxCanvas.strokeRect(
                selectionLeftSpace - 1 ,
                -2,
                selectionWidth + 2,
                this.canvas.height + 4
            );

            // console.log(selectionLeftSpace - 1 ,
            //     0,
            //     selectionWidth + 2,
            //     this.canvas.height);
        }
        else{
            let clickX = this.getColumnNumber(e.clientX - offset.x);
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
        // console.log("hell");
        // console.log(e.clientX, e.clientY)
        let offset = this.canvasTop.getBoundingClientRect();
        // console.log(this.selectionTop);
        if(this.selectionTop === 1){
            // Math.min((this.startTopX - e.offsetX),20);
            const newWidth = Math.max(
                40 -  this.columnWidth,
                e.clientX - offset.x - this.startTopX + this.prevSizeX
            );
            
            // + (this.topSizeMap[this.startCellsX + 1] || 0)
            ;
            this.topSizeMap[this.moveStartX + 1] = newWidth;

            // this.dottedVerticalLineDiv = document.getElementById("dottedVerticalLineDiv");
            // if(!this.dottedVerticalLineDiv){
            //     this.dottedVerticalLineDiv = document.createElement("div");
            //     this.dottedVerticalLineDiv.classList.add("dottedVerticalLineDiv");
            //     this.dottedVerticalLineDiv.id = "dottedVerticalLineDiv";
            //     this.dottedVerticalLineDiv.style.position = `absolute`;
            //     this.dottedVerticalLineDiv.style.borderLeft = `dashed 2px #f00`;
            //     this.dottedVerticalLineDiv.style.pointerEvents = `none`;
            //     this.dottedVerticalLineDiv.style.width = `0px`;
            // }

            this.dottedVerticalLineDiv.style.display = "block";
            // this.canvasDiv.append(this.dottedVerticalLineDiv);
            
            this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
            this.drawTopHeadingsGrid();
            this.drawTableTopHeading();

        }
        if(this.colSelection === 1){
            // console.log(e.clientY ,offset.x);
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
        // this.dottedVerticalLineDiv.style.display = `none`;
        // if(this.dottedVerticalLineDiv) this.dottedVerticalLineDiv.remove();
        if(this.selectionTop === 1){
            let x = e.clientX;
            x -= offset.x;
            x -= this.startTopX;
            x += this.prevSizeX;
            const newWidth = Math.max(
                40 -  this.columnWidth,x
            );
            
            this.prevSizeX = 0;
            this.topSizeMap[this.moveStartX + 1] = newWidth ;
            
            this.selectionTop = 0;
            
            // console.log("A", e.clientX,e.clientY);

            this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
            this.drawTopHeadingsGrid();
            this.drawTableTopHeading();

            this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.selection = 1;
            this.drawSelection();
            this.selection = 0;
            this.ipBox.focus();
            
            this.dottedVerticalLineDiv.style.display = "none";
            // console.log(this.moveStartX,this.moveStartY);
            
            this.moveStartX = -1;
            console.log(this.topSizeMap);
            this.resetDivSel();
        }
        else this.colSelection = 0;
    }

    resizeRowPointerDown(e){

        // if(this.ipBox.style.display != "none"){
        //     console.log(ipBox.value);
        //     this.data[this.startCellsY][this.startCellsX] = ipBox.value;
        //     this.ipBox.value = "";
            this.ipBox.style.display = "none";
        // }

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
            let selectionTopSpace = 0;
            for(let y = 0; y < this.moveStartY; ++y){
                selectionTopSpace += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
            }
            let selectionHeight = this.rowHeight + (this.leftSizeMap[this.moveStartY + 1] || 0);

            this.ctxCanvas.lineWidth = 2;
            this.ctxCanvas.strokeStyle = "rgb(16,124,65)";
            this.ctxCanvas.strokeRect(
                -2,
                selectionTopSpace,
                this.canvas.width,
                selectionHeight
            );
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

            this.dottedHorizontalLineDiv.style.display = "block";

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

            this.dottedHorizontalLineDiv.style.display = "none";

            console.log(this.leftSizeMap);
            this.resetDivSel();
        }
        else this.rowSelection = 0;
    }

    placeInputBox(e){
        let copyCutAnimationDiv = document.getElementById("copyCutAnimationDiv");
        if(copyCutAnimationDiv) copyCutAnimationDiv.remove(); 
        this.isCellsCopyCut = 0;
        
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
        if(this.data[this.startCellsY][this.startCellsX])
        this.ipBox.value = this.data[this.startCellsY][this.startCellsX];
        console.log(this.data[this.startCellsY][this.startCellsX]);
        this.ipBox.focus();
    }

    ipBoxKeyDown(e){
        if(e.key === "Enter"){
            // console.log(ipBox.value);
            this.data[this.startCellsY][this.startCellsX] = ipBox.value;
            this.ipBox.style.display = "none";
            this.ipBox.value = "";
            this.startCellsY = Math.min(this.maxCountRow, this.startCellsY + 1);
            this.endCellsY = this.startCellsY;
            this.endCellsX = this.startCellsX;
        }
        

        this.selection = 1;
        this.drawSelection();
        this.selection = 0;
    }

    mainCanvasKeyDown(e){
        // e.preventDefault();
        // if(this.ipBox.style.display != "none"){
        //     console.log(ipBox.value);
        //     this.data[this.startCellsY][this.startCellsX] = ipBox.value;
            
        //     this.ipBox.value = "";
        // }
        this.endColX = -1;
        this.startColX = -1;
        this.endRowY = -1;
        this.startRowY = -1;


        if(e.shiftKey){
            if(e.key === "ArrowUp"){
                // console.log("U");
                if(this.endCellsY !== -1) this.endCellsY = Math.max(this.minCountRow, this.endCellsY - 1);
            }
            else if(e.key === "ArrowDown"){
                // console.log("D");
                if(this.endCellsY !== -1) this.endCellsY = Math.min(this.maxCountRow, this.endCellsY + 1);
            }
            else if(e.key === "ArrowLeft"){
                // console.log("L");
                if(this.endCellsX !== -1) this.endCellsX = Math.max(this.minCountCol, this.endCellsX - 1);
            }
            else if(e.key === "ArrowRight"){
                // console.log("R");
                if(this.endCellsX !== -1) this.endCellsX = Math.min(this.maxCountCol, this.endCellsX + 1);
            }
            this.ipBox.style.display = "none";
        }
        else if(e.key === "ArrowUp"){
            // console.log("U");
            this.startCellsY = Math.max(this.minCountRow, this.startCellsY - 1);
            this.endCellsY = this.startCellsY;
            this.endCellsX = this.startCellsX;
            this.ipBox.style.display = "none";
        }
        else if(e.key === "ArrowDown"){
            // console.log("D");
            this.startCellsY = Math.min(this.maxCountRow, this.startCellsY + 1);
            this.endCellsY = this.startCellsY;
            this.endCellsX = this.startCellsX;
            this.ipBox.style.display = "none";
        }
        else if(e.key === "ArrowLeft"){
            // console.log("L");
            this.startCellsX = Math.max(this.minCountCol, this.startCellsX - 1);
            this.endCellsY = this.startCellsY;
            this.endCellsX = this.startCellsX;
            this.ipBox.style.display = "none";
        }
        else if(e.key === "ArrowRight"){
            // console.log("R");
            this.startCellsX = Math.min(this.maxCountCol, this.startCellsX + 1);
            this.endCellsY = this.startCellsY;
            this.endCellsX = this.startCellsX;
            this.ipBox.style.display = "none";
        }
        else if(e.key === "Enter" && this.ipBox.style.display === "none"){
            // if(this.ipBox.style.display != "none"){
            //     console.log(ipBox.value);
            //     this.data[this.startCellsY][this.startCellsX] = ipBox.value;
            //     this.ipBox.style.display = "none";
            //     this.ipBox.value = "";
            // }
            this.startCellsY = Math.min(this.maxCountRow, this.startCellsY + 1);
            this.endCellsY = this.startCellsY;
            this.endCellsX = this.startCellsX;
            this.ipBox.style.display = "none";
        }
        
        this.selection = 1;
        this.drawSelection();
        this.selection = 0;

        if(e.ctrlKey){ 
            if(e.key === 'C' || e.key === 'c'){

                this.copyCutStartX = this.startCellsX;
                this.copyCutStartY = this.startCellsY;
                this.copyCutEndX = this.endCellsX;
                this.copyCutEndY = this.endCellsY;
                this.isCellsCopyCut = 1;
                this.handleCopy();
            }
            else if(e.key === 'v' || e.key === 'V'){
                // this.handlePaste();
                this.getClipboardData();
            }
            else if(e.key === 'x' || e.key === 'X'){
                this.copyCutStartX = this.startCellsX;
                this.copyCutStartY = this.startCellsY;
                this.copyCutEndX = this.endCellsX;
                this.copyCutEndY = this.endCellsY;
                this.isCellsCopyCut = 1;
                this.isCutFlag = 1;
                this.handleCopy();
            }
        }
        
        
    }

    handlePaste(){
        let lx = Math.min(this.startCellsX,this.endCellsX);
        let ly = Math.min(this.startCellsY,this.endCellsY);
        let transfromToMatrixHelper = this.copyCutData.split('\n');
        this.copyCutData = [];
        for(let rowIndex = 0; rowIndex + 1 < transfromToMatrixHelper.length ; ++rowIndex){
            let temp = transfromToMatrixHelper[rowIndex].split("	");
            this.copyCutData.push(temp);
        }
        // return;
        this.startCellsX = lx;
        this.startCellsY = ly;
        if(this.copyCutData.length) this.endCellsY = ly + this.copyCutData.length - 1;
        this.endCellsX = lx;
        if(this.copyCutData[0]) this.endCellsX = lx + this.copyCutData[0].length - 1;


        for(let j = 0; j < this.copyCutData.length ; ++j){
            for(let i = 0; i < this.copyCutData[0].length ; ++i){
                this.data[j + ly][i + lx] = this.copyCutData[j][i];
            }
        }

        this.drawGrid();
        this.selection = 1;
        this.drawSelection();
        this.selection = 0;
    }

    handleCopy(){
        if(this.isCellsCopyCut === 0) return;

        let copyCutAnimationDiv = document.getElementById("copyCutAnimationDiv");
            // console.log(copyCutAnimationDiv);
        if(!copyCutAnimationDiv){
            this.createCopyCutAnimationDiv();
        }


        let selectionLeftSpace = 0;
        let selectionTopSpace = 0; 
        let selectionHeight = 0;
        let selectionWidth = 0;

        let lx = Math.min(this.copyCutStartX,this.copyCutEndX);
        let ly = Math.min(this.copyCutStartY,this.copyCutEndY);
        let hx = Math.max(this.copyCutStartX,this.copyCutEndX);
        let hy = Math.max(this.copyCutStartY,this.copyCutEndY);


        // if(
        //     this.copyCutStartX !== lx &&
        //     this.copyCutStartY !== ly &&
        //     this.copyCutEndX !== hx &&
        //     this.copyCutEndY !== hy
        // ){
            
        // }

        
        
        for(let x = 0; x < lx; ++x){
            selectionLeftSpace += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        }
        for(let y = 0; y < ly; ++y){
            selectionTopSpace += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        }

        for(let x = lx; x <= hx ; ++x){
            selectionWidth += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        }
        for(let y = ly; y <= hy; ++y){
            selectionHeight += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        }

        this.copyCutAnimationDiv.style.top = `${selectionTopSpace + this.canvasTop.height - 1}px`;
        this.copyCutAnimationDiv.style.left = `${selectionLeftSpace + this.canvasLeft.width - 1}px`;
        this.copyCutAnimationDiv.style.width = `${selectionWidth + 2}px`;
        this.copyCutAnimationDiv.style.height = `${selectionHeight + 2}px`;

        
        const style = document.createElement('style');
        const keyframes = `
        @keyframes border-dance {
        0% {
            background-position: 0px 0px, 100px ${selectionHeight}px, 0px 100px, ${selectionWidth}px 0px;
        }
        100% {
            background-position: 100px 0px, 0px ${selectionHeight}px, 0px 0px, ${selectionWidth}px 100px;
        }
        }`;
        style.textContent = keyframes;
        document.head.appendChild(style);

        let copyToClipboardString = "";
        // this.copyCutData = [];

        for(let j = ly; j <= hy ; ++j){
            // let tempRow = [];
            for(let i = lx; i <= hx ; ++i){
                // tempRow.push(this.data[j][i]);
                copyToClipboardString += (this.data[j][i] || "") + ((i===hx) ?"\n": "	" );
            }
            // this.copyCutData.push(tempRow);
        }
        
        this.copyToClipboard(copyToClipboardString);
        this.canvasDiv.append(this.copyCutAnimationDiv);
    }

    async copyToClipboard(text) {
        await navigator.clipboard.writeText(text).then(
            () => {
                // console.log('Text copied to clipboard successfully!');
            },
            (err) => {
                console.error('Could not copy text: ', err);
            }
        );
    }

    
    
    async getClipboardData() {
        await navigator.clipboard.readText().then(
            (text) => {
                // console.log(text);
                this.copyCutData = text;
                // console.log(this.copyCutData);
                this.handlePaste();
            },
            (err) => {
                return "";
            }
        );
    }
      
      
      

    

    mainCanvasKeyUp(e){
        if(this.ipBox.style.display != "none"){
            // console.log(ipBox.value,this.ipBox.style.display);
            this.data[this.startCellsY][this.startCellsX] = ipBox.value;
            // this.ipBox.style.display = "none";
            // this.ipBox.value = "";
        }
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
        let offset = this.canvasTop.getBoundingClientRect();

        this.selection = 1;
        this.startCellsX = this.getColumnNumber(e.clientX - offset.x);
        this.startCellsY = this.getRowNumber(e.offsetY);
        this.endCellsX = this.startCellsX;
        this.endCellsY = this.startCellsY;

        if(this.ipBox.style.display != "none"){
            console.log(ipBox.value);
            this.data[this.startCellsY][this.startCellsX] = ipBox.value;
            this.ipBox.value = "";
            this.ipBox.style.display = "none";
        }

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
        this.isClickedOnLeftHeadingCanvas = 0;
        this.isClickedOnMainCanvas = 0;
        this.isClickedOnTopHeadingCanvas = 0;
        // this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.drawGrid();
        // this.drawTableData();

    }

    windowPointerMove(e){
        // console.log("X", e.clientX,e.clientY)
        // console.log(e.clientX, e.clientY);
        if(this.isClickedOnLeftHeadingCanvas === 1){
            this.resizeRowPointerMove(e);
            // console.log("Clicked on top");
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
        // else{
        //     console.log(e.clientX, e.clientY);
        // }

        // console.log(this.isClickedOnLeftHeadingCanvas, this.isClickedOnMainCanvas, this.isClickedOnTopHeadingCanvas);

    }

    windowPointerUp(e){

        // this.ipBox.style.display = "none";
        // console.log(e.offsetX, e.offsetY);
        // this.selection = 1;
        // this.startCellsX = this.getColumnNumber(e.offsetX);
        // this.startCellsY = this.getRowNumber(e.offsetY);

        // const ipBoxCellX = this.startCellsX;
        // const ipBoxCellY = this.startCellsY;
        

        // let ipBoxX = this.canvasLeft.width;
        // let ipBoxY = this.canvasTop.height;

        // for(let x = 0; x < ipBoxCellX; ++x){
        //     ipBoxX += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        // }
        // for(let y = 0; y < ipBoxCellY; ++y){
        //     ipBoxY += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        // }

        // this.ipBox.style.width = `${this.columnWidth - 2 + (this.topSizeMap[this.startCellsX + 1] || 0)}px`;        
        // this.ipBox.style.height = `${this.rowHeight - 2 + (this.leftSizeMap[this.startCellsY + 1] || 0)}px`;      

        // this.ipBox.style.top = `${ipBoxY + 1}px`;
        // this.ipBox.style.left = `${ipBoxX + 1}px`;
        
        // this.ipBox.value = this.data[this.startCellsY][this.startCellsX];
        // console.log(this.data[this.startCellsY][this.startCellsX]);
        // this.ipBox.style.display = "block";
        // this.ipBox.focus();
        // this.ipBox.style.display = "none";
        // constructor();
        // this.ipBox.releasePointerCapture();
        //////////////////////////////////
        // console.log("X", e.clientX,e.clientY);
        this.selection = 0;
        
        if(this.isClickedOnLeftHeadingCanvas === 1) this.resizeRowPointerUp(e);
        if(this.isClickedOnTopHeadingCanvas === 1) this.resizeColumnPointerUp(e);
        if(this.isClickedOnMainCanvas === 1)this.selectionPointerUp(e);
        
        this.isClickedOnLeftHeadingCanvas = 0;
        this.isClickedOnMainCanvas = 0;
        this.isClickedOnTopHeadingCanvas = 0;


    }
    
    topHeadingPointerMove(e){
        // console.log("K")
        let offset = this.canvasTop.getBoundingClientRect();
        if(this.isClickedOnTopHeadingCanvas === 0){
            if(this.isIntersectRegionTop(e.offsetX)){
                this.canvasTop.style.cursor = "ew-resize";
            }
            else{
                this.canvasTop.style.cursor = "s-resize";
            }
        }
    }

    leftHeadingPointerMove(e){
        // console.log(this.isIntersectRegionLeft(e.offsetY));
        if(this.isClickedOnLeftHeadingCanvas === 0){
            if(this.isIntersectRegionLeft(e.offsetY)){
                this.canvasLeft.style.cursor = "ns-resize";
            }
            else{
                this.canvasLeft.style.cursor = "w-resize";
            }
        }
    }
    lastTime = 0;
    drawSelection(timeStamp) {
        // console.log("selection");
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;




        if(this.selection === 1 && this.startCellsX != -1){

            let selectionLeftSpace = 0;
            // this.canvasLeft.width;
            let selectionTopSpace = 0; 
            // this.canvasTop.height;

            let lx= Math.min(this.startCellsX,this.endCellsX);
            let ly= Math.min(this.startCellsY,this.endCellsY);
            let hx= Math.max(this.startCellsX,this.endCellsX);
            let hy= Math.max(this.startCellsY,this.endCellsY);
            // console.log(
            //     this.startCellsX,this.endCellsX,
            //     this.startCellsY,this.endCellsY
            // )
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
            // this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
            // this.ctxCanvasLeft.fillStyle = "#caead8";
            // this.ctxCanvasLeft.fillRect(
            //     0,
            //     selectionTopSpace,
            //     this.canvasLeft.width,
            //     selectionHeight
            // );
            // console.log(1234);
            this.drawLeftHeadingsGrid();
            this.drawTableLeftHeading();
            


            // ----------- Top Heading Canvas Selection -------------
            // this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
            // this.ctxCanvasTop.fillStyle = "#caead8";
            // this.ctxCanvasTop.fillRect(
            //     selectionLeftSpace,
            //     0,
            //     selectionWidth,
            //     this.canvasTop.height
            // );
            this.drawTopHeadingsGrid();
            this.drawTableTopHeading();
            // this.ctxCanvasTop.lineWidth = 2;
            // this.ctxCanvasTop.strokeStyle = "rgb(16,124,65)";
            // this.ctxCanvasTop.strokeRect(
            //     selectionLeftSpace - 1 ,
            //     this.canvasTop.height - 1,
            //     selectionWidth + 2,
            //     2
            // )

            // ----------- Main Canvas Selection -------------
            this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctxCanvas.fillStyle = "#e7f1ec";
            this.ctxCanvas.fillRect(
                selectionLeftSpace,
                selectionTopSpace,
                selectionWidth,
                selectionHeight
            );
            // this.drawGrid();
            this.drawWhiteSelectionBlock();
            this.drawTableData();
            this.ctxCanvas.lineWidth = 2;
            this.ctxCanvas.strokeStyle = "rgb(16,124,65)";
            this.ctxCanvas.strokeRect(
                selectionLeftSpace - 1,
                selectionTopSpace - 1,
                selectionWidth + 2,
                selectionHeight + 2
            );
            
            this.handleCopy();
        }
        else{
            this.drawGrid();
            this.drawTableData();
        }

        // console.log(deltaTime);
        // selectionAnimation = 
        // requestAnimationFrame(this.drawSelection(1));
        

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
            for(let j = 0; j < response.data.length; ++j){
                for( let i = 0; i< response.data[0].length ; ++i){
                    this.data[j][i] = response.data[j][i];
                }
            }
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

    resetDivSel() {
        this.ipBox.style.display = "block";
        this.ipBox.focus();
        this.ipBox.style.display = "none";
    }

    drawTopHeadingsGrid() {
        let selectionLeftSpace = 0;
        let selectionWidth = 0;
        let lx= Math.min(this.startCellsX,this.endCellsX);
        let hx= Math.max(this.startCellsX,this.endCellsX);

        for(let x = 0; x < lx; ++x){
            selectionLeftSpace += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        }
        for(let x = lx; x <= hx ; ++x){
            selectionWidth += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        }

        if(this.startCellsX !== -1 && this.startCellsY !== -1){
            this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
            this.ctxCanvasTop.fillStyle = "#caead8";
            this.ctxCanvasTop.fillRect(
                selectionLeftSpace,
                this.canvasTop.height / 2,
                selectionWidth,
                this.canvasTop.height
            );
        }

        let offset = this.canvasTop.getBoundingClientRect();

        lx = Math.min(this.startColX, this.endColX);
        hx = Math.max(this.startColX, this.endColX);

        
        let lowX = Math.min(this.startCellsX,this.endCellsX);
        let highX = Math.max(this.startCellsX,this.endCellsX);

        

        if(this.startColX != -1 && this.endColX != -1){
            
            this.ctxCanvasTop.fillStyle = "#107c41";
            this.ctxCanvasTop.fillRect(
                selectionLeftSpace,
                this.canvasTop.height / 2,
                selectionWidth,
                this.canvasTop.height / 2
            );
            this.ctxCanvasTop.strokeRect(
                selectionLeftSpace,
                this.canvasTop.height / 2,
                selectionWidth,
                this.canvasTop.height / 2
            );
        }
        



        let cellPositionX = 0;
        for(let x = 0; cellPositionX <= this.canvasTop.width; x++){
            
            cellPositionX += this.columnWidth + (this.topSizeMap[x+1] || 0);
            this.ctxCanvasTop.save();
            this.ctxCanvasTop.beginPath();
            this.ctxCanvasTop.moveTo(cellPositionX + 0.5 ,this.canvasTop.height / 2);
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

            if(x === this.moveStartX) {
            //     // console.log(9821,100, offset.y);
                this.dottedVerticalLineDiv.style.top = `${0}px`;
                this.dottedVerticalLineDiv.style.height = `${this.canvas.height}px`;
                this.dottedVerticalLineDiv.style.left = `${cellPositionX + 0}px`;
            }
            
        }

        this.ctxCanvasTop.save();
        this.ctxCanvasTop.beginPath();
        this.ctxCanvasTop.moveTo(0,this.canvasTop.height - 0.5);
        this.ctxCanvasTop.lineTo(this.canvasTop.width, this.canvasTop.height - 0.5 );
        this.ctxCanvasTop.lineWidth=0.5;
        this.ctxCanvasTop.strokeStyle = "#555";
        this.ctxCanvasTop.stroke();
        this.ctxCanvasTop.restore();


        if(this.startCellsX !== -1 && this.startCellsY !== -1){
            this.ctxCanvasTop.lineWidth = 2;
            this.ctxCanvasTop.strokeStyle = "rgb(16,124,65)";
            this.ctxCanvasTop.strokeRect(
                selectionLeftSpace - 1 ,
                this.canvasTop.height - 1,
                selectionWidth + 2,
                2
            );
        }
        
        
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

        let ly= Math.min(this.startCellsY,this.endCellsY);
        let hy= Math.max(this.startCellsY,this.endCellsY);

        let selectionTopSpace = 0;
        let selectionHeight = 0; 

        for(let y = 0; y < ly; ++y){
            selectionTopSpace += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        }
        for(let y = ly; y <= hy; ++y){
            selectionHeight += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        }

        if(this.startCellsX !== -1 && this.startCellsY !== -1){
            this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
            this.ctxCanvasLeft.fillStyle = "#caead8";
            this.ctxCanvasLeft.fillRect(
                0,
                selectionTopSpace,
                this.canvasLeft.width,
                selectionHeight
            );
        }



        ly = Math.min(this.startRowY, this.endRowY);
        hy = Math.max(this.startRowY, this.endRowY);

        let offset = this.canvasLeft.getBoundingClientRect();

        let lowY = Math.min(this.startCellsY,this.endCellsY);
        let highY = Math.max(this.startCellsY,this.endCellsY);

        if(this.startRowY != -1 && this.endRowY != -1){
            // let topSpace = 0;
            // let selectionHeight = 0;
            
            // for(let y = 0; y < ly; ++y){
            //     topSpace += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
            // }
            // for(let y = ly; y <= hy; ++y){
            //     selectionHeight += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
            // }
            this.ctxCanvasLeft.fillStyle = "#107c41";
            this.ctxCanvasLeft.fillRect(
                0,
                selectionTopSpace,
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
            

            if(ly-1 == y){
                this.ctxCanvasLeft.lineWidth=5;
                this.ctxCanvasLeft.strokeStyle = "#107c41";
            }
            else if(y == hy){
                this.ctxCanvasLeft.lineWidth=3;
                this.ctxCanvasLeft.strokeStyle = "#107c41";
            }
            else if(ly <= y && y < hy){
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
            if(y === this.moveStartY){
                // console.log(cellPositionY , offset.y)
                this.dottedHorizontalLineDiv.style.top = `${cellPositionY + 0}px`;
                this.dottedHorizontalLineDiv.style.width = `${this.canvas.width}px`;
                this.dottedHorizontalLineDiv.style.left = `${0}px`;
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
        if(this.startCellsX !== -1 && this.startCellsY !== -1){
            this.ctxCanvasLeft.lineWidth = 2;
            this.ctxCanvasLeft.strokeStyle = "rgb(16,124,65)";
            this.ctxCanvasLeft.strokeRect(
                this.canvasLeft.width - 1,
                selectionTopSpace - 1,
                2,
                selectionHeight + 2
            )
        }
        
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
            this.ctxCanvas.strokeStyle = "rgb(210,210,210)";
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
            this.ctxCanvas.strokeStyle = "rgb(210,210,210)";
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
        let y = 1.5;

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
            // this.ctxCanvasLeft.textAlign = "right";

            this.ctxCanvasLeft.fillText(
                // this.data[this.startX][this.startY],
                start + 1,
                this.canvasLeft.width - 5,
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
        this.ctxCanvas.fillStyle = "#000";
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

        
        for (var i = 0; this.startX < 50; i++,this.startX++) {
            // ctx.fillText(columnHeaders[i], columnWidth * i + columnWidth / 2, rowHeight / 2);
            y += (this.rowHeight / 2) + (this.leftSizeMap[i+1]/2  || 0);
            for (var j = 0; this.startY < 50 ;j++,this.startY++) {

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
                
                
                if(this.data[this.startX] && this.data[this.startX][this.startY]){
                    this.ctxCanvas.fillText(
                        this.shortenText(this.data[this.startX][this.startY],((((this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0))/4)-3)),
                        // j * this.columnWidth + this.columnWidth / 2,
                        x,
                        // i * this.rowHeight + (this.rowHeight / 2) + 6
                        y + 6
                    );
                }
                
                x += (this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0);
                
            }
            y += (this.rowHeight / 2) + (this.leftSizeMap[i+1]/2  || 0);
            this.startY=startY;
            x=0;
        }
    }


    // this.canvas.addEvent
    

    
}