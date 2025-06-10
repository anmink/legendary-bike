import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('gameplay', {
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      gridSize: 10,
      player: { x: 0, y: 0 },
      package: { x: 2, y: 7 },
      destination: { x: 8, y: 3 },
      score: 0,
    }
  },
  actions: {
    countScore() {
      this.score++
    },
  },
})
