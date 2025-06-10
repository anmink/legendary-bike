<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from './stores/gameplay'

const store = useStore()
const container = ref(null)
let hasPackage = false
let deliverySuccess = false

function isPlayer(row, col) {
  return store.player.x === row && store.player.y === col
}

function isPackage(row, col) {
  return store.package.x === row && store.package.y === col
}

function isDestination(row, col) {
  return store.destination.x === row && store.destination.y === col
}

function isPlayerAndPackage(row, col) {
  return (
    store.player.x === row &&
    store.player.y === col &&
    store.package.x === row &&
    store.package.y === col
  )
}

function isPlayerAndPackageAndDestination(row, col) {
  return (
    store.player.x === row &&
    store.player.y === col &&
    store.destination.x === row &&
    store.destination.y === col
  )
}

function handleKey(e) {
  const { key } = e
  e.preventDefault()
  const max = store.gridSize - 1

  if (key === 'ArrowUp' && store.player.x > 0) {
    store.player.x--
  } else if (key === 'ArrowDown' && store.player.x < max) {
    store.player.x++
  } else if (key === 'ArrowLeft' && store.player.y > 0) {
    store.player.y--
  } else if (key === 'ArrowRight' && store.player.y < max) {
    store.player.y++
  }

  if (store.player.x === store.package.x && store.player.y === store.package.y) {
    hasPackage = true
  }

  if (hasPackage) {
    store.package.x = store.player.x
    store.package.y = store.player.y
  }

  if (
    hasPackage &&
    store.player.x === store.destination.x &&
    store.player.y === store.destination.y
  ) {
    store.countScore()
    hasPackage = false
    deliverySuccess = true
    console.log('score:', store.score)
  }

  if (deliverySuccess) {
    store.player.x = Math.floor(Math.random() * store.gridSize)
    store.player.y = Math.floor(Math.random() * store.gridSize)
    store.package.x = Math.floor(Math.random() * store.gridSize)
    store.package.y = Math.floor(Math.random() * store.gridSize)
    store.destination.x = Math.floor(Math.random() * store.gridSize)
    store.destination.y = Math.floor(Math.random() * store.gridSize)
    deliverySuccess = false
  }

  console.log('player:', store.player, 'package:', store.package)
}

onMounted(() => {
  container.value?.focus()
})
</script>

<template>
  <div
    ref="container"
    class="w-screen h-screen flex items-center justify-center overflow-hidden"
    tabindex="0"
    @keydown="handleKey"
  >
    <button @click="startGame">Start Game</button>
    <div>
      <div v-for="(row, rowIndex) in store.gridSize" :key="rowIndex" class="flex">
        <div
          v-for="(col, colIndex) in store.gridSize"
          :key="colIndex"
          class="w-8 h-8 border border-red-300 flex justify-center items-center"
        >
          <span v-if="isPlayerAndPackageAndDestination(rowIndex, colIndex)">⭐️</span>
          <span v-else-if="isPlayerAndPackage(rowIndex, colIndex)">🚴📦</span>
          <span v-else-if="isPlayer(rowIndex, colIndex)">🚴</span>
          <span v-else-if="isPackage(rowIndex, colIndex)">📦</span>
          <span v-else-if="isDestination(rowIndex, colIndex)">🏠</span>
        </div>
      </div>
      <div>Score: {{ store.score }}</div>
    </div>
  </div>
</template>

<style scoped></style>
