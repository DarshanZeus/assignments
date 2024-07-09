
// 'use strict';

// axios.get('http://localhost:5003/userDetail')
//     .then(response => {
//         console.log(response.data);

//         const canvasDiv = document.getElementById("canvasMain");
//         // console.log(canvasDiv + "this is card container");
//         const canvasRow = document.createElement("div");
//         canvasRow.classList.add("card");
//         // console.log(cardData)

//         const textOF = document.createElement("div");
//         textOF.classList.add("card-flex-container");
//         textOF.innerHTML = `<div>${response.data[1].name}</div>`;

//         canvasRow.appendChild(textOF);
//         canvasDiv.appendChild(canvasRow);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     })



    
    'use strict';

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
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.lineWidth = 1;

            // Define the table dimensions
            var tableWidth = canvas.width;
            var tableHeight = canvas.height;
            var columnWidth = tableWidth / 14; // Assuming 5 columns
            var rowHeight = 40;

            // Draw the table grid
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

            // Add column headers
            var columnHeaders = ["Email ID",
                                "Name",
                                "Country",
                                "State",
                                "City",
                                "Telephone No.",
                                "Address Line 1",
                                "Address Line 2",
                                "Date of Birth",
                                "FY-19-20",
                                "FY-20-21",
                                "FY-21-22",
                                "FY-22-23",
                                "FY-23-24"];
            for (var i = 0; i < columnHeaders.length; i++) {
                ctx.fillText(columnHeaders[i], columnWidth * i + columnWidth / 2, rowHeight / 2);
            }

            // Add table data
            // var tableData = [
            //     ["John Doe", "25", "john@example.com", "555-1234", "123 Main St"],
            //     ["Jane Smith", "30", "jane@example.com", "555-5678", "456 Park Ave"],
            //     ["Bob Johnson", "35", "bob@example.com", "555-9012", "789 Elm St"],
            //     ["Sarah Lee", "40", "sarah@example.com", "555-3456", "321 Oak Rd"],
            //     ["Tom Wilson", "45", "tom@example.com", "555-7890", "654 Pine St"]
            // ];
            var tableData = response.data;
            console.log(tableData[1].name);
            for (var i = 0; i < tableData.length; i++) {
                // ctx.fillText(tableData[i], columnWidth * i + columnWidth / 2, rowHeight / 2);
                // for
                for (var j = 0; j < tableData[i].length; j++) {
                    ctx.fillText(tableData[i][j], columnWidth * j + columnWidth / 2, (i + 1) * rowHeight + rowHeight / 2);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

    