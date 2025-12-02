import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PlayerStats {
  // Attacking
  kills: number
  attackErrors: number
  attackAttempts: number

  // Serving
  aces: number
  serviceErrors: number
  serveAttempts: number

  // Passing/Reception
  receptionErrors: number
  receptionAttempts: number

  // Setting
  assists: number
  settingErrors: number

  // Blocking
  blocks: number
  blockErrors: number
  blockAttempts: number

  // Digging
  digs: number
  digErrors: number
}

interface PlayerState {
  stats: PlayerStats
  updateStat: <K extends keyof PlayerStats>(stat: K, value: number) => void
  incrementStat: (stat: keyof PlayerStats) => void
  decrementStat: (stat: keyof PlayerStats) => void
  resetStats: () => void

  // Computed stats
  getAttackPercentage: () => number
  getServePercentage: () => number
  getReceptionPercentage: () => number
  getBlockPercentage: () => number
}

const initialStats: PlayerStats = {
  kills: 0,
  attackErrors: 0,
  attackAttempts: 0,
  aces: 0,
  serviceErrors: 0,
  serveAttempts: 0,
  receptionErrors: 0,
  receptionAttempts: 0,
  assists: 0,
  settingErrors: 0,
  blocks: 0,
  blockErrors: 0,
  blockAttempts: 0,
  digs: 0,
  digErrors: 0,
}

export const useStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      stats: { ...initialStats },

      updateStat: (stat, value) =>
        set((state) => ({
          stats: { ...state.stats, [stat]: value },
        })),

      incrementStat: (stat) =>
        set((state) => ({
          stats: { ...state.stats, [stat]: state.stats[stat] + 1 },
        })),

      decrementStat: (stat) =>
        set((state) => ({
          stats: { ...state.stats, [stat]: Math.max(0, state.stats[stat] - 1) },
        })),

      resetStats: () => set({ stats: { ...initialStats } }),

      // Attack percentage: (Kills - Errors) / Attempts
      getAttackPercentage: () => {
        const { kills, attackErrors, attackAttempts } = get().stats
        if (attackAttempts === 0) return 0
        return ((kills - attackErrors) / attackAttempts) * 100
      },

      // Serve percentage: (Attempts - Errors) / Attempts (in-play rate)
      getServePercentage: () => {
        const { serveAttempts, serviceErrors } = get().stats
        if (serveAttempts === 0) return 0
        return ((serveAttempts - serviceErrors) / serveAttempts) * 100
      },

      // Reception percentage: (Attempts - Errors) / Attempts
      getReceptionPercentage: () => {
        const { receptionAttempts, receptionErrors } = get().stats
        if (receptionAttempts === 0) return 0
        return ((receptionAttempts - receptionErrors) / receptionAttempts) * 100
      },

      // Block percentage: Blocks / Attempts
      getBlockPercentage: () => {
        const { blocks, blockAttempts } = get().stats
        if (blockAttempts === 0) return 0
        return (blocks / blockAttempts) * 100
      },
    }),
    {
      name: 'volley-player-stats',
      partialize: (state) => ({ stats: state.stats }),
    }
  )
)
