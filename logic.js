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
    let minNumberOfRepsForEachStateDouble = individualStatePopulation/averagePopulationPerRepresentative;
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