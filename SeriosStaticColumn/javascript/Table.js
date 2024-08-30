import cacheCoordinates from "./cacheCoordinates.js";
import StatisticsCalculator from "./StatisticsCalculator.js";

export default class Table {
    /**
     * @type {HTMLCanvasElement}
     */


    canvas ;
    canvasTop;
    canvasLeft;

    headermap = ["Email","Name","Country","State","City","Telephone","Address1","Address2","DOB","FY_19_20","FY_20_21","FY_21_22","FY_22_23","FY_23_24"]

    headermapLower = ["email","name","country","state","city","telephone","address1","address2","dob","fY_19_20","fY_20_21","fY_21_22","fY_22_23","fY_23_24"]


    
    ctxCanvas ;
    // ctxCanvasTop ;
    // ctxCanvasLeft ;
    columnWidth = 100;
    rowHeight = 20;

    minCountRow = 0;
    minCountCol = 0;
    maxCountRow = 1048576;
    maxCountCol = 2000000/100; //16384;

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

    defaultTableWidth = 1400;
    defaultTableHeight = 880;
    dataRow = [];
    data = new Map();
    // Array.from({ length: 100 }, () => Array(100).fill());;
    
    isCellsCopyCut = 0;
    isCutFlag = 0;
    // copyCutData = [];
    copyCutStartX = -1;
    copyCutStartY = -1;
    copyCutEndX = -1;
    copyCutEndY = -1;
    selectedChart = null;

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
    verticalMainCanvasID = 1;
    topSizeMap = new Object();
    leftSizeMap = new Object();

    ipBox;
    selectionDiv;
    copyCutAnimationDiv;

    scrollXaxisValue = 0;
    scrollYaxisValue = 0;

    


    constructor(mainCanvasName) {
        this.topCellCache = 0;
        this.leftCellCache = 0;
        this.topSpaceCache = 0;
        this.leftSpaceCache = 0;
        this.sheetID = mainCanvasName;
        this.isSelectedAll = false;
        console.log("Window Device Pixel Ratio", window.devicePixelRatio);
        // console.log("Sheet ID", this.sheetID);


        this.canvasDiv = document.getElementById(`canvasDiv`);
        this.fixedOnFrame = document.getElementById(`fixedOnFrame`);
        this.canvasDivDiv = document.getElementById("canvasDivDiv");
        this.canvasMainDiv = document.getElementById(`canvasMain`);
        this.canvasTopDiv = document.getElementById("canvasTopDiv");
        this.canvasLeftDiv = document.getElementById("canvasLeftDiv");
        
        
        this.barChartBtn = document.getElementById("barChartBtn");
        this.lineChartBtn = document.getElementById("lineChartBtn");
        this.pieChartBtn = document.getElementById("pieChartBtn");
        this.scatterChartBtn = document.getElementById("scatterChartBtn");
        this.areaChartBtn = document.getElementById("areaChartBtn");
        this.uploadform = document.getElementById("uploadForm");
        this.fileIP = document.getElementById("ChooseFile");


        this.ipBox = document.getElementById("ipBox");
        this.FindipBox = document.getElementById("findTextId");
        this.searchSuggestion = document.getElementById("searchSuggestion");
        this.copyCutAnimationDiv = document.getElementById("copyCutAnimationDiv");
        this.dottedVerticalLineDiv = document.getElementById("dottedVerticalLineDiv");
        this.dottedHorizontalLineDiv = document.getElementById("dottedHorizontalLineDiv");


        this.isCellsCopyCut = 0;
        this.copyCutStartX = -1;
        this.copyCutStartY = -1;
        this.copyCutEndX = -1;
        this.copyCutEndY = -1;
        this.statCalRef = [];
        if(this.ipBox) this.ipBox.style.display = `none`;
        if(this.copyCutAnimationDiv) this.copyCutAnimationDiv.remove(); 
        if(this.dottedVerticalLineDiv) this.dottedVerticalLineDiv.style.display = `none`;
        if(this.dottedHorizontalLineDiv) this.dottedHorizontalLineDiv.style.display = `none`;
        
        
        this.isIntersectRegionTop = this.isIntersectRegionTop.bind(this);
        this.resizeColumnPointerDown = this.resizeColumnPointerDown.bind(this);
        this.resizeColumnPointerMove = this.resizeColumnPointerMove.bind(this);
        this.resizeColumnPointerUp = this.resizeColumnPointerUp.bind(this);
        this.getColumnNumber = this.getColumnNumber.bind(this);


        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this.handleDeleteAll = this.handleDeleteAll.bind(this);
        this.handleUploadingCSV = this.handleUploadingCSV.bind(this);
        this.isFindActive = false;
        this.findStrData = "";

        
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
        this.getRecomendations = this.getRecomendations.bind(this);
        this.hideRecomendations = this.hideRecomendations.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
        this.handleFindReplace = this.handleFindReplace.bind(this);
        this.handleFind = this.handleFind.bind(this);
        this.handleReplace = this.handleReplace.bind(this);
        this.handleFindAll = this.handleFindAll.bind(this);
        this.handleReplaceAll = this.handleReplaceAll.bind(this);

        this.drawSelection = this.drawSelection.bind(this);
        this.drawSelectionDiv = this.drawSelectionDiv.bind(this);
        this.handleUploadBar = this.handleUploadBar.bind(this);

        
        this.drawTopHeadingsGrid = this.drawTopHeadingsGrid.bind(this);
        this.drawTableTopHeading = this.drawTableTopHeading.bind(this);
        
        this.topHeadingPointerMove = this.topHeadingPointerMove.bind(this);
        this.leftHeadingPointerMove = this.leftHeadingPointerMove.bind(this);
        
        this.windowPointerMove = this.windowPointerMove.bind(this);
        this.windowPointerUp = this.windowPointerUp.bind(this);

        
        this.makeChartDraggable = this.makeChartDraggable.bind(this);
        this.createBarChart = this.createBarChart.bind(this);
        this.createLineChart = this.createLineChart.bind(this);
        this.createPieChart = this.createPieChart.bind(this);
        this.createScatterChart = this.createScatterChart.bind(this);
        this.createAreaChart = this.createAreaChart.bind(this);

        this.setCellValue = this.setCellValue.bind(this);
        this.setOnlyCellValue = this.setOnlyCellValue.bind(this);
        this.getCellValue = this.getCellValue.bind(this);
        this.deleteCell = this.deleteCell.bind(this);

        
        this.uploadFormSubmitFunc = this.uploadFormSubmitFunc.bind(this);
        this.handleScrollDataPagination = this.handleScrollDataPagination.bind(this);


        this.scrollXrefreshValue = 300;
        this.scrollYrefreshValue = 4000;
        
        
    }

    refresh(){
        // console.log("refresh");
        this.drawTableTopHeading();
        this.drawTableLeftHeading();

        
        this.selection = 1;
        this.drawSelection();
        this.selection = 0;
    }

    async uploadFormSubmitFunc(e){
        e.preventDefault(); 
        // this.fileIP = document.getElementById("ChooseFile");
        // console.log(this.fileIP, this.fileIP.value);
        console.warn("clicked submit");
        if (this.fileIP.value === "") {
            alert("Please choose a file");
        } else {
            const fileInput = document.getElementById("ChooseFile");
            const formData = new FormData();
    
            formData.append("file", fileInput.files[0]);
            formData.append("sheetID", this.sheetID);

            // console.log(formData.get("file"));
            // console.log(formData.get("sheetId"));
            
            console.warn("Pre fun");
            await this.handleUploadingCSV(formData);
            console.warn("Post Fun");
        }
        
        console.warn("Post --------------------------------- Fun");
    }
    async handleUploadingCSV(formData){
        console.warn("Start Fun");
        // try {
            await axios.post("http://localhost:5163/api/_CSVfileUpload", formData
            //     {
            //     file : fileInput.files[0],
            //     sheetId : 9821
            // }, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // }
        )
            .then(async (response) => {
                this.handleUploadBar();
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error);
            });
            
        // } catch (error) {
        //     console.error("Error ", error);
        //     alert("Error ", error);
        // }
        console.warn("End Fun");
    }

    async handleUploadBar(){
        var statusBar = document.getElementById("statusBar");
        var fillStatusBar = document.getElementById("fillStatusBar");
        var uploadSucceed = document.getElementById("upload-succeed");
    
        await axios.get(`http://localhost:5163/api/getUploadStatus`)
            .then((response) => {
                if(response.data === -1){
                    
                }
                else if(response.data >= 100){
                    statusBar.style.display = `none`;
                    uploadSucceed.style.display = `flex`;
                    // alert(`File Uploaded Succeed..!!! 🎉`);
                    Swal.fire({
                        title: 'Success!',
                        text: 'File Upload Succeed..!!! 🎉',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            await this.loadData();
                            this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
                            this.selection = 1;
                            this.drawSelection();
                            this.selection = 0;
                            // location.reload(); // User clicks "OK"
                        }
                    });

                    return;
                }
                else{
                    statusBar.style.display = `block`;
                    fillStatusBar.style.width = `${response.data}%`;
                    // fillStatusBar.innerHTML = `${response.data}%`;
                }

                setTimeout(this.handleUploadBar, 1000);
    
            })
            .catch(
                (error) => {
                    console.error("Error:", error);
                }
            );
    
    
        // if(!fillBar){
        //     var secondTopLine = document.getElementById("secondTopLine");
        //     var bar = document.createElement("div");
        //     fillBar = document.createElement("div");
        //     fillBar.id = "fillBar";
        //     secondTopLine.append(bar);
        //     bar.append(fillBar);
    
        //     bar.style.marginTop = `40px`;
        //     bar.style.height = `20px`;
        //     bar.style.width = `500px`;
        //     bar.style.border = `1px solid black`;
    
        //     fillBar.style.height = `100%`;
        //     fillBar.style.backgroundColor = '#137e43'
        // }
            
    }

    async handleScrollDataPagination(e){
            
        this.scrollXrefreshValue += Math.abs(this.canvasDivDiv.scrollLeft - this.scrollXaxisValue);
        this.scrollYrefreshValue += Math.abs(this.canvasDivDiv.scrollTop - this.scrollYaxisValue);

        this.scrollXaxisValue = this.canvasDivDiv.scrollLeft;
        this.scrollYaxisValue = this.canvasDivDiv.scrollTop;
        
        this.topCellCache = this.getRowNumber(this.scrollYaxisValue);
        this.leftCellCache = this.getColumnNumber(this.scrollXaxisValue);
        this.topSpaceCache = this.getTopHeight(this.topCellCache);
        this.leftSpaceCache = this.getLeftWidth(this.leftCellCache);

        // console.log(this.scrollYaxisValue);
        if(this.scrollXrefreshValue >= 4000){
            this.scrollXrefreshValue = 0;
            await this.loadData( Math.ceil(this.scrollXaxisValue/this.columnWidth) ,  Math.ceil(this.scrollYaxisValue/this.rowHeight));
        }
        if(this.scrollYrefreshValue >= 1000){
            this.scrollYrefreshValue = 0;
            await this.loadData( Math.ceil((this.scrollXaxisValue)/this.columnWidth) ,  Math.ceil((this.scrollYaxisValue)/this.rowHeight));
        }
        // if(this.scrollXaxisValue%1000 === 0){
        //     this.loadData( this.scrollXaxisValue/this.columnWidth ,  this.scrollYaxisValue/this.rowHeight);
        // }
        this.refresh();
    }

    addEventListeners() {

        // this.canvasDivDiv.addEventListener("scroll",(e) => this.handleScroll);

        this.canvas.addEventListener("pointerdown", this.selectionPointerDown);
        this.canvas.addEventListener('dblclick', this.placeInputBox);
        
        this.canvasTop.addEventListener("pointerdown", this.resizeColumnPointerDown);
        this.canvasTop.addEventListener('pointermove', this.topHeadingPointerMove);

        this.canvasLeft.addEventListener("pointerdown", this.resizeRowPointerDown);
        this.canvasLeft.addEventListener('pointermove', this.leftHeadingPointerMove);
        
        window.addEventListener('pointermove', this.windowPointerMove);
        window.addEventListener('pointerup', this.windowPointerUp);
        window.addEventListener('pointerleave', this.windowPointerUp);
        window.addEventListener('pointercancel', this.windowPointerUp);
        window.addEventListener('keydown', this.mainCanvasKeyDown);
        window.addEventListener('keyup', this.mainCanvasKeyUp);

        this.ipBox.addEventListener("keypress", this.ipBoxKeyDown);

        
        this.barChartBtn.addEventListener("click", this.createBarChart);
        this.lineChartBtn.addEventListener("click", this.createLineChart);
        this.pieChartBtn.addEventListener("click", this.createPieChart);
        this.scatterChartBtn.addEventListener("click", this.createScatterChart);
        this.areaChartBtn.addEventListener("click", this.createAreaChart);

        
        this.uploadform.addEventListener("submit", this.uploadFormSubmitFunc);
        this.canvasDivDiv.addEventListener("scroll", this.handleScrollDataPagination);

        
        document.addEventListener('paste', function(e) {
            // console.log(e);
            // console.log(e.clipboardData);
            if (e.clipboardData.types.indexOf('text/html') > -1) {
                var oldData = e.clipboardData.getData('text/html');
                var newData = '<b>Ha Ha!</b> ' + oldData;
                console.log(oldData);
                // console.log(newData);
                e.preventDefault();
            }
        });
    }
    async getRecomendations(e){
        this.searchSuggestion = document.getElementById("searchSuggestion");
        if(this.FindipBox.value.length >= 2 && this.FindipBox === document.activeElement){
            this.searchSuggestion.innerHTML = ``;
            await axios.post(`http://localhost:5163/api/getRecomendation?query=${this.FindipBox.value}`)
            .then((response) => {
                
                for(let j = 0; j < response.data.length; ++j){
                    this.searchSuggestion.innerHTML += `
                    <li class="suggestion"> 
                        <div class="suggestionText"> ${response.data[j]["cellValue"]} </div>
                        <div class="suggestionPosition"> ${this.convertToTitle(response.data[j]["colNo"])}${response.data[j]["rowNo"]} </div>
                    </li>
                    `
                }
                console.log("object");
                var suggestionDivs = document.getElementsByClassName('suggestionText');
                var FindipBox = document.getElementById('findTextId');
                for(let i = 0; i < suggestionDivs.length ; ++i){
                    suggestionDivs[i].addEventListener('click', function() {
                      console.log(FindipBox.value);
                        FindipBox.value = suggestionDivs[i].innerHTML;
                    });
                }
            })
            .catch(
                (error) => {
                    console.error("Error:", error);
                }
            );
            this.searchSuggestion.style.display = `block`;
        }
        else{
            this.searchSuggestion.style.display = `none`;
        }
    }
    hideRecomendations(e){
        this.searchSuggestion.style.display = `none`;
    }

    removeEventListeners() {

        // this.canvasDivDiv.removeEventListener("scroll",(e) => this.handleScroll);

        this.canvas.removeEventListener("pointerdown", this.selectionPointerDown);
        this.canvas.removeEventListener('dblclick', this.placeInputBox);
        
        this.canvasTop.removeEventListener("pointerdown", this.resizeColumnPointerDown);
        this.canvasTop.removeEventListener('pointermove', this.topHeadingPointerMove);

        this.canvasLeft.removeEventListener("pointerdown", this.resizeRowPointerDown);
        this.canvasLeft.removeEventListener('pointermove', this.leftHeadingPointerMove);
        
        window.removeEventListener('pointermove', this.windowPointerMove);
        window.removeEventListener('pointerup', this.windowPointerUp);
        window.removeEventListener('pointerleave', this.windowPointerUp);
        window.removeEventListener('pointercancel', this.windowPointerUp);
        window.removeEventListener('keydown', this.mainCanvasKeyDown);
        window.removeEventListener('keyup', this.mainCanvasKeyUp);

        this.ipBox.removeEventListener("keypress", this.ipBoxKeyDown);

        
        this.barChartBtn.removeEventListener("click", this.createBarChart);
        this.lineChartBtn.removeEventListener("click", this.createLineChart);
        this.pieChartBtn.removeEventListener("click", this.createPieChart);
        this.scatterChartBtn.removeEventListener("click", this.createScatterChart);
        this.areaChartBtn.removeEventListener("click", this.createAreaChart);

        
        this.uploadform.removeEventListener("submit", this.uploadFormSubmitFunc);
        this.canvasDivDiv.removeEventListener("scroll", this.handleScrollDataPagination);





        
        document.removeEventListener('paste', function(e) {
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

    // handleScroll(){
    //     this.scrollXaxisValue = this.canvasDivDiv.scrollLeft;
    //     this.scrollYaxisValue = this.canvasDivDiv.scrollTop;
    //     this.refresh();
    // }

    makeChartDraggableOverWindow(divToBeDraggable){
        
        let offsetX, offsetY;


        divToBeDraggable.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            offsetX = e.clientX - divToBeDraggable.getBoundingClientRect().left 
            // + this..getBoundingClientRect().left 
            ;
            offsetY = e.clientY  - divToBeDraggable.getBoundingClientRect().top 
            // + this.canvasMainDiv.getBoundingClientRect().top
            ;

            document.addEventListener('pointermove', moveElement);
            document.addEventListener('pointerup', stopMovingElement);
        });

        function moveElement(e) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            divToBeDraggable.style.left = `${Math.max(x,0)}px`;
            divToBeDraggable.style.top = `${Math.max(y,0)}px`;
        }

        function stopMovingElement() {
            document.removeEventListener('pointermove', moveElement);
            document.removeEventListener('pointerup', stopMovingElement);
        }
    }


    makeChartDraggable(chartDiv){
        
        let offsetX, offsetY;


        chartDiv.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.selectedChart = chartDiv;
            offsetX = e.clientX - chartDiv.getBoundingClientRect().left + this.canvasMainDiv.getBoundingClientRect().left ;
            offsetY = e.clientY - chartDiv.getBoundingClientRect().top + this.canvasMainDiv.getBoundingClientRect().top;

            document.addEventListener('pointermove', moveElement);
            document.addEventListener('pointerup', stopMovingElement);
        });

        function moveElement(e) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            chartDiv.style.left = `${Math.max(x,0)}px`;
            chartDiv.style.top = `${Math.max(y,0)}px`;
        }

        function stopMovingElement() {
            document.removeEventListener('pointermove', moveElement);
            document.removeEventListener('pointerup', stopMovingElement);
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
    }

    setSQChartDivProperties(chartDiv){
        chartDiv.style.height = `388px`;
        chartDiv.style.width = `388px`;
        chartDiv.style.position = `absolute`;
        chartDiv.style.top = `100px`;
        chartDiv.style.left = `100px`;
        chartDiv.style.backgroundColor = `#fff`;
        chartDiv.style.padding = `10px`;
        chartDiv.style.border = `1px solid rgb(210,210,210)`;
    }

    setChartCanvasProperties(chartCanvas){
        chartCanvas.height = 288;
        chartCanvas.width = 480;
    }

    handleMarchingAnts(){
        // console.log("joke");
        if(this.isCellsCopyCut === 0) return;

        this.copyCutAnimationDiv = document.getElementById("copyCutAnimationDiv");
            // console.log(copyCutAnimationDiv);
        if(!this.copyCutAnimationDiv){
            this.createCopyCutAnimationDiv();
        }

        let selectionLeftSpace = - this.scrollXaxisValue;
        let selectionTopSpace = - this.scrollYaxisValue;
        let selectionHeight = 0;
        let selectionWidth = 0;

        let lx = Math.min(this.copyCutStartX,this.copyCutEndX);
        let ly = Math.min(this.copyCutStartY,this.copyCutEndY);
        let hx = Math.max(this.copyCutStartX,this.copyCutEndX);
        let hy = Math.max(this.copyCutStartY,this.copyCutEndY);

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
        this.copyCutAnimationDiv.style.display = `block`
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
        
        this.fixedOnFrame.append(this.copyCutAnimationDiv);

        if(this.isCutFlag === 1){
            this.ctxCanvas.fillStyle = "rgba(255,255,255,0.7)";
            this.ctxCanvas.fillRect(
                selectionLeftSpace,
                selectionTopSpace,
                selectionWidth,
                selectionHeight
            );
        }
    }

    getSelectionDataForChart(){
        let chartDataX = this.startCellsX;
        let chartDataY = this.startCellsY;
        let chartData = [];
        let chartLabel = [];

        for(let i = 0; i < this.endCellsX - this.startCellsX + 1; ++i){
            let isNum = true;
            let tempDataStore = [];
            for(let j = 0; j < this.endCellsY - this.startCellsY + 1; ++j){
                let x = this.getCellValue(this.startCellsY + j, this.startCellsX + i);
                if(isNaN(x)) isNum = false;
                tempDataStore.push(x);
            }
            if(isNum === true) chartData.push({
                data : tempDataStore,
                label : `Series${chartData.length + 1}`
            });
            else chartLabel = tempDataStore;
        }
        

        return { data : chartData, label : chartLabel || chartData};
    }
    
    getRandomColorName() {
        const colorNames = [
            "Red", "Green", "Blue", "Yellow", "Purple", "Orange", "Pink", 
            "Brown", "Black", "White", "Gray", "Cyan", "Magenta", "Maroon",
            "Olive", "Lime", "Navy", "Teal", "Aqua", "Fuchsia", "Gold", 
            "Silver", "Bronze", "Coral", "Indigo", "Violet", "Salmon", 
            "Turquoise", "Khaki", "Lavender"
        ];
    
        const randomIndex = Math.floor(Math.random() * colorNames.length);
        return colorNames[randomIndex];
    }
    
    
    
    createBarChart(){
        let { data, label} = this.getSelectionDataForChart();
        // console.log({
        //     "Data":data,
        //     "Label":label
        // })

        let chartCanvas = document.createElement("canvas");
        let chartDiv = document.createElement("div");

        this.setChartCanvasProperties(chartCanvas);
        this.setChartDivProperties(chartDiv);
        
        if(this.canvasMainDiv) this.canvasMainDiv.append(chartDiv);
        if(chartDiv) chartDiv.append(chartCanvas);

        let xChart = new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: label,
                // ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: data
                // [{
                //     data: data 
                // }]
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

    createLineChart(){
        let { data, label} = this.getSelectionDataForChart();
        let chartCanvas = document.createElement("canvas");
        let chartDiv = document.createElement("div");

        this.setChartCanvasProperties(chartCanvas);
        this.setChartDivProperties(chartDiv);
        
        if(this.canvasMainDiv) this.canvasMainDiv.append(chartDiv);
        if(chartDiv) chartDiv.append(chartCanvas);
        

        let xChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: label,
                datasets: data,
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

    createPieChart(){
        let { data, label} = this.getSelectionDataForChart();
        let chartCanvas = document.createElement("canvas");
        let chartDiv = document.createElement("div");

        this.setChartCanvasProperties(chartCanvas);
        this.setSQChartDivProperties(chartDiv);
        
        if(this.canvasMainDiv) this.canvasMainDiv.append(chartDiv);
        if(chartDiv) chartDiv.append(chartCanvas);
        

        let xChart = new Chart(chartCanvas, {
            type: 'pie',
            data: {
                labels: label,
                datasets: data,
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
    
    createScatterChart(){
        let { data, label} = this.getSelectionDataForChart();
        // console.log(data);
        let tempdata = [], cnt = 0;
        for(let list = 0; list < data.length; ++list){
            tempdata = [];
            cnt = 0;
            
            for(let element = 0; element < data[list].data.length; ++element){
                tempdata.push({
                    x:++cnt,
                    y:data[list].data[element]
                });
            }
            data[list].data = tempdata;
            data[list].pointRadius = 4;
            // data[list].pointBackgroundColor = this.getRandomColorName();
            data[list].border = 0;
        }

        


        let chartCanvas = document.createElement("canvas");
        let chartDiv = document.createElement("div");

        this.setChartCanvasProperties(chartCanvas);
        this.setChartDivProperties(chartDiv);
        
        if(this.canvasMainDiv) this.canvasMainDiv.append(chartDiv);
        if(chartDiv) chartDiv.append(chartCanvas);
        

        let xChart = new Chart(chartCanvas, {
            type: 'scatter',
            data: {
                labels: label,
                datasets: data,
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

    createAreaChart(){
        let { data, label} = this.getSelectionDataForChart();

        let tempdata = [], cnt = 0;
        for(let list = 0; list < data.length; ++list){
            tempdata = [];
            cnt = 0;
            
            // for(let element = 0; element < data[list].data.length; ++element){
            //     tempdata.push({
            //         x:++cnt,
            //         y:data[list].data[element]
            //     });
            // }
            // data[list].data = tempdata;
            // data[list].pointRadius = 4;
            data[list].fill = true; 
            // data[list].backgroundColor = this.getRandomColorName(); 
            // this.getRandomColorName();
            // data[list].border = 0;
        }


        let chartCanvas = document.createElement("canvas");
        let chartDiv = document.createElement("div");

        this.setChartCanvasProperties(chartCanvas);
        this.setChartDivProperties(chartDiv);
        
        if(this.canvasMainDiv) this.canvasMainDiv.append(chartDiv);
        if(chartDiv) chartDiv.append(chartCanvas);
        

        let xChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: label,
                datasets: data,
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
        for(let i = 0; i < clickX + 10 ; ++i){
            
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
        for(let i = 0; i < clickY + 10; ++i){
            pre = end;
            end += this.rowHeight + (this.leftSizeMap[i + 1] || 0);
            
            if((pre <= clickY) && (clickY <= end)){ 
                return i;
            }
        }
        return 0;
    }

    getTopHeight(cellNo = 0){
        // console.log(cellNo);
        let heightAns = this.rowHeight * (cellNo);
        for(var i in this.leftSizeMap){
            if(i <= cellNo) heightAns += this.leftSizeMap[i];
        }
        return heightAns;
    }

    getLeftWidth(cellNo = 0){
        // console.log(cellNo);
        let widthAns = this.columnWidth * (cellNo);
        for(var i in this.topSizeMap){
            if(i <= cellNo) widthAns += this.topSizeMap[i];
        }
        return widthAns;
    }

    isIntersectRegionTop(clickX){
        let pixelCount = 0;

        for(let i = 1; pixelCount - this.columnWidth < this.defaultTableWidth ; ++i){
            pixelCount+= this.columnWidth + (this.topSizeMap[i] || 0);
            // console.log(i,pixelCount);
            if(((pixelCount-10) <= clickX) && (clickX <= (pixelCount + 10))) return true;

            // if(pixelCount >= clickX) return false;
        }
        return false;
    }
    
    isIntersectRegionLeft(clickY){
        let pixelCount = 0;

        for(let i = 1; pixelCount - this.rowHeight < clickY + 3 ; ++i){
            pixelCount+= this.rowHeight + (this.leftSizeMap[i] || 0);
            // console.log(i,pixelCount);
            if(((pixelCount-2) <= clickY) && (clickY <= (pixelCount + 2))) return true;
        }

        return false;
    }



    setOnlyCellValue(row, col, value) {
        if (!this.data.has(row)) {
            this.data.set(row, new Map());
        }
        this.data.get(row).set(col, value);
    }

    async setCellValue(row, col, value) {
        var cellData = [{
            "MatrixName" : this.sheetID,
            "RowNo" : row + 1,
            "ColNo" : col + 1,
            "CellValue": value
        }];
        
        // console.log(cellData);
        await axios.post(`http://localhost:5163/api/setCellData`, cellData)
        .then((response) => {
            // console.log(response);
            if (!this.data.has(row)) {
                this.data.set(row, new Map());
            }
            this.data.get(row).set(col, value);
        })
        .catch(
            (error) => {
                console.error("Error:", error);
            }
        );

        // this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // // this.drawTableData();
        this.selection = 1;
        this.drawSelection();
        this.selection = 0;
       
    }

    getIdNum(stringID){
        let helpString = stringID.split('_');
        return +helpString[helpString.length - 1];
    }

    getCellValue(row, col) {
        if (this.data.has(row) && this.data.get(row).has(col)) {
            return this.data.get(row).get(col);
        }
        return null;
    }

    deleteOnlyCell(row, col) {
        if (this.data.has(row)) {
            const rowMap = this.data.get(row);
            rowMap.delete(col);
            if (rowMap.size === 0) {
                this.data.delete(row); 
            }
        }
    }

    async deleteCell(row, col) {
        var cellData =[ {
            "MatrixName" : this.sheetID,
            "RowNo" : row + 1,
            "ColNo" : col + 1
        }];
        await axios.delete(`http://localhost:5163/api/deleteCellData`,{
            data:cellData
        })
        .then((response) => {
            // console.log(response);
            if (this.data.has(row)) {
                const rowMap = this.data.get(row);
                rowMap.delete(col);
                if (rowMap.size === 0) {
                    this.data.delete(row); 
                }
            }
        })
        .catch(
            (error) => {
                console.error("Error:", error);
            }
        );
        this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // this.drawTableData();
        this.selection = 1;
        this.drawSelection();
        this.selection = 0;
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
        //     this.ipBox.value = "";
        
        this.ipBox.style.display = "none";
        this.isSelectedAll = false;
        // }
        
        this.selectedChart = null;

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
            this.endCellsY = this.maxCountRow;

            this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.selection = 1;
            this.drawSelection();
            this.selection = 0;
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
            this.topSizeMap[this.moveStartX + 1] = newWidth;
            // if()
            if(this.startColX <= this.moveStartX && this.moveStartX <= this.endColX){
                for(let i = this.startColX; i <= this.endColX; ++i){
                    this.topSizeMap[i + 1] = newWidth;
                }
            }
            
            
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
            // console.log(this.topSizeMap);
        }
        else this.colSelection = 0;
    }

    resizeRowPointerDown(e){

        // if(this.ipBox.style.display != "none"){
        //     console.log(ipBox.value);
        
        this.isSelectedAll = false;
        this.ipBox.style.display = "none";
        // }
        
        this.selectedChart = null;

        this.isClickedOnLeftHeadingCanvas = 1;

        this.startColX = -1;
        this.endColX = -1;
        this.colSelection = 0;
        this.isSelectedCol = 0;
        this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        this.drawTopHeadingsGrid();
        this.drawTableTopHeading();
        // console.log(e.offsetY);
        let offset = this.canvasLeft.getBoundingClientRect();

        if(this.isIntersectRegionLeft(e.clientY - offset.y + this.scrollYaxisValue)){
            this.moveStartY = this.getRowNumber(e.clientY - offset.y + this.scrollYaxisValue - 2);
            this.startLeftY = e.clientY - offset.y + this.scrollYaxisValue;
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
            let clickY = this.getRowNumber(e.clientY - offset.y + this.scrollYaxisValue);
            this.startRowY = clickY;
            this.endRowY = clickY;
            this.rowSelection = 1;
            this.isSelectedRow = 1;
            this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
            this.drawLeftHeadingsGrid();
            this.drawTableLeftHeading();

            this.startCellsX = 0;
            this.startCellsY = this.startRowY;

            this.endCellsX = this.maxCountCol;
            this.endCellsY = this.endRowY;

            this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.selection = 1;
            this.drawSelection();
            this.selection = 0;

        }

    }

    resizeRowPointerMove(e){
        let offset = this.canvasLeft.getBoundingClientRect();

        if(this.selectionLeft === 1){
            const newHeight = Math.max(
                10 - this.rowHeight,
                e.clientY - offset.y + this.scrollYaxisValue - this.startLeftY + this.prevSizeY 
            )
            ;

            this.leftSizeMap[this.moveStartY + 1] =  newHeight;

            this.dottedHorizontalLineDiv.style.display = "block";

            this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
            this.drawLeftHeadingsGrid();
            this.drawTableLeftHeading();
        }
        if(this.rowSelection === 1){
            let clickY = this.getRowNumber(e.clientY - offset.y + this.scrollYaxisValue);
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
                e.offsetY - this.startLeftY + this.scrollYaxisValue + this.prevSizeY 
            )
            ;

            this.leftSizeMap[this.moveStartY + 1] =  newHeight;
            if(this.startRowY <= this.moveStartY && this.moveStartY <= this.endRowY){
                for(let i = this.startRowY; i <= this.endRowY; ++i){
                    this.leftSizeMap[i + 1] = newHeight;
                }
            }
            
            this.selectionLeft = 0;

            this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
            this.drawLeftHeadingsGrid();
            this.drawTableLeftHeading();
            this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            //
            // this.drawTableData();
            this.selection = 1;
            this.drawSelection();
            this.selection = 0;

            this.dottedHorizontalLineDiv.style.display = "none";

            // console.log(this.leftSizeMap);
        }
        else {
            this.rowSelection = 0;
        }
    }

    placeInputBox(e){
        
        this.selectedChart = null;

        this.copyCutAnimationDiv = document.getElementById("copyCutAnimationDiv");
        if(this.copyCutAnimationDiv) this.copyCutAnimationDiv.remove(); 
        this.isCellsCopyCut = 0;
        
        this.ipBox.style.display = "none";

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

        this.ipBox.style.top = `${ipBoxY + 2 - this.scrollYaxisValue}px`;
        this.ipBox.style.left = `${ipBoxX + 2 - this.scrollXaxisValue}px`;
        Text
        this.ipBox.style.display = "block";
        if(this.getCellValue(this.startCellsY, this.startCellsX))
        this.ipBox.value = this.getCellValue(this.startCellsY, this.startCellsX);
        // console.log(this.getCellValue(this.startCellsY, this.startCellsX));
        this.ipBox.focus();
    }

    ipBoxKeyDown(e){
        
        this.setCellValue(this.startCellsY, this.startCellsX, ipBox.value);
        // console.log(isNaN("111"));
        if(e.key === "Enter"){
            // console.log(ipBox.value);
            // this.data[][] = ;
            // this.setCellValue(this.startCellsY, this.startCellsX, ipBox.value);
            this.ipBox.style.display = "none";
            this.ipBox.value = "";
            this.startCellsY = Math.min(this.maxCountRow, this.startCellsY + 1);
            this.endCellsY = this.startCellsY;
            this.endCellsX = this.startCellsX;
            
        }
        // else if(e.key === "Shift") e.preventDefault();

        this.selection = 1;
        this.drawSelection();
        this.selection = 0;
    }

    async handleDeleteAll(){
        var cellData = {
            "MatrixName" : this.sheetID,
            "RowNo" : 0,
            "ColNo" : 0,
            "CellValue" : ""
        }
        await axios.delete(`http://localhost:5163/api/deleteAllCellData`,{
            data:cellData
        })
        .then((response) => {
        })
        .catch(
            (error) => {
                console.error("Error:", error);
            }
        );
    }

    async mainCanvasKeyDown(e){
        // e.preventDefault();
        // if(this.ipBox.style.display != "none"){
        //     console.log(ipBox.value);
        //     this.data[this.startCellsY][this.startCellsX] = ipBox.value;
            
        //     this.ipBox.value = "";
        // }
        if(e.ctrlKey){ 
            if(e.key === 'C' || e.key === 'c'){

                this.copyCutStartX = this.startCellsX;
                this.copyCutStartY = this.startCellsY;
                this.copyCutEndX = this.endCellsX;
                this.copyCutEndY = this.endCellsY;
                this.isCellsCopyCut = 1;
                this.handleCopy();
                this.handleMarchingAnts();
                // console.log('c');
            }
            else if(e.key === 'v' || e.key === 'V'){
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
                this.handleMarchingAnts();
            }
            else if(e.key === 'f' || e.key === 'F'){
                e.preventDefault();
                this.handleFindReplace();
            }
            else if(e.key === 'd' || e.key === 'D'){
                e.preventDefault();
                // console.log("del row strt");
                if(this.isSelectedRow === 1){
                    var data = {
                        "MatrixName" : this.sheetID,
                        "Start" : this.startRowY + 1,
                        "End" : this.endRowY + 1
                    };
                    // console.log(this.startRowY + 1, this.endRowY + 1);
                    // return;
                    await axios.delete(`http://localhost:5163/api/deleteRow`,{
                        data : data
                    })
                    .then(async(response) => {
                        // console.log("del row success");
                        this.data.clear();
                        await this.loadData();
                        this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        this.selection = 1;
                        this.drawSelection();
                        this.selection = 0;
                    })
                    .catch(
                        (error) => {
                            console.error("Error:", error);
                        }
                    );
                }
            }
            else if(e.key === 'a' || e.key === 'A'){
                e.preventDefault();
                this.startCellsX = this.minCountRow;
                this.startCellsY = this.minCountCol;
                this.endCellsX = this.maxCountCol;
                this.endCellsY = this.maxCountRow;
                this.isSelectedAll = true;
                this.selection = 1;
                this.drawSelection();
                this.selection = 0;
            }
        }
        else{
            this.endColX = -1;
            this.startColX = -1;
            this.endRowY = -1;
            this.startRowY = -1;
        }
        

        if (e.key === 'Delete') {
            // console.log('Delete key pressed!');
            if(this.selectedChart !== null){
                this.selectedChart.remove();
                this.selectedChart = null;
            }
            else{
                if(this.isSelectedAll === true){
                    
                    this.data.clear();
                    this.selection = 1;
                    this.drawSelection();
                    this.selection = 0;
                    await this.handleDeleteAll();                    
                    return;
                }
                let lx= Math.min(this.startCellsX,this.endCellsX);
                let ly= Math.min(this.startCellsY,this.endCellsY);
                let hx= Math.max(this.startCellsX,this.endCellsX);
                let hy= Math.max(this.startCellsY,this.endCellsY);
                var listA = [];
                for(let i = lx; i <= hx; ++i){
                    for(let j = ly; j <= hy; ++j){
                        this.deleteOnlyCell(j ,i);
                        var cellData = {
                            "MatrixName" : this.sheetID,
                            "RowNo" : j + 1,
                            "ColNo" : i + 1,
                        }
                        listA.push(cellData);
                    }
                }
                await axios.delete(`http://localhost:5163/api/deleteCellData`,{
                    data:listA
                })
                .then((response) => {
                })
                .catch(
                    (error) => {
                        console.error("Error:", error);
                    }
                );
            }
        }
        else if(e.shiftKey){
            if(this.ipBox.style.display === `block`){
                this.ipBox.focus();
                return;
            }
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
            
            this.startCellsY = Math.min(this.maxCountRow, this.startCellsY + 1);
            this.endCellsY = this.startCellsY;
            this.endCellsX = this.startCellsX;
            this.ipBox.style.display = "none";
        }
        
        this.selection = 1;
        this.drawSelection();
        this.selection = 0;

        
        
        
    }

    async handlePaste(){
        
        this.canvasMainDiv.style.cursor = "progress";
        if(this.isCutFlag === 1){
            let lx= Math.min(this.copyCutStartX,this.copyCutEndX);
            let ly= Math.min(this.copyCutStartY,this.copyCutEndY);
            let hx= Math.max(this.copyCutStartX,this.copyCutEndX);
            let hy= Math.max(this.copyCutStartY,this.copyCutEndY);
            var listA = [];
            for(let i = lx; i <= hx; ++i){
                for(let j = ly; j <= hy; ++j){
                    this.deleteOnlyCell(j ,i);
                    var cellData = {
                        "MatrixName" : this.sheetID,
                        "RowNo" : j + 1,
                        "ColNo" : i + 1,
                    }
                    listA.push(cellData);
                }
            }

            await axios.delete(`http://localhost:5163/api/deleteCellData`,{
                data:listA
            })
            .then((response) => {
            })
            .catch(
                (error) => {
                    console.error("Error:", error);
                }
            );

            this.isCutFlag = 0;
            this.isCellsCopyCut = 0;
            this.copyCutAnimationDiv = document.getElementById("copyCutAnimationDiv");
            if(this.copyCutAnimationDiv) this.copyCutAnimationDiv.remove(); 
        }

        let lx = Math.min(this.startCellsX,this.endCellsX);
        let ly = Math.min(this.startCellsY,this.endCellsY);
        // console.log(this.copyCutData);
        let transfromToMatrixHelper = this.copyCutData.split('\n');
        this.copyCutData = [];
        for(let rowIndex = 0; rowIndex + 1 < transfromToMatrixHelper.length ; ++rowIndex){
            let temp = transfromToMatrixHelper[rowIndex].split("	");
            this.copyCutData.push(temp);
        }
        
        this.startCellsX = lx;
        this.startCellsY = ly;
        if(this.copyCutData.length) this.endCellsY = ly + this.copyCutData.length - 1;
        this.endCellsX = lx;
        if(this.copyCutData[0]) this.endCellsX = lx + this.copyCutData[0].length - 1;

        var listA = [];
        for(let j = 0; j < this.copyCutData.length ; ++j){
            for(let i = 0; i < this.copyCutData[0].length ; ++i){
                // this.data[j + ly][i + lx] = this.copyCutData[j][i];
                this.setOnlyCellValue(j + ly, i + lx, this.copyCutData[j][i])
                var cellData = {
                    "MatrixName" : this.sheetID,
                    "RowNo" : j + ly + 1,
                    "ColNo" : i + lx + 1,
                    "CellValue": this.copyCutData[j][i]
                }
                listA.push(cellData);
            }
        }

        await axios.post(`http://localhost:5163/api/setCellData`, listA)
        .then((response) => {
        })
        .catch(
            (error) => {
                console.error("Error:", error);
            }
        );

        this.drawGrid();
        this.selection = 1;
        this.drawSelection();
        this.selection = 0;
        this.canvasMainDiv.style.cursor = "cell";
    }

    handleCopy(){
        // this.copyCutAnimationDiv = document.getElementById("copyCutAnimationDiv");
        // if(this.copyCutAnimationDiv) return;
        if(this.isCellsCopyCut === 0) return;

        // this.copyCutAnimationDiv = document.getElementById("copyCutAnimationDiv");
        //     // console.log(copyCutAnimationDiv);
        // if(!this.copyCutAnimationDiv){
        //     this.createCopyCutAnimationDiv();
        // }


        // let selectionLeftSpace = - this.scrollXaxisValue;
        // let selectionTopSpace = - this.scrollYaxisValue;
        // let selectionHeight = 0;
        // let selectionWidth = 0;

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

        
        
        // for(let x = 0; x < lx; ++x){
        //     selectionLeftSpace += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        // }
        // for(let y = 0; y < ly; ++y){
        //     selectionTopSpace += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        // }

        // for(let x = lx; x <= hx ; ++x){
        //     selectionWidth += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        // }
        // for(let y = ly; y <= hy; ++y){
        //     selectionHeight += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        // }
        // this.copyCutAnimationDiv.style.display = `block`
        // this.copyCutAnimationDiv.style.top = `${selectionTopSpace + this.canvasTop.height - 1}px`;
        // this.copyCutAnimationDiv.style.left = `${selectionLeftSpace + this.canvasLeft.width - 1}px`;
        // this.copyCutAnimationDiv.style.width = `${selectionWidth + 2}px`;
        // this.copyCutAnimationDiv.style.height = `${selectionHeight + 2}px`;

        
        // const style = document.createElement('style');
        // const keyframes = `
        // @keyframes border-dance {
        // 0% {
        //     background-position: 0px 0px, 100px ${selectionHeight}px, 0px 100px, ${selectionWidth}px 0px;
        // }
        // 100% {
        //     background-position: 100px 0px, 0px ${selectionHeight}px, 0px 0px, ${selectionWidth}px 100px;
        // }
        // }`;
        // style.textContent = keyframes;
        // document.head.appendChild(style);

        let copyToClipboardString = "";
        // this.copyCutData = [];

        for(let j = ly; j <= hy ; ++j){
            // let tempRow = [];
            for(let i = lx; i <= hx ; ++i){
                // tempRow.push(this.data[j][i]);
                copyToClipboardString += (this.getCellValue(j, i) || "") + ((i===hx) ?"\n": "	" );
            }
        }
        // console.log('hi');
        
        this.copyToClipboard(copyToClipboardString);
    }

    async copyToClipboard(text) {
        await navigator.clipboard.writeText(text).then(
            () => {
                // console.log("copy");
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
                // console.log("paste");
                this.copyCutData = text;
                // console.log(this.copyCutData);
                this.handlePaste();
            },
            (err) => {
                return "";
            }
        );
    }

    handleFindReplace(){
        var findReplaceDiv = document.getElementById("findReplaceDiv");
        if(!findReplaceDiv){
            // console.log("object");
            findReplaceDiv = document.createElement('div');
            findReplaceDiv.classList.add("findReplaceDiv");
            findReplaceDiv.id = "findReplaceDiv";

            findReplaceDiv.style.position = "absolute";
            findReplaceDiv.style.display = "block";

            // findReplaceDiv.style.width = `${100}px`;
            // findReplaceDiv.style.height = `${100}px`;
            findReplaceDiv.style.left = `${600}px`;
            findReplaceDiv.style.top = `${300}px`;
            // findReplaceDiv.style.backgroundColor = "lightblue";


            findReplaceDiv.innerHTML = `
            <div class="find-replace-container">
  <div class="find-replace-header">
    <span>Find and Replace</span>
    <button class="close-button">&times;</button>
  </div>
  <div class="find-replace-body">
    <div class="tabs">
      <button class="tab-button" onclick="openTab('find')">Find</button>
      <button class="tab-button active" onclick="openTab('replace')">Replace</button>
    </div>

    <!--  Find && TextBox Part -->
    <div class="tab-content" id="find">
      <div class="root-410">
        <div class="">
          <label for="findTextId" id="TextFieldLabel5866" class="ms-Label textContainer root-407">
            Find
          </label>
          <div class="findInputDiv">
            <input type="text" id="findTextId" list="searchSuggestion" placeholder="Insert Text" spellcheck="false" autocomplete="off"
              data-unique-id="findTextId-input" maxlength="255" aria-labelledby="TextFieldLabel5866" class="findInput"
              aria-label="Find" aria-invalid="false" value>
              <div id="searchSuggestion" class="searchSuggestion hide">
                <li class="suggestion"> 
                  <div class="suggestionText"> Hello </div>
                  <div class="suggestionPosition"> A1 </div>
                </li>
              </div>

              
          </div>
        </div>
      </div>
      <label class="wildcardtext">
        Wildcards can expand search. For example, "sm?th" finds "smith".
        <a target="_blank" href="https://go.microsoft.com/fwlink/?linkid=2190801"
          aria-label="Wildcards can expand search. For example, &quot;sm?th&quot; finds &quot;smith&quot;.Learn more about using wildcards to search"
          class="link">
          Learn More
        </a>
      </label>

      <!--  Replace && TextBox Part -->
      <!-- <div class=""> -->
      <div class="root-410">
        <div>
          <label for="replaceTextId" id="TextFieldLabel5866" class="ms-Label textContainer root-407">
            Replace with
          </label>
          <div class="findInputDiv">
            <input type="text" id="replaceTextId" placeholder="Insert Text" spellcheck="false" autocomplete="off"
              data-unique-id="replaceTextId-input" maxlength="255" aria-labelledby="TextFieldLabel5866" class="findInput"
              aria-label="Find" aria-invalid="false" value>
          </div>
        </div>
      </div>



      <!--    Search Options Part   -->
      <div
        style="transform: rotate(0deg); padding-top: 4px; font-weight: 600; display: flex; flex-direction: row; margin-right: 4px; margin-top: 14px; margin-bottom: 24px;">
        <button type="button" role="iconButton" aria-expanded="false" class="ms-Button ms-Button--icon root-423"
          aria-label="Search options" data-is-focusable="true">
          <span class="ms-Button-flexContainer flexContainer-108" data-automationid="splitbuttonprimary">
            <i data-icon-name="CommonControlChevronRight_12" aria-hidden="true"
              class="ms-Icon root-89 ms-Button-icon icon-424">
              <svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false">
                <path type="path" class="OfficeIconColors_HighContrast"
                  d="M 743 1767 l -121 -121 l 708 -707 l -708 -708 l 121 -121 l 828 829 z">
                </path>
                <path type="path" class="OfficeIconColors_m22"
                  d="M 743 1767 l -121 -121 l 708 -707 l -708 -708 l 121 -121 l 828 829 z"></path>

              </svg>
            </i>
          </span>
        </button>
        <label class="ms-Label root-425">Search options</label>
      </div>
      <!-- Bottom buttons Part  -->
      <div class="ms-Dialog-actions actions-426">
        <div class="ms-Dialog-actionsRight actionsRight-428">
          <span class="ms-Dialog-action action-427">
            <div class="css-319">
              <button type="button" data-automation-type="AppButton" data-unique-id="findBtn" id="findBtn"
                class="ms-Button footerButton primaryDialogButton root-382" aria-label="Find next"
                data-is-focusable="true">
                <span class="ms-Button-flexContainer flexContainer-108" data-automationid="splitbuttonprimary">
                  <span class="ms-Button-textContainer textContainer-109">
                    <span class="ms-Button-label textContainer label-431" id="id__6246">
                      Find next
                    </span>
                  </span>

                </span>

              </button>
              <button type="button" data-automation-type="AppButton" data-unique-id="findAllBtn" id="findAllBtn"
                class="ms-Button footerButton root-386" aria-label="Find all" data-is-focusable="true">
                <span class="ms-Button-flexContainer flexContainer-108" data-automationid="splitbuttonprimary">
                  <span class="ms-Button-textContainer textContainer-109">
                    <span class="ms-Button-label textContainer label-431" id="id__6249">
                      Find all
                    </span>
                  </span>
                </span>
              </button>

              <button type="button" data-automation-type="AppButton" data-unique-id="replaceBtn" id="replaceBtn"
                class="ms-Button footerButton root-386" aria-label="Replace" data-is-focusable="true">
                <span class="ms-Button-flexContainer flexContainer-108" data-automationid="splitbuttonprimary">
                  <span class="ms-Button-textContainer textContainer-109">
                    <span class="ms-Button-label textContainer label-431" id="id__6249">
                      Replace
                    </span>
                  </span>
                </span>
              </button>

              <button type="button" data-automation-type="AppButton" data-unique-id="replaceAllBtn" id="replaceAllBtn"
                class="ms-Button footerButton root-386" aria-label="Replace All" data-is-focusable="true">
                <span class="ms-Button-flexContainer flexContainer-108" data-automationid="splitbuttonprimary">
                  <span class="ms-Button-textContainer textContainer-109">
                    <span class="ms-Button-label textContainer label-431" id="id__6249">
                      Replace all
                    </span>
                  </span>
                </span>
              </button>
            </div>
          </span>
        </div>
      </div>
    </div>

  </div>
</div>
            `;

            // findReplaceDiv.draggable();
            this.makeChartDraggableOverWindow(findReplaceDiv,true);
            document.body.appendChild(findReplaceDiv);
            this.FindipBox = document.getElementById("findTextId");
            this.FindipBox.focus();

            var closeFindReplaceCross = document.getElementsByClassName("close-button");
            closeFindReplaceCross[0].addEventListener("click", (e) => {
                this.searchSuggestion = document.getElementById("searchSuggestion");
                this.FindipBox.removeEventListener("keyup", this.getRecomendations);
                this.FindipBox.removeEventListener("blur", this.hideRecomendations);
                findReplaceDiv.remove();
                this.isFindActive = false;
                this.findStrData = "";
                this.selection = 1;
                this.drawSelection();
                this.selection = 0;
            });

            var findTextipBox = document.getElementById("findTextId");
            findTextipBox.addEventListener("click", (e) => {
                findTextipBox.focus();
            });

            var replaceTextipBox = document.getElementById("replaceTextId");
            replaceTextipBox.addEventListener("click", (e) => {
                replaceTextipBox.focus();
            });

            var findAllBtn = document.getElementById("findAllBtn");
            findAllBtn.addEventListener("click", (e) => {
                this.handleFindAll(findTextipBox.value);
            });

            var replaceAllBtn = document.getElementById("replaceAllBtn");
            replaceAllBtn.addEventListener("click", (e) => {
                this.handleReplaceAll(findTextipBox.value, replaceTextipBox.value);
            });

            var findBtn = document.getElementById("findBtn");
            findBtn.addEventListener("click", (e) => {
                this.handleFind(findTextipBox.value);
            });

            var replaceBtn = document.getElementById("replaceBtn");
            replaceBtn.addEventListener("click", (e) => {
                this.handleReplace(findTextipBox.value, replaceTextipBox.value);
            });
            
            this.FindipBox = document.getElementById("findTextId");
            this.FindipBox.addEventListener("keyup", this.getRecomendations);
            this.FindipBox.addEventListener("blur", this.hideRecomendations);

        }
    }

    async handleFind(findText){
        this.isFindActive = true;
        this.findStrData = findText;
        console.log("findBtn", findText);

        this.selection = 1;
        this.drawSelection();
        this.selection = 0;
    }

    async handleReplace(findText, replaceText){
        console.log("replaceBtn",findText, replaceText);
    }

    async handleFindAll(findText){
        console.log("findAllBtn", findText);
        
        var findReplaceDiv = document.getElementById("findReplaceDiv");
        findReplaceDiv.style.cursor = "progress";
        this.canvasDivDiv.style.cursor = "progress";

        if(findText === ""){
            alert("Enter Text in Find Field");
            return;
        }
        this.isFindActive = true;
        this.findStrData = findText;

        var findData = {
            findStr: `${findText}`
        };

        await axios.post(`http://localhost:5163/api/findAll`, findData)
        .then((response) => {
            alert(`Results found (first ${response.data.length })`)
        })
        .catch(
            (error) => {
                console.error("Error:", error);
            }
        );

        findReplaceDiv.style.cursor = "auto";
        this.canvasDivDiv.style.cursor = "auto";
        await this.loadData();
        this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.selection = 1;
        this.drawSelection();
        this.selection = 0;
    }

    async handleReplaceAll(findText, replaceText){
        console.log("replaceAllBtn",findText, replaceText);

        if(findText === ""){
            alert("Enter Text in Find Field");
            return;
        }

        var findReplaceDiv = document.getElementById("findReplaceDiv");
        findReplaceDiv.style.cursor = "progress";
        this.canvasDivDiv.style.cursor = "progress";

        var findReplaceData = {
            findStr: `${findText}`,
            replaceStr: `${replaceText}`
        };

        await axios.post(`http://localhost:5163/api/replaceAll`, findReplaceData)
        .then((response) => {
            // console.log(response);
            if(response.data == 0) alert("We can't find any matches to replace");
            else alert(`Matches replaced (${response.data})`)
        })
        .catch(
            (error) => {
                console.error("Error:", error);
            }
        );
        this.canvasDivDiv.style.cursor = "auto";
        findReplaceDiv.style.cursor = "auto";
        await this.loadData();
        this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.selection = 1;
        this.drawSelection();
        this.selection = 0;
    }
      
      
      

    

    mainCanvasKeyUp(e){
        this.isDeleteKeyDown = false;
        if(this.ipBox.style.display != "none"){
            // console.log(ipBox.value,this.ipBox.style.display);
            // this.data[this.startCellsY][this.startCellsX] = ipBox.value;
            this.setCellValue(this.startCellsY, this.startCellsX, ipBox.value);
            // this.ipBox.style.display = "none";
            // this.ipBox.value = "";
        }
    }

    selectionPointerDown(e){
        
        this.isClickedOnMainCanvas = 1;
        this.selectedChart = null;

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
        this.drawTableLeftHeading();
        this.isSelectedAll = false;

        if(this.ipBox.style.display !== "none"){
            // this.data[this.startCellsY][this.startCellsX] = ipBox.value;
            this.setCellValue(this.startCellsY, this.startCellsX, ipBox.value);
            this.ipBox.style.display = "none";
            this.ipBox.value = "";
        }
        // console.log(e.offsetX, e.offsetY);
        let offset = this.canvas.getBoundingClientRect();

        this.selection = 1;
        this.startCellsX = this.getColumnNumber(e.clientX - offset.x + this.scrollXaxisValue);
        this.startCellsY = this.getRowNumber(e.clientY - offset.y + this.scrollYaxisValue);
        this.endCellsX = this.startCellsX;
        this.endCellsY = this.startCellsY;

        if(this.ipBox.style.display != "none"){
            // console.log(ipBox.value);
            // this.data[this.startCellsY][this.startCellsX] = ipBox.value;
            this.setCellValue(this.startCellsY, this.startCellsX, ipBox.value);
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
        

        // this.drawTableData();


    }

    selectionPointerMove(e){
        if( this.selection === 1){
            // this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
     
            let offset = this.canvas.getBoundingClientRect();
            this.endCellsX = this.getColumnNumber(e.clientX - offset.x + this.scrollXaxisValue);
            this.endCellsY = this.getRowNumber(e.clientY - offset.y + this.scrollYaxisValue);
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

            // this.drawTableData();
        }
    }
    isNumber(n) { 
        return !isNaN(parseFloat(n)) && !isNaN(n - 0) 
    }

    selectionPointerUp(e){
        // console.log("hiyeyeyeyeye")
        this.selection = 0;
        this.isClickedOnLeftHeadingCanvas = 0;
        this.isClickedOnMainCanvas = 0;
        this.isClickedOnTopHeadingCanvas = 0;
        // this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // this.drawTableData();
        
        this.statCalRef[0].resetAll();

        let lx= Math.min(this.startCellsX,this.endCellsX);
        let ly= Math.min(this.startCellsY,this.endCellsY);
        let hx= Math.max(this.startCellsX,this.endCellsX);
        let hy= Math.max(this.startCellsY,this.endCellsY);

        for(let i = lx; i <= hx; ++i){
            for(let j = ly; j <= hy; ++j){
                let x = this.getCellValue(j, i);
                if(x === undefined  || x === "") continue;
                if(this.isNumber(x)){
                    this.statCalRef[0].anyIntExist = true;

                    this.statCalRef[0].sum += +x;
                    this.statCalRef[0].countInt++;
                    this.statCalRef[0].max = Math.max(this.statCalRef[0].max, x);
                    this.statCalRef[0].min = Math.min(this.statCalRef[0].min, x);
                }
                this.statCalRef[0].count++;
            }
        }
        this.statCalRef[0].avg = (this.statCalRef[0].sum / this.statCalRef[0].countInt).toFixed(2);
        this.statCalRef[0].display();
        

    }

    windowPointerMove(e){
        e.preventDefault();
        // console.log("X", e.clientX,e.clientY)
        // console.log(e.clientX, e.clientY);
        if(this.isClickedOnLeftHeadingCanvas === 1){
            this.resizeRowPointerMove(e);
            // console.log("Clicked on top");
        }
        else if(this.isClickedOnMainCanvas === 1){
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
        e.preventDefault();
        this.ipBox.style.display = `none`;
        this.selection = 0;
        
        if(this.isClickedOnLeftHeadingCanvas === 1) this.resizeRowPointerUp(e);
        if(this.isClickedOnTopHeadingCanvas === 1) this.resizeColumnPointerUp(e);
        if(this.isClickedOnMainCanvas === 1)this.selectionPointerUp(e);
        this.resetDivSel();
        
        this.isClickedOnLeftHeadingCanvas = 0;
        this.isClickedOnMainCanvas = 0;
        this.isClickedOnTopHeadingCanvas = 0;


    }
    
    topHeadingPointerMove(e){
        // console.log("K")
        
        e.preventDefault();
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
        e.preventDefault();
        if(this.isClickedOnLeftHeadingCanvas === 0){
            if(this.isIntersectRegionLeft(e.offsetY)){
                this.canvasLeft.style.cursor = "ns-resize";
            }
            else{
                this.canvasLeft.style.cursor = "w-resize";
            }
        }
    }
    drawSelection() {
        if(this.selection === 1 && this.startCellsX != -1){

            let selectionLeftSpace = -(this.scrollXaxisValue);;
            // this.canvasLeft.width;
            let selectionTopSpace = -(this.scrollYaxisValue);; 
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
            if(this.isSelectedAll){
                this.ctxCanvas.fillRect(
                    selectionLeftSpace,
                    selectionTopSpace,
                    selectionWidth,
                    selectionHeight
                );
            }
            else{
                this.ctxCanvas.fillRect(
                    selectionLeftSpace,
                    selectionTopSpace,
                    selectionWidth,
                    selectionHeight
                );
            }
            
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
            
            this.handleMarchingAnts();
        }
        else{
            this.drawTableData();
            this.drawGrid();
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
        let leftSpace = -(this.scrollXaxisValue);;
        let topSpace = -(this.scrollYaxisValue);;

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

        // console.log(
        //     this.startCellsX, 
        //     this.startCellsY, 
        //     this.endCellsX, 
        //     this.endCellsY
        // );
    }

    async loadData(startX = 0 , startY = 0){
        this.startX=startX;
        this.startY=startY;
        // console.log(this.sheetID,startX,startY);
        // await axios.get("http://localhost:5003/userDetail")
        await axios.get(`http://localhost:5163/api/_getPageData?matrixName=${this.sheetID}&rowNo=${startY}&colNo=${startX}`)
        .then((response) => {
            
            for(let j = 0; j < response.data.length; ++j){
                // if (!this.data.has(response.data[j].rowNo - 1)) {
                //     this.data.set(response.data[j].rowNo - 1, new Map());
                // }
                // this.data.get(response.data[j].rowNo - 1).set(response.data[j].colNo - 1, response.data[j].cellValue);

                this.dataRow.push(response.data[j]);
            }
            // console.log(response.data);
            // this.drawTableData();
        })
        .catch(
            (error) => {
                console.error("Error:", error);
            }
        );
    }

    shortenText(textToBeShort, length){
        if(isNaN(textToBeShort)){
            if(textToBeShort.length < length ) return textToBeShort;
            return textToBeShort.substring(0,length) 
            + "..."
            ;
        }
        else{
            if(textToBeShort.length < length ) return textToBeShort;
            return '#'.repeat(length);
        }
        
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


    resetDivSel() {
        this.ipBox.style.display = "block";
        this.ipBox.focus();
        this.ipBox.style.display = "none";
    }

    drawTopHeadingsGrid() {
        let selectionLeftSpace = this.leftSpaceCache - this.scrollXaxisValue;
        let selectionWidth = 0;
        let lx= Math.min(this.startCellsX,this.endCellsX);
        let hx= Math.max(this.startCellsX,this.endCellsX);
        let startX = this.leftCellCache;

        for(let x = startX; x < lx; ++x){
            selectionLeftSpace += this.columnWidth + (this.topSizeMap[x + 1] || 0);
        }
        for(let x = lx; x <= hx ; ++x){
            if(startX < x + 1 && x <= startX + 39) selectionWidth += this.columnWidth + (this.topSizeMap[x + 1] || 0);
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

        // let offset = this.canvasTop.getBoundingClientRect();

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
        

        let cellPositionX = this.leftSpaceCache - this.scrollXaxisValue;;
        for(let x = this.leftCellCache; cellPositionX <= this.canvasTop.width; x++){
            
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

    drawLeftHeadingsGrid(canvasLeft = this.canvasLeft){
        let ctxCanvasLeft = canvasLeft.getContext("2d");

        let canvasID = this.getIdNum(canvasLeft.id);
        // let startY = 0 ;
        // console.log(startY);

        let ly= Math.min(this.startCellsY,this.endCellsY);
        let hy= Math.max(this.startCellsY,this.endCellsY);

        let startY = this.topCellCache;
        let STORE_topSpace = this.topSpaceCache - this.scrollYaxisValue;
        let selectionTopSpace = this.topSpaceCache - this.scrollYaxisValue;
        
        let selectionHeight = 0; 

        for(let y = startY ; y < ly; ++y){
            selectionTopSpace += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        }
        for(let y = ly; y <= hy; ++y){
            if(startY < y+1 && y <= startY + 44) selectionHeight += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
        }

        if(this.startCellsX !== -1 && this.startCellsY !== -1){
            ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
            ctxCanvasLeft.fillStyle = "#caead8";
            ctxCanvasLeft.fillRect(
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
            ctxCanvasLeft.fillStyle = "#107c41";
            ctxCanvasLeft.fillRect(
                0,
                selectionTopSpace,
                this.canvasLeft.width,
                selectionHeight
            );
        }
        


        let cellPositionY = STORE_topSpace;
        for(let y = startY; cellPositionY <= this.canvasLeft.height; y++){
            cellPositionY += this.rowHeight + (this.leftSizeMap[y+1] || 0);
            ctxCanvasLeft.save();
            ctxCanvasLeft.beginPath();
            ctxCanvasLeft.moveTo(0,cellPositionY + 0.5 );
            ctxCanvasLeft.lineTo(this.canvasLeft.width, cellPositionY + 0.5 );
            // this.ctxCanvasLeft.lineWidth=1;
            // this.ctxCanvasLeft.strokeStyle = "rgb(200,200,200)";
            

            if(ly-1 == y){
                ctxCanvasLeft.lineWidth = 5;
                ctxCanvasLeft.strokeStyle = "#107c41";
            }
            else if(y == hy){
                ctxCanvasLeft.lineWidth=3;
                ctxCanvasLeft.strokeStyle = "#107c41";
            }
            else if(ly <= y && y < hy){
                ctxCanvasLeft.lineWidth=1;
                ctxCanvasLeft.strokeStyle = "#fff";
            }
            else if(lowY-1 <= y && y <= highY){
                ctxCanvasLeft.lineWidth=1;
                ctxCanvasLeft.strokeStyle = "#a0d8b9";
            }
            else{
                ctxCanvasLeft.lineWidth=1;
                ctxCanvasLeft.strokeStyle = "#ccc";
            }
            if(y === this.moveStartY){
                // console.log(cellPositionY , offset.y)
                this.dottedHorizontalLineDiv.style.top = `${cellPositionY + 0}px`;
                this.dottedHorizontalLineDiv.style.width = `${this.canvas.width}px`;
                this.dottedHorizontalLineDiv.style.left = `${0}px`;
            }
            ctxCanvasLeft.stroke();
            ctxCanvasLeft.restore();
        }

        ctxCanvasLeft.save();
        ctxCanvasLeft.beginPath();
        ctxCanvasLeft.moveTo(this.canvasLeft.width - 0.5, 0);
        ctxCanvasLeft.lineTo(this.canvasLeft.width - 0.5, this.canvasLeft.height);
        ctxCanvasLeft.lineWidth=0.5;
        ctxCanvasLeft.strokeStyle = "#555";
        ctxCanvasLeft.stroke();
        ctxCanvasLeft.restore();

        // this.ctxCanvas.save();
        // this.ctxCanvas.beginPath();
        // this.ctxCanvas.moveTo(0.5, 0);
        // this.ctxCanvas.lineTo(0.5, this.canvas.height);
        // this.ctxCanvas.lineWidth=0.5;
        // this.ctxCanvas.strokeStyle = "#555";
        // this.ctxCanvas.stroke();
        // this.ctxCanvas.restore();
        if(this.startCellsX !== -1 && this.startCellsY !== -1){
            ctxCanvasLeft.lineWidth = 2;
            ctxCanvasLeft.strokeStyle = "rgb(16,124,65)";
            ctxCanvasLeft.strokeRect(
                this.canvasLeft.width - 1,
                selectionTopSpace - 1,
                2,
                selectionHeight + 2
            )
        }
        
    }

    drawGrid(canvas = this.canvas) {
        
        let ctxCanvas = canvas.getContext("2d");

        let startX = this.topCellCache;
        let startY = this.leftCellCache;


        let cellPositionX = this.leftSpaceCache - this.scrollXaxisValue;

        let cellPositionY = this.topSpaceCache - this.scrollYaxisValue;

        for(let i = startY + 1; cellPositionX <= canvas.width; ++i){
            cellPositionX += this.columnWidth + (this.topSizeMap[i] || 0);
            ctxCanvas.save();
            ctxCanvas.beginPath();
            ctxCanvas.moveTo(cellPositionX + 0.5, 0);
            ctxCanvas.lineTo(cellPositionX + 0.5, canvas.height);
            ctxCanvas.lineWidth=1;
            ctxCanvas.strokeStyle = "rgb(225,225,225)";
            ctxCanvas.stroke();
            ctxCanvas.restore();
        }

        // let xCordLow = 
        // cellPositionY -= canvas.height;


        for(let j = startX + 1; cellPositionY <= canvas.height + 1; ++j){
            cellPositionY += this.rowHeight + (this.leftSizeMap[j] || 0);
            ctxCanvas.save();
            ctxCanvas.beginPath();
            ctxCanvas.moveTo(0,cellPositionY + 0.5);
            ctxCanvas.lineTo(canvas.width, cellPositionY + 0.5);
            ctxCanvas.lineWidth=1;
            ctxCanvas.strokeStyle = "rgb(225,225,225)";
            ctxCanvas.stroke();
            ctxCanvas.restore();
        }
    }
    

    drawTableTopHeading(ctxCanvasTop = this.ctxCanvasTop) {
        // this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        
        // this.ctxCanvasTop.fillStyle = "rgba(110,110,110,1)";
        let lx = Math.min(this.startColX, this.endColX);
        let hx = Math.max(this.startColX, this.endColX);

        let lowX = Math.min(this.startCellsX,this.endCellsX);
        let highX = Math.max(this.startCellsX,this.endCellsX);

        let x = this.leftSpaceCache - this.scrollXaxisValue;
        
        for (let i = this.leftCellCache; x <= this.defaultTableWidth; i++) {
            const columnWidth = this.columnWidth + (this.topSizeMap[i + 1] || 0);
            if(lx <= i && i <= hx){
                ctxCanvasTop.font = "bold 16px Calibri";
                ctxCanvasTop.fillStyle = "#fff";
            }
            else if(lowX <= i && i <= highX){
                ctxCanvasTop.font = "15px Calibri";
                ctxCanvasTop.fillStyle = "#0f703b";
            }
            else{
                ctxCanvasTop.font = "15px Calibri";
                ctxCanvasTop.fillStyle = "rgba(110,110,110,1)";
            }
            
            ctxCanvasTop.fillText(
                this.headermap[i],
                // this.convertToTitle(i + 1),
                x + columnWidth / 2,
                this.canvasTop.height *3 / 4
            );
            x += columnWidth;
        }

    }

    drawTableLeftHeading(ctxCanvasLeft = this.ctxCanvasLeft ,startX = 0 , startY = 0){
        
        
        let lowY = Math.min(this.startCellsY,this.endCellsY);
        let highY = Math.max(this.startCellsY,this.endCellsY);
        var start = startX;
        var end = startX + Math.floor((this.defaultTableHeight + this.rowHeight - 1) / this.rowHeight);


        let ly = Math.min(this.startRowY, this.endRowY);
        let hy = Math.max(this.startRowY, this.endRowY);
        let y = this.topSpaceCache - this.scrollYaxisValue;

        for (var j = this.topCellCache; y <= this.defaultTableHeight; j++, start++) {
            const rowHeight = this.rowHeight + (this.leftSizeMap[j + 1] || 0);
            
            y += rowHeight;
            if(ly <= j && j <= hy){
                ctxCanvasLeft.font = "bold 15px Calibri";
                ctxCanvasLeft.fillStyle = "#fff";
            }
            else if(lowY <= j && j <= highY){
                ctxCanvasLeft.font = "15px Calibri";
                ctxCanvasLeft.fillStyle = "#0f703b";
            }
            else{
                ctxCanvasLeft.font = "15px Calibri";
                ctxCanvasLeft.fillStyle = "rgba(110,110,110,1)";
            }
            // this.ctxCanvasLeft.textAlign = "right";

            ctxCanvasLeft.fillText(
                // this.data[this.startX][this.startY],
                j + 1,
                this.canvasLeft.width - 5,
                y - rowHeight / 2
            );
        }
    }
    


    drawTableData(startX = 0 , startY = 0) {
        // this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.ctxCanvas.fillStyle = "#000";
        this.ctxCanvas.font = `${15}px Calibri`;
        this.ctxCanvas.textAlign = "center";
        this.ctxCanvas.textBaseline = "Top";
        this.ctxCanvas.lineWidth = 1;

        this.startX=startX;
        this.startY=startY;
        // this.data=tableData;
        // console.log(this.data);
        let cellPositionX = 0;
        let cellPositionY = 0;

        startY = this.leftCellCache
        startX = this.topCellCache; 

        this.startY = startY;
        this.startX = startX;

        this.endY = this.startY + 50;
        this.endX = this.startX + 50;; 
        
        
        
        let STORE_X = this.leftSpaceCache  - this.scrollXaxisValue;;
        let x = STORE_X;
        let y = this.topSpaceCache - this.scrollYaxisValue;
        

        // console.log(this.dataRow);
        for (var i = startX; this.startX < this.endX; i++,this.startX++) {
            // ctx.fillText(columnHeaders[i], columnWidth * i + columnWidth / 2, rowHeight / 2);
            y += (this.rowHeight / 2) + (this.leftSizeMap[i+1]/2  || 0);
            for (var j = startY; this.startY < this.endY ;j++,this.startY++) {

                // let cellData = this.getCellValue(this.startX, this.startY);
                let cellData = this.dataRow[this.startX][this.headermapLower[this.startY]] || "";
                // console.log(cellData);
                
                // console.log(this.ctxCanvas.measureText(cellData).width / 12);
                // ((((this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0))/4)-3);
                // console.log(this.isFindActive);
                
                if(cellData){
                    if(this.isFindActive === true && cellData.toUpperCase().includes(this.findStrData.toUpperCase())){
                        this.ctxCanvas.fillStyle = "#caead8";
                        this.ctxCanvas.fillRect(
                            x, 
                            y - (this.rowHeight / 2) + (this.leftSizeMap[i+1]/2  || 0), 
                            ((this.columnWidth) + (this.topSizeMap[j+1]  || 0)),
                            (this.rowHeight) + (this.leftSizeMap[i+1]  || 0)
                        );

                        this.ctxCanvas.lineWidth = 1;
                        this.ctxCanvas.strokeStyle = "rgb(16,124,65,100)";
                        this.ctxCanvas.strokeRect(
                            x, 
                            y - (this.rowHeight / 2) + (this.leftSizeMap[i+1]/2  || 0), 
                            ((this.columnWidth) + (this.topSizeMap[j+1]  || 0)),
                            (this.rowHeight) + (this.leftSizeMap[i+1]  || 0)
                        );
    
                        this.ctxCanvas.fillStyle = "#000";
                    }

                    let textLength = ((((this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0))/4));
                    if(isNaN(cellData)){
                        let textLength = ((((this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0))/4)-3);
                        this.ctxCanvas.textAlign = "left";
                        this.ctxCanvas.fillText(
                            this.shortenText(cellData, textLength),
                            // j * this.columnWidth + this.columnWidth / 2,
                            x + 3,
                            // i * this.rowHeight + (this.rowHeight / 2) + 6
                            y + 6
                        );
                    }
                    else{
                        let textLength = ((((this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0))/4));
                        this.ctxCanvas.textAlign = "right";
                        this.ctxCanvas.fillText(
                            this.shortenText(cellData, textLength),
                            // j * this.columnWidth + this.columnWidth / 2,
                            x + (this.columnWidth) + (this.topSizeMap[j+1]  || 0) - 3,
                            // i * this.rowHeight + (this.rowHeight / 2) + 6
                            y + 6
                        );
                    }

                    
                }
                
                x += (this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0);
                x += (this.columnWidth / 2) + (this.topSizeMap[j+1]/2  || 0);
                
            }
            y += (this.rowHeight / 2) + (this.leftSizeMap[i+1]/2  || 0);
            this.startY = startY;
            x = STORE_X;
        }
    }


    async show(){
        
        this.canvas = document.createElement(`canvas`);
        this.canvasTop = document.createElement(`canvas`);
        this.canvasLeft = document.createElement(`canvas`);

        if (!this.canvas) {
            console.error("No element found with ID 'canvas'");
            return;
        }
        
        this.canvas.id = `canvasMain_${this.sheetID}_${this.verticalMainCanvasID++}`;
        this.canvas.classList.add(`canvas`);
        this.canvas.height = this.defaultTableHeight;
        this.canvas.width = this.defaultTableWidth;
        this.canvasMainDiv.append(this.canvas);


        this.canvasTop.id = `canvasTop`;
        this.canvasTop.classList.add(`canvasTop`);
        this.canvasTop.height = 40;
        this.canvasTop.width = this.defaultTableWidth;
        this.canvasTopDiv.append(this.canvasTop);


        
        this.canvasLeft.id = `canvasLeft_${this.sheetID}_${this.verticalMainCanvasID-1}`;
        this.canvasLeft.classList.add(`canvasLeft`);
        this.canvasLeft.height = this.defaultTableHeight;
        this.canvasLeft.width = 40;
        this.canvasLeftDiv.append(this.canvasLeft);




        this.ctxCanvas = this.canvas.getContext("2d");
        this.ctxCanvasTop = this.canvasTop.getContext("2d");
        this.ctxCanvasLeft = this.canvasLeft.getContext("2d");
        // this.ctxCanvasTop.stroke();

        

        this.ctxCanvasTop.font = "16px Calibri";
        this.ctxCanvasTop.textAlign = "center";
        this.ctxCanvasTop.textBaseline = "middle";
        this.ctxCanvasTop.lineWidth = 1;

        this.ctxCanvasLeft.font = "10px Calibri";
        this.ctxCanvasLeft.textAlign = "right";
        this.ctxCanvasLeft.textBaseline = "middle";
        this.ctxCanvasLeft.lineWidth = 1;

        
        await this.loadData();
        this.handleUploadBar();
        this.addEventListeners();
        this.drawGrid();
        this.drawTopHeadingsGrid();
        this.drawLeftHeadingsGrid();
        this.drawTableTopHeading();
        this.drawTableLeftHeading();
        this.selection = 1;
        this.drawSelection();
        this.selection = 0;

        this.isFindActive = false;
        this.findStrData = "";

        var statCal = new StatisticsCalculator();
        this.statCalRef.push(statCal);



        // this.scrollXaxis();
    }

    hide(){
        
        this.removeEventListeners();
        this.ipBox.style.display = `none`;
        // this.copyCutStartX = -1;
        // this.copyCutStartY = -1;
        // this.copyCutEndX = -1;
        // this.copyCutEndY = -1;
        // console.log(2);
        
        this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctxCanvasTop.clearRect(0, 0, this.canvasTop.width, this.canvasTop.height);
        this.ctxCanvasLeft.clearRect(0, 0, this.canvasLeft.width, this.canvasLeft.height);
        // this.isCellsCopyCut = 0;
        if(this.copyCutAnimationDiv){
            this.copyCutAnimationDiv.remove();
        }
        this.data.clear();


        this.canvas.remove();
        this.canvasTop.remove();
        this.canvasLeft.remove();

        this.isFindActive = false;
        this.findStrData = "";
        this.statCalRef[0].resetAll();
        this.statCalRef.pop();
    }
        
}