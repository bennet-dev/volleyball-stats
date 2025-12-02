"use client";

import { useStore, type PlayerStats } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statLabels: Record<keyof PlayerStats, string> = {
  kills: "Kills",
  attackErrors: "Attack Errors",
  attackAttempts: "Attack Attempts",
  aces: "Aces",
  serviceErrors: "Service Errors",
  serveAttempts: "Serve Attempts",
  receptionErrors: "Reception Errors",
  receptionAttempts: "Reception Attempts",
  assists: "Assists",
  settingErrors: "Setting Errors",
  blocks: "Blocks",
  blockErrors: "Block Errors",
  blockAttempts: "Block Attempts",
  digs: "Digs",
  digErrors: "Dig Errors",
};

const statCategories = [
  { name: "Attacking", stats: ["kills", "attackErrors", "attackAttempts"] },
  { name: "Serving", stats: ["aces", "serviceErrors", "serveAttempts"] },
  { name: "Reception", stats: ["receptionErrors", "receptionAttempts"] },
  { name: "Setting", stats: ["assists", "settingErrors"] },
  { name: "Blocking", stats: ["blocks", "blockErrors", "blockAttempts"] },
  { name: "Digging", stats: ["digs", "digErrors"] },
] as const;

function statsToTSV(stats: PlayerStats): string {
  const headers = Object.keys(statLabels).join("\t");
  const values = Object.keys(statLabels)
    .map((key) => stats[key as keyof PlayerStats])
    .join("\t");
  return `${headers}\n${values}`;
}

export default function Home() {
  const { stats, incrementStat, decrementStat, resetStats } = useStore();
  const getAttackPercentage = useStore((state) => state.getAttackPercentage);
  const getServePercentage = useStore((state) => state.getServePercentage);
  const getReceptionPercentage = useStore(
    (state) => state.getReceptionPercentage
  );
  const getBlockPercentage = useStore((state) => state.getBlockPercentage);

  const copyToClipboard = async () => {
    const tsv = statsToTSV(stats);
    await navigator.clipboard.writeText(tsv);
    toast.success("You can paste these values into a spreadsheet!");
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-2 dark:bg-zinc-950">
      <main className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Player Stats
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyToClipboard}>
              Copy Stats
            </Button>
            <Button variant="destructive" onClick={resetStats}>
              Reset All
            </Button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg bg-white p-2 shadow dark:bg-zinc-900 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {getAttackPercentage().toFixed(1)}%
            </div>
            <div className="text-sm text-zinc-500">Attack %</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {getServePercentage().toFixed(1)}%
            </div>
            <div className="text-sm text-zinc-500">Serve %</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {getReceptionPercentage().toFixed(1)}%
            </div>
            <div className="text-sm text-zinc-500">Reception %</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {getBlockPercentage().toFixed(1)}%
            </div>
            <div className="text-sm text-zinc-500">Block %</div>
          </div>
        </div>

        <div className="space-y-6">
          {statCategories.map((category) => (
            <div
              key={category.name}
              className="rounded-lg bg-white p-4 shadow dark:bg-zinc-900"
            >
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {category.name}
              </h2>
              <div className="space-y-3">
                {category.stats.map((stat) => (
                  <div
                    key={stat}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="min-w-[140px] text-zinc-700 dark:text-zinc-300">
                      {statLabels[stat as keyof PlayerStats]}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => decrementStat(stat as keyof PlayerStats)}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center text-lg font-medium text-zinc-900 dark:text-zinc-50">
                        {stats[stat as keyof PlayerStats]}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => incrementStat(stat as keyof PlayerStats)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
