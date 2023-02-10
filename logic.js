let totalPopNum = 0, // number of total population of all states
    repNum = 0, // number of total representatives
    avgPopPerRep = 0; // average population per representative

const submit = document.getElementById("form").addEventListener('submit', (e) => {
    e.preventDefault();

    Papa.parse(document.getElementById('csv').files[0],
        {
            download: true,
            header: true,
            skipEmptyLines: true,

            complete: function (results) {

                totalPopulation(results);
                avgPopPerRepCalc();
                stateStats(results);
                sortNprint(results);
            }
        });
});


function totalPopulation(results) {
    for (let i = 0; i < results.data.length; i++) {
        totalPopNum += Number(results.data[i].Pop);
    }

}


function avgPopPerRepCalc() {
    repNum = document.getElementById('representatives').value;

    avgPopPerRep = Math.round(totalPopNum / repNum);
}

function stateStats(results) {
    let minNumRepEachState = 0, numRepLeft = 0;

    for (let i = 0; i < results.data.length; i++) {
        let divide = Number((Number(results.data[i].Pop) / avgPopPerRep).toFixed(2)),
            floor = Math.floor(divide),
            remain = Number((divide - floor).toFixed(2));

        results.data[i] = {
            State: results.data[i].State, Pop: results.data[i].Pop,
            Floor: floor, Remain: remain
        };

        minNumRepEachState += floor;
    }

    numRepLeft = repNum - minNumRepEachState;

    console.log(results.data);

    if (numRepLeft != 0) {
        fillRep(results, numRepLeft);
    }
}

function fillRep(results, numRepLeft) {
    // sort the results object array by remainder
    results.data.sort(function (a, b) {
        return a.Remain > b.Remain ? -1 : 1;
    });


    // **************** bug here **************
    for (let i = 0; i < results.data.length && numRepLeft > 0; (i++) % results.data.length) {
        results.data[i]['Floor'] += 1;

        numRepLeft -= 1;
    }
    // ****************************************

    console.log(results.data);
}

function sortNprint(results) {
    // sort alphabetically
    // results.data.sort(function (a, b) {
    //     return a.State > b.State ? 1 : -1;
    // });

    // document.getElementById("output").innerHTML = "";

    // for (let item of results.data) {
    //     document.getElementById("output").innerHTML += item.State + ": " + item.Floor + "<br/>";
    // }
}