// This file is contributed by:
// Yunze Guan(Gary), Grantley Kuo, Matthew Pham
// For hw1 in CPSC2350, 2023 Spring

let totalPopNum = 0, // number of total population of all states
    repNum = 0, // number of total representatives
    avgPopPerRep = 0; // average population per representative


// Author: Grantley Kuo
// Debug: Matthew Pham 
document.getElementById("form").addEventListener('submit', (e) => {
    // prevent refreshing the page
    e.preventDefault();

    let filename = document.getElementById('file').files[0].name.split('.').pop();

    if (filename == "csv") {
        // Papa.parse turns .csv file into json object
        // where it contains several inner json objects
        // they look like {States: "state_name", Pop: "#"}
        Papa.parse(document.getElementById('file').files[0],
            {
                // these are parsing attributes
                download: true,
                header: true,
                skipEmptyLines: true,
                transformHeader: function (h) {
                    return h.trim();
                },

                // when reading is finished,
                // the data will be parsed to results
                complete: function (results) {
                    totalPopNum = 0;
                    repNum = 0;
                    avgPopPerRep = 0;

                    if (document.getElementById("hamilton").checked) {
                        totalPopulation(results.data);
                        avgPopPerRepCalc();
                        stateStats(results.data);
                        sortNprint(results.data);
                    } else {
                        priorityAssign(results.data);
                        sortNprint(results.data);
                    }
                    outputcsv(results.data);
                }
            });
    } else {    // created by Yunze Guan
                // convert xlsx to json array
        const file = document.getElementById('file').files[0];

        file.arrayBuffer().then((res) => {
            let data = new Uint8Array(res);
            let workbook = XLSX.read(data, { type: "array" });
            let worksheet = workbook.Sheets[workbook.SheetNames[0]];
            let results = XLSX.utils.sheet_to_json(worksheet, { raw: true });

            if (document.getElementById("hamilton").checked) {
                totalPopulation(results);
                avgPopPerRepCalc();
                stateStats(results);
                sortNprint(results);
            } else {
                priorityAssign(results);
                sortNprint(results);
            }
            outputcsv(results);

        });

    }
});

// Algorithm implemented by: Yunze Guan(Gary)
// calculate the total population of all states
function totalPopulation(results) {
    for (let i = 0; i < results.length; i++) {
        totalPopNum += Number(results[i].Pop);
    }

}

// calculates priority score of a state
function priorityScoreCalc(populationOfState, numberOfStateRep) {
    let priority = populationOfState / (Math.sqrt(numberOfStateRep * (numberOfStateRep + 1)));
    return priority;
}

function priorityAssign(results) {
    // add one rep and calculate priority score to each state
    for (let i = 0; i < results.length; i++) {
        results[i].Representatives = 1;
        results[i].priorityScore = priorityScoreCalc(results[i].Pop, results[i].Representatives);
    }

    let highestPriorityScore = 0,
        objectWithHighestScore;
    // adds x amount of representatives to states
    for (let i = 0; i < document.getElementById('representatives').value - 1; i++) {
        highestPriorityScore = 0;
        objectWithHighestScore;

        // locates state with calculated highest priority
        for (let i = 0; i < results.length; i++) {
            results[i].priorityScore = priorityScoreCalc(results[i].Pop, results[i].Representatives)
            if (results[i].priorityScore > highestPriorityScore) {
                highestPriorityScore = results[i].priorityScore;
                objectWithHighestScore = results[i];
            }
        }

        // adds one representative to state with highest priority
        objectWithHighestScore.Representatives = objectWithHighestScore.Representatives + 1;
    }

}

// calculate the average population corresponding to each representative
function avgPopPerRepCalc() {
    repNum = document.getElementById('representatives').value;

    avgPopPerRep = Math.round(totalPopNum / repNum);
}

// add data to each state
function stateStats(results) {
    let minNumRepEachState = 0, numRepLeft = 0;

    // write divide, floor and remain to each state
    for (let i = 0; i < results.length; i++) {
        let divide = Number((Number(results[i].Pop) / avgPopPerRep).toFixed(2)),
            floor = Math.floor(divide),
            remain = Number((divide - floor).toFixed(2));

        results[i] = {
            State: results[i].State, Pop: results[i].Pop,
            Floor: floor, Remain: remain
        };

        minNumRepEachState += floor;
    }

    // calculate the representative left
    numRepLeft = repNum - minNumRepEachState;

    if (numRepLeft != 0) {
        fillRep(results, numRepLeft);
    }
}

// fill the remaining representatives into states that have larger remainder
function fillRep(results, numRepLeft) {
    // sort the results object array by remainder
    // in descending order
    results.sort(function (a, b) {
        return a.Remain > b.Remain ? -1 : 1;
    });

    // fill the remaining representatives by remainder
    // states with large remainder will be filled first
    for (let i = 0; i < results.length && numRepLeft > 0; (i++) % results.length) {
        results[i]['Floor'] += 1;

        numRepLeft -= 1;
    }
}

// print out the results on the page
function sortNprint(results) {
    // sort the states alphabetically
    results.sort(function (a, b) {
        return a.State > b.State ? 1 : -1;
    });

    // initialize the printing area
    document.getElementById("output").innerHTML = "";

    // print the results
    if (document.getElementById("hamilton").checked) {
        for (let item of results) {
            document.getElementById("output").innerHTML += item.State + ": " + Number(item.Floor) + "<br/>";
        }
    } else {
        for (let item of results) {
            document.getElementById("output").innerHTML += item.State + ": " + Number(item.Representatives) + "<br/>"
        }
    }

    // count the total number of representatives
    // for checking purpose
    let total = 0;

    for (let i = 0; i < results.length; (i++) % results.length) {
        total += results[i]['Floor'];
    }

    document.getElementById("output").innerHTML += "Total: " + total;
}

// write the outputs to csv file named "output.csv"
function outputcsv(results) {
    // array of output data
    let repData = [];

    // push data into array 
    for (let i = 0; i < results.length; i++) {
        repData.push({ State: results[i].State, Rep: results[i].Floor });
    }

    // get the element button
    const downcsv = document.getElementById("dl");

    // when button is clicked, data will be parsed into downloadcsv
    downcsv.addEventListener("click", () => {
        downloadcsv("output.csv", json2csv.parse(repData, {
            header: false,
            eol: ', \r\n'
        }));
    });


}

// this function is to turn array data into a downloadable csv file
function downloadcsv(filename, csvData) {
    const element = document.createElement("a");

    element.setAttribute("href", `data:text/csv;charset=utf-8,${csvData}`);
    element.setAttribute("download", filename);
    element.style.display = "none";

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}