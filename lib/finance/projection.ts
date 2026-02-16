export interface ProjectionInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  annualContribution: number;
  annualReturnPercent: number;
}

export interface ProjectionRow {
  age: number;
  year: number;
  startBalance: number;
  contribution: number;
  growth: number;
  endBalance: number;
}

export interface ProjectionResult {
  rows: ProjectionRow[];
  finalBalance: number;
}

const clampToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

/**
 * Projects investment growth until retirement using simple annual compounding.
 */
export function projectRetirementBalances(input: ProjectionInput, startYear = new Date().getFullYear()): ProjectionResult {
  const { currentAge, retirementAge, currentSavings, annualContribution, annualReturnPercent } = input;

  if (retirementAge <= currentAge) {
    throw new Error("Retirement age must be greater than current age.");
  }

  if (annualReturnPercent < -100) {
    throw new Error("Annual return percent cannot be less than -100%.");
  }

  const rows: ProjectionRow[] = [];
  let balance = currentSavings;
  const yearsToProject = retirementAge - currentAge;
  const rate = annualReturnPercent / 100;

  for (let i = 0; i < yearsToProject; i += 1) {
    const age = currentAge + i;
    const year = startYear + i;
    const startBalance = balance;
    const contribution = annualContribution;
    const preGrowth = startBalance + contribution;
    const growth = preGrowth * rate;
    const endBalance = preGrowth + growth;

    rows.push({
      age,
      year,
      startBalance: clampToTwoDecimals(startBalance),
      contribution: clampToTwoDecimals(contribution),
      growth: clampToTwoDecimals(growth),
      endBalance: clampToTwoDecimals(endBalance),
    });

    balance = endBalance;
  }

  return {
    rows,
    finalBalance: clampToTwoDecimals(balance),
  };
}
