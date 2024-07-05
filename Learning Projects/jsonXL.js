// const fs = require("fs");
// // const input = document.getElementById("./sample_user_records.csv");
// const  input = fs.createReadStream("./example.csv");

// console.log(input);

// readXlsxFile(input.files[0]).then(function (data) {
//     const headers = data[0];
//     const jsonData = [];
//     for (let i = 1; i < data.length; i++) {
//         const temp = {};
//         for (let j = 0; j < headers.length; j++) {
//             temp[headers[j]] = data[i][j];
//         }
//         jsonData.push(temp);
//     }
//     console.log(jsonData);

//     // document.getElementById("json_data")
//     //             .value = JSON.stringify(
//     //     jsonData,
//     //     null,
//     //     2
//     // );
// });



async function readCSV() {
    try {
        const response = await fetch('C:/Users/darshan.mahankar/OneDrive - zeuslearning.com/Desktop/Assignments/Learning Projects/sample_user_records.csv');  // replace 'yourfile.csv' with the actual file name
        console.log(response);
        const csvText = await response.text();
        
        // Simple CSV parsing function
        const parseCSV = (text) => {
            const rows = text.split('/n');
            return rows.map(row => row.split(','));
        };
        
        const data = parseCSV(csvText);
        console.log(data);
    } catch (error) {
        console.error('Error reading CSV file:', error);
    }
}

readCSV();