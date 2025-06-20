<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from './stores/gameplay'

const store = useStore()
const gridSize = 10
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)
const tileSize = computed(() => Math.min(windowWidth.value, windowHeight.value) / gridSize)

const grid = ref([])

const trafficObjects = ref([
  { id: 'light-1', type: 'traffic_light', x: 3, y: 0, state: 'green' },
  { id: 'car-1', type: 'car', x: 3, y:  0, direction: 'right' },
  { id: 'car-2', type: 'car', x: 4, y: 0, directions: 'right' },
])

const predefinedMap = [
  [
    'curve_dr',
    'horizontal',
    'horizontal',
    'horizontal',
    'horizontal',
    'horizontal',
    'horizontal',
    'horizontal',
    'curve_ur',
    'vertical',
  ],
  [
    'vertical',
    'curve_dl',
    'horizontal',
    'horizontal',
    'horizontal',
    'horizontal',
    'horizontal',
    'curve_ul',
    'curve_dr',
    'vertical',
  ],
  [
    'vertical',
    'vertical',
    'curve_dr',
    'curve_dl',
    'horizontal',
    'curve_ur',
    'vertical',
    'vertical',
    'curve_dl',
    'horizontal',
  ],
  [
    'vertical',
    'curve_ur',
    'horizontal',
    'horizontal',
    'curve_ul',
    'curve_dr',
    'curve_dl',
    'horizontal',
    'horizontal',
    'curve_ur',
  ],
  [
    'curve_dl',
    'horizontal',
    'curve_ul',
    'curve_dr',
    'curve_dl',
    'horizontal',
    'horizontal',
    'horizontal',
    'curve_ul',
    'vertical',
  ],
  [
    'horizontal',
    'horizontal',
    'horizontal',
    'curve_ul',
    'vertical',
    'curve_ur',
    'vertical',
    'curve_dr',
    'vertical',
    'vertical',
  ],
  [
    'curve_ul',
    'vertical',
    'curve_ur',
    'vertical',
    'curve_dl',
    'horizontal',
    'horizontal',
    'curve_ul',
    'horizontal',
    'curve_ur',
  ],
  [
    'vertical',
    'vertical',
    'vertical',
    'curve_ul',
    'curve_dr',
    'vertical',
    'curve_ur',
    'vertical',
    'curve_dr',
    'vertical',
  ],
  [
    'vertical',
    'curve_ur',
    'horizontal',
    'horizontal',
    'curve_dl',
    'horizontal',
    'horizontal',
    'horizontal',
    'horizontal',
    'curve_ul',
  ],
  [
    'curve_dl',
    'horizontal',
    'horizontal',
    'horizontal',
    'horizontal',
    'horizontal',
    'horizontal',
    'horizontal',
    'horizontal',
    'horizontal',
  ],
]

function mapTypeToAsset(type) {
  const map = {
    horizontal: 'road_horizontal',
    vertical: 'road_vertical',
    curve_ul: 'road_curve_tl',
    curve_ur: 'road_curve_tr',
    curve_dl: 'road_curve_bl',
    curve_dr: 'road_curve_br',
  }
  return map[type] || 'road_horizontal'
}

function generateMap() {
  grid.value = []

  for (let y = 0; y < gridSize; y++) {
    const row = []
    for (let x = 0; x < gridSize; x++) {
      const type = predefinedMap[y][x]
      // optional: Umbenennen für Bildpfade
      const mappedType = mapTypeToAsset(type)
      row.push({ x, y, type: mappedType })
    }
    grid.value.push(row)
  }
}

function moveCars() {
  trafficObjects.value.forEach(obj => {
    if (obj.type === 'car') {
      if (obj.direction === 'right') {
        obj.x += 1
        // später Logik implementieren, nur bewegen wenn Straße frei/ Ample grün
      }
    }
  })
}
//setInterval(moveCars, 1000)

function toggleTrafficLight(id) {
  const obj = trafficObjects.value.find(o => o.id === id)
  if (obj && obj.type === 'traffic_light') {
    obj.state = obj.state === 'green' ? 'red' : 'green'
    obj.type = obj.state === 'green' ? 'traffic_light_green' : 'traffic_light_red'
  }
  console.log(obj.type)
}

// zyklisches Umschalten z. B. alle 5 Sekunden
setInterval(() => {
  trafficObjects.value.forEach(obj => {
    if (obj.type.startsWith('traffic_light')) {
      toggleTrafficLight(obj.id)
    }
  })
}, 5000)


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
            class="border border-red-300 border-dashed"
          />
        </div>
      </div>
      <div v-for="object in trafficObjects" :key="object.id + '-' + object.type">
        <img
          :src="`/assets/${object.type}.svg`"
          :style="{
            position: 'absolute',
            left: `${object.x * tileSize}px`,
            top: `${object.y * tileSize}px`,
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            zIndex: 9999,
          }"
      </div>
    </div>
  </div>
</template>

<style scoped></style>
