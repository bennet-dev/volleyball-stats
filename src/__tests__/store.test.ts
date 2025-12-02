import { useStore } from '@/store/useStore'

describe('useStore - Player Stats', () => {
  beforeEach(() => {
    useStore.getState().resetStats()
  })

  describe('initial state', () => {
    it('should have all stats initialized to 0', () => {
      const { stats } = useStore.getState()
      expect(stats.kills).toBe(0)
      expect(stats.aces).toBe(0)
      expect(stats.blocks).toBe(0)
      expect(stats.digs).toBe(0)
      expect(stats.assists).toBe(0)
    })
  })

  describe('incrementStat', () => {
    it('should increment a stat by 1', () => {
      useStore.getState().incrementStat('kills')
      expect(useStore.getState().stats.kills).toBe(1)
    })

    it('should increment multiple times', () => {
      useStore.getState().incrementStat('aces')
      useStore.getState().incrementStat('aces')
      useStore.getState().incrementStat('aces')
      expect(useStore.getState().stats.aces).toBe(3)
    })
  })

  describe('decrementStat', () => {
    it('should decrement a stat by 1', () => {
      useStore.getState().updateStat('blocks', 5)
      useStore.getState().decrementStat('blocks')
      expect(useStore.getState().stats.blocks).toBe(4)
    })

    it('should not go below 0', () => {
      useStore.getState().decrementStat('digs')
      expect(useStore.getState().stats.digs).toBe(0)
    })
  })

  describe('updateStat', () => {
    it('should set a stat to a specific value', () => {
      useStore.getState().updateStat('assists', 10)
      expect(useStore.getState().stats.assists).toBe(10)
    })
  })

  describe('resetStats', () => {
    it('should reset all stats to 0', () => {
      useStore.getState().updateStat('kills', 15)
      useStore.getState().updateStat('aces', 3)
      useStore.getState().resetStats()
      expect(useStore.getState().stats.kills).toBe(0)
      expect(useStore.getState().stats.aces).toBe(0)
    })
  })

  describe('computed stats', () => {
    it('should calculate attack percentage correctly', () => {
      useStore.getState().updateStat('kills', 10)
      useStore.getState().updateStat('attackErrors', 2)
      useStore.getState().updateStat('attackAttempts', 20)
      // (10 - 2) / 20 = 0.4 = 40%
      expect(useStore.getState().getAttackPercentage()).toBe(40)
    })

    it('should return 0 for attack percentage with no attempts', () => {
      expect(useStore.getState().getAttackPercentage()).toBe(0)
    })

    it('should calculate serve percentage correctly', () => {
      useStore.getState().updateStat('serveAttempts', 10)
      useStore.getState().updateStat('serviceErrors', 1)
      // (10 - 1) / 10 = 0.9 = 90%
      expect(useStore.getState().getServePercentage()).toBe(90)
    })

    it('should calculate reception percentage correctly', () => {
      useStore.getState().updateStat('receptionAttempts', 20)
      useStore.getState().updateStat('receptionErrors', 4)
      // (20 - 4) / 20 = 0.8 = 80%
      expect(useStore.getState().getReceptionPercentage()).toBe(80)
    })

    it('should calculate block percentage correctly', () => {
      useStore.getState().updateStat('blocks', 3)
      useStore.getState().updateStat('blockAttempts', 10)
      // 3 / 10 = 0.3 = 30%
      expect(useStore.getState().getBlockPercentage()).toBe(30)
    })
  })
})
