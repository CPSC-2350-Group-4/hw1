// part of the code is contributed from: 
// https://sebhastian.com/javascript-csv-to-array/

const myfile = document.getElementById("csv");
const myform = document.getElementById("form");
let contentStr = "", splited = "";


myform.addEventListener("submit", function (e) {
    e.preventDefault();

    const input = myfile.files[0];
    const reader = new FileReader();


    reader.readAsText(input);

    reader.onload = function (event) {
        content = reader.result;
    };

    splited = content.split(/,| /);

    document.getElementById("output").innerHTML = splited;
});



function totalPopulation(everyPopulationCellInCsvFile)
{
    let totalPopulation;
    return totalPopulation;
}


function avePopPerRepCalc(sumOfPopulations)
{
    let averagePopulationPerRepresentative = sumOfPopulations / 435;

    return averagePopulationPerRepresentative;
}

function minNumberOfRepsForEachStateDouble(individualStatePopulation, averagePopulationPerRepresentative)
{
    let minNumberOfRepsForEachStateDouble = individualStatePopulation / averagePopulationPerRepresentative;
    return minNumberOfRepsForEachStateDouble;
}

function minNumberOfRepsForEachStateDouble_RoundDown(double)
{
    return Math.floor(double);
}

function minNumberOfRepsForEachState_Remainder(individualStatePopulation, averagePopulationPerRepresentative)
{
    let remainder = individualStatePopulation % averagePopulationPerRepresentative;
    return remainder;
}

function leftOverRepresentativesToBeAddedToStatesWithHighestRemainder(sumOfCaclulatedRepresentatives)
{
    return 435 - sumOfCaclulatedRepresentatives;
}