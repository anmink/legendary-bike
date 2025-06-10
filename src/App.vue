<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from './stores/gameplay'

const store = useStore()
const gridSize = 10
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)
const tileSize = computed(() => Math.min(windowWidth.value, windowHeight.value) / gridSize)

const grid = ref([])

const streetTypes = [
  'road_horizontal',
  'road_vertical',
  'road_curve_tl',
  'road_curve_tr',
  'road_curve_bl',
  'road_curve_br',
]

function generateMap() {
  grid.value = []

  for (let y = 0; y < gridSize; y++) {
    const row = []
    for (let x = 0; x < gridSize; x++) {
      const randomStreet = streetTypes[Math.floor(Math.random() * streetTypes.length)]
      console.log(randomStreet)
      row.push({ x, y, type: randomStreet })
    }
    grid.value.push(row)
  }
}

window.addEventListener('resize', () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
})

onMounted(() => {
  generateMap()
})
</script>

<template>
  <div
    class="relative flex items-center justify-center"
    :style="{ width: `${windowWidth}px`, height: `${windowHeight}px` }"
  >
    <div
      class="relative"
      :style="{ width: `${gridSize * tileSize}px`, height: `${gridSize * tileSize}px` }"
    >
      <div v-for="row in grid">
        <div v-for="tile in row" :key="`${tile.x}-${tile.y}`">
          <img
            :src="`/assets/${tile.type}.svg`"
            :style="{
              position: 'absolute',
              left: `${tile.x * tileSize}px`,
              top: `${tile.y * tileSize}px`,
              width: `${tileSize}px`,
              height: `${tileSize}px`,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
