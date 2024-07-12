document.addEventListener("DOMContentLoaded", function () {
    axios.get('http://localhost:5003/userDetail')
        .then((response) => {
            console.log(response.data);

            var canvas = document.getElementById("canvas");
            if (!canvas) {
                console.error("No element found with ID 'canvas'");
                return;
            }
            var ctx = canvas.getContext("2d");
            var ctxx = canvas.getContext("2d");
            if (!ctx) {
                console.error("Could not get context for canvas");
                return;
            }

            // Set the font and text alignment
            ctx.font = "16px Arial bold";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.lineWidth = 2;

            // Define the table dimensions
            var columnWidth = 220;
            var rowHeight = 40;

            var startCellsX = -1;
            var startCellsY = -1;
            var endCellsX = -1;
            var endCellsY = -1;
            var selection = 0;

            var tableWidth = columnWidth * 17;
            var tableHeight = canvas.height;
            // ctxx.fillRect(j * columnWidth, i * rowHeight, columnWidth-1, rowHeight-1);


            var columnHeaders = [
                "ID", "Email ID", "Name", "Country", "State", "City",
                "Telephone No.", "Address Line 1", "Address Line 2", "Date of Birth",
                "FY-19-20", "FY-20-21", "FY-21-22", "FY-22-23", "FY-23-24"
            ];

            var colArray = [
                "id", "email_id", "name", "country", "state", "city",
                "telephone", "address_line_1", "address_line_2", "date_of_birth",
                "gross_salary_FY2019_20", "gross_salary_FY2020_21", "gross_salary_FY2021_22",
                "gross_salary_FY2022_23", "gross_salary_FY2023_24"
            ];


            const ipBox = document.getElementById("ipBox");

            // Function to draw the table grid
            function drawGrid() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (var x = 0; x <= tableWidth; x += columnWidth) {
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, tableHeight);
                }
                for (var y = 0; y <= tableHeight; y += rowHeight) {
                    ctx.moveTo(0, y);
                    ctx.lineTo(tableWidth, y);
                }
                ctx.strokeStyle = "#000";
                ctx.stroke();
                // ctx.fillStyle = "#F3FEB8";
                // ctx.fillRect(0,0,tableWidth,tableHeight);
            }

            // Draw the table grid
            drawGrid();

            // Add column headers

            for (var i = 0; i < columnHeaders.length; i++) {
                ctx.fillText(columnHeaders[i], columnWidth * i + columnWidth / 2, rowHeight / 2);
            }

            var tableData = response.data;

            // Function to draw table data
            function drawTableData() {
                // ctx.clearRect(0, 0, canvas.width, canvas.height);
                // drawGrid();
                ctx.fillStyle = "rgba(0,0,0,1)";
                for (var i = 0; i < tableData.length; i++) {
                    ctx.fillText(columnHeaders[i], columnWidth * i + columnWidth / 2, rowHeight / 2);
                    for (var j = 0; j < colArray.length; j++) {

                        // if(startCellsX<=i && i<=endCellsX && startCellsY<=j && j<=endCellsY){
                        //     console.log(startCellsX,startCellsY)
                        //     ctxx.fillStyle = "rgb(243, 254, 184)";
                        //     ctxx.fillRect(i * columnWidth, j * rowHeight, columnWidth, rowHeight);
                        //     //
                        // }
                        // // console.log(i,j);
                        // ctx.fillStyle = "rgba(0,0,0,1)";
                        ctx.fillText(
                            tableData[i][colArray[j]],
                            columnWidth * j + columnWidth / 2,
                            (i + 1) * rowHeight + rowHeight / 2
                        );
                    }
                }
            }

            drawTableData();



            // Selection logic
            // let selectedCells = [];
            function drawBorder(xPos, yPos, width, height, thickness = 1) {
                ctx.fillStyle='#FF4C4C';
                ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
            }

            function drawSelection() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawGrid();
                var lx= Math.min(startCellsX,endCellsX);
                var ly= Math.min(startCellsY,endCellsY);
                var hx= Math.max(startCellsX,endCellsX);
                var hy= Math.max(startCellsY,endCellsY);
                for (var i = 0; i < tableData.length; i++) {
                    // console.log(tableData.length)
                    for (var j = 0; j < colArray.length; j++) {
                        // console.log(i,j)
                        if(lx<=j && j<=hx && ly<=i && i<=hy){
                            drawBorder(j * columnWidth, i * rowHeight, columnWidth, rowHeight,3);
                            ctxx.fillStyle = "#F3FEB8";
                            ctxx.fillRect(j * columnWidth, i * rowHeight, columnWidth-1, rowHeight-1);


                        }
                    }
                }
                // ctx.clearRect(0, 0, canvas.width, canvas.height);
                // var ct = canvas.getContext("2d");
                // drawGrid();
                // // for (let cell of selectedCells) {
                // //     let [col, row] = cell;
                // //     ctx.fillStyle = "rgb(243, 254, 184)";
                // //     ctx.fillRect(col * columnWidth, row * rowHeight, columnWidth, rowHeight);
                // // }
                // // ctx.fillStyle = "rgb(0,0,0)";
                drawTableData();


                // console.log(selectedCells)

                // drawGrid();
                // drawTableData();
            }

            // canvas.addEventListener("click", function (e) {
            //     startCellsX = Math.floor(e.offsetX / 220);
            //     startCellsY = Math.floor(e.offsetY / 40);
            //     endCellsX = startCellsX;
            //     endCellsY = startCellsY;

            //     ipBox.style.left = `${(startCellsX*220)+25}px`;//191
            //     ipBox.style.top = `${(startCellsY*40)+139}px`;//71
            //     // console.log(startCellsX, startCellsY, "hell");
            //     ipBox.type="text";
            //     ipBox.value = tableData[startCellsY][colArray[startCellsX]];
            //     // ipBox.focus();
            // })

            canvas.addEventListener("mousedown", function (e) {
                ipBox.type="hidden";
                startCellsX = Math.floor(e.offsetX / 220);
                startCellsY = Math.floor(e.offsetY / 40);
                endCellsX = startCellsX;
                endCellsY = startCellsY;
                selection = 1;
                console.log(e.offsetX,e.offsetY)

                // ipBox.style.left = `${(startCellsX*220)+25}px`;//191
                // ipBox.style.top = `${(startCellsY*40)+139}px`;//71
                // console.log(startCellsX, startCellsY, "hell");
                // ipBox.type="text";
                // ipBox.value = tableData[startCellsY][colArray[startCellsX]];

                drawSelection();
            });

            canvas.addEventListener("mousemove", function (e) {
                if(selection){
                    endCellsX = Math.floor(e.offsetX / 220);
                    endCellsY = Math.floor(e.offsetY / 40);
                    // endCellsX = startCellsX;
                    // endCellsY = startCellsY;
                    // selection = 1;
                    // console.log(startCellsX,startCellsY)

                    drawSelection();
                }
            });

            canvas.addEventListener("mouseup", function (e) {

                // startCellsX = Math.floor(e.offsetX / 186);
                // startCellsY = Math.floor(e.offsetY / 34);
                // endCellsX = startCellsX;
                // endCellsY = startCellsY;
                selection = 0;
                // console.log(startCellsX,startCellsY)

                // drawSelection();
            });

            // canvas.addEventListener('click', function (e) {

            //     // selectedCells = [];

            //     console.log(e.offsetX, e.offsetY)
            //     const col = Math.floor(e.offsetX / 186);
            //     const row = Math.floor(e.offsetY / 34);
            //     console.log(col,row)

            //     // Check if shift key is pressed for multiple selection
            //     if (e.shiftKey) {
            //         selectedCells.push([col, row]);
            //     } else {
            //         selectedCells = [[col, row]];
            //     }
            //     // ctx.fillStyle = "rgba(173, 216, 230, 0.5)";
            //     // ctx.fillRect(440,440,220,220);

            //     drawSelection();
            // });

            // canvas.addEventListener('dblclick', function (e) {
            //     const col = Math.floor(e.offsetX / columnWidth);
            //     const row = Math.floor(e.offsetY / rowHeight);

            //     const index = selectedCells.findIndex(cell => cell[0] === col && cell[1] === row);
            //     if (index !== -1) {
            //         selectedCells.splice(index, 1);
            //     }

            //     drawSelection();
            // });





            // // ipBox.style.left = `${25}px`;//191
            // // ipBox.style.top = `${139}px`;//71

            canvas.addEventListener("dblclick", function (e) {
                // ipBox.style.
                // console.log(e.offsetX, e.offsetY)

                startCellsX = Math.floor(e.offsetX / 220);
                startCellsY = Math.floor(e.offsetY / 40);

                // var x = e.offsetX;
                // var y = e.offsetY;
                ipBox.type="text";
                ipBox.style.left = `${(startCellsX*220)+25}px`;//191
                ipBox.style.top = `${(startCellsY*40)+139}px`;//71
                // console.log(startCellsX, startCellsY, "hell");
                ipBox.value = tableData[startCellsY-1][colArray[startCellsX]];
                ipBox.focus();
            })

            ipBox.addEventListener("keypress", function (e) {
                if(e.key === "Enter"){
                    console.log(ipBox.value);
                    tableData[startCellsY-1][colArray[startCellsX]] = ipBox.value;
                    ipBox.type="hidden";
                    drawTableData();
                    drawSelection();
                }
            })



            
            const element = document.getElementById("canvasDiv");
            let x = element.scrollHeight;
            let y = element.scrollWidth;
            console.log(x,y);

            element.addEventListener("scroll",  (e) => {
                e.preventDefault();
                console.log("hi");
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
});
