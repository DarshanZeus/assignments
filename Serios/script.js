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

            var tableWidth = columnWidth * 17;
            var tableHeight = canvas.height;

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
            }

            // Draw the table grid
            drawGrid();

            // Add column headers
            var columnHeaders = [
                "ID", "Email ID", "Name", "Country", "State", "City",
                "Telephone No.", "Address Line 1", "Address Line 2", "Date of Birth",
                "FY-19-20", "FY-20-21", "FY-21-22", "FY-22-23", "FY-23-24"
            ];

            for (var i = 0; i < columnHeaders.length; i++) {
                ctx.fillText(columnHeaders[i], columnWidth * i + columnWidth / 2, rowHeight / 2);
            }

            var colArray = [
                "id", "email_id", "name", "country", "state", "city",
                "telephone", "address_line_1", "address_line_2", "date_of_birth",
                "gross_salary_FY2019_20", "gross_salary_FY2020_21", "gross_salary_FY2021_22",
                "gross_salary_FY2022_23", "gross_salary_FY2023_24"
            ];

            var tableData = response.data;

            // Function to draw table data
            function drawTableData() {
                for (var i = 0; i < tableData.length; i++) {
                    ctx.fillText(columnHeaders[i], columnWidth * i + columnWidth / 2, rowHeight / 2);
                    for (var j = 0; j < colArray.length; j++) {
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
            let selectedCells = [];

            function drawSelection() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // var ct = canvas.getContext("2d");
                drawGrid();
                for (let cell of selectedCells) {
                    let [col, row] = cell;
                    ctx.fillStyle = "rgba(217, 255, 227)";
                    ctx.fillRect(col * columnWidth, row * rowHeight, columnWidth, rowHeight);
                }
                ctx.fillStyle = "rgba(0,0,0,1)";
                drawTableData();


                console.log(selectedCells)
                

                

                // drawGrid();
                // drawTableData();
            }

            canvas.addEventListener('click', function (e) {

                selectedCells = [];

                console.log(e.offsetX, e.offsetY)
                const col = Math.floor(e.offsetX / 186);
                const row = Math.floor(e.offsetY / 35);
                console.log(col,row)

                // Check if shift key is pressed for multiple selection
                if (e.shiftKey) {
                    selectedCells.push([col, row]);
                } else {
                    selectedCells = [[col, row]];
                }
                // ctx.fillStyle = "rgba(173, 216, 230, 0.5)";
                // ctx.fillRect(440,440,220,220);

                drawSelection();
            });

            // canvas.addEventListener('dblclick', function (e) {
            //     const col = Math.floor(e.offsetX / columnWidth);
            //     const row = Math.floor(e.offsetY / rowHeight);

            //     const index = selectedCells.findIndex(cell => cell[0] === col && cell[1] === row);
            //     if (index !== -1) {
            //         selectedCells.splice(index, 1);
            //     }

            //     drawSelection();
            // });

        })
        .catch(error => {
            console.error('Error:', error);
        });
});
