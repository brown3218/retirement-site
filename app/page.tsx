"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { projectRetirementBalances, ProjectionInput } from "@/lib/finance/projection";

const defaultInputs: ProjectionInput = {
  currentAge: 38,
  retirementAge: 60,
  currentSavings: 200_000,
  annualContribution: 24_000,
  annualReturnPercent: 7,
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

type InputKey = keyof ProjectionInput;

const inputLabels: Record<InputKey, string> = {
  currentAge: "Current age",
  retirementAge: "Retirement age",
  currentSavings: "Current savings",
  annualContribution: "Annual contribution",
  annualReturnPercent: "Expected annual return %",
};

const inputStep: Record<InputKey, number> = {
  currentAge: 1,
  retirementAge: 1,
  currentSavings: 1_000,
  annualContribution: 1_000,
  annualReturnPercent: 0.1,
};

const inputMin: Record<InputKey, number> = {
  currentAge: 0,
  retirementAge: 0,
  currentSavings: 0,
  annualContribution: 0,
  annualReturnPercent: -100,
};

export default function Home() {
  const [inputs, setInputs] = useState<ProjectionInput>(defaultInputs);

  const { rows, finalBalance, error } = useMemo(() => {
    try {
      const result = projectRetirementBalances(inputs);
      return { ...result, error: null as string | null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to calculate projection.";
      return { rows: [], finalBalance: 0, error: message };
    }
  }, [inputs]);

  const handleNumberChange = (key: InputKey) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setInputs((prev) => ({ ...prev, [key]: Number.isNaN(value) ? prev[key] : value }));
  };

  const hasRows = rows.length > 0;

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900">
      <main className="mx-auto flex max-w-5xl flex-col gap-10 rounded-3xl bg-white p-8 shadow-xl sm:p-12">
        <section className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">Retirement planning</p>
          <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">Plan your retirement trajectory</h1>
          <p className="text-base text-zinc-600">
            Adjust the assumptions below to estimate how much you could have saved by the time you retire. All calculations run in your
            browser—nothing is stored.
          </p>
        </section>

        <section className="grid gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-6 sm:grid-cols-2">
          {Object.entries(inputLabels).map(([key, label]) => {
            const field = key as InputKey;
            return (
              <label key={field} className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                {label}
                <input
                  type="number"
                  inputMode="decimal"
                  className="rounded-xl border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={inputs[field]}
                  onChange={handleNumberChange(field)}
                  min={inputMin[field]}
                  step={inputStep[field]}
                />
              </label>
            );
          })}
        </section>

        <section className="rounded-2xl border border-zinc-100 p-6">
          <h2 className="text-lg font-semibold text-zinc-900">Projected balance at retirement</h2>
          {error ? (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          ) : (
            <p className="mt-2 text-3xl font-bold text-emerald-600">{currencyFormatter.format(finalBalance)}</p>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-100">
          <div className="border-b border-zinc-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-zinc-900">Year-by-year projection</h2>
          </div>
          <div className="max-h-[400px] overflow-auto">
            <table className="min-w-full text-left text-sm text-zinc-700">
              <thead className="sticky top-0 bg-white text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-6 py-3">Age</th>
                  <th className="px-6 py-3">Year</th>
                  <th className="px-6 py-3">Start balance</th>
                  <th className="px-6 py-3">Contribution</th>
                  <th className="px-6 py-3">Growth</th>
                  <th className="px-6 py-3">End balance</th>
                </tr>
              </thead>
              <tbody>
                {hasRows ? (
                  rows.map((row) => (
                    <tr key={row.age} className="border-t border-zinc-100">
                      <td className="px-6 py-3 font-medium">{row.age}</td>
                      <td className="px-6 py-3">{row.year}</td>
                      <td className="px-6 py-3">{currencyFormatter.format(row.startBalance)}</td>
                      <td className="px-6 py-3">{currencyFormatter.format(row.contribution)}</td>
                      <td className="px-6 py-3 text-emerald-600">{currencyFormatter.format(row.growth)}</td>
                      <td className="px-6 py-3 font-semibold">{currencyFormatter.format(row.endBalance)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">
                      Enter valid inputs to see projections.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
