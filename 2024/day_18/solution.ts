import { join } from '@std/path/join'
import { readInputLines } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

type Coordinate = [number, number]
const input = readInputLines(join(dirname, 'data', './input.txt'))

const MAP_SIZE = 70
const Number_Of_Falling_Bytes = 1024

// Size is inclusive

const map = Array.from({ length: MAP_SIZE + 1 }, () => Array.from({ length: MAP_SIZE + 1 }, () => '.'))

input
	.slice(0, Number_Of_Falling_Bytes)
	.map((line) => line.split(',').map((n) => parseInt(n)) as Coordinate)
	.forEach(([col, row]) => {
		map[row][col] = '#'
	})

function printMap(map: string[][]) {
	console.log(map.map((row) => row.join('')).join('\n'))
}

// BFS to search for paths that lead to the end of the map
function bfs(map: string[][]) {
	const start: Coordinate = [0, 0]
	const end = [MAP_SIZE, MAP_SIZE]

	const queue: { position: Coordinate; steps: number }[] = [{ position: start, steps: 0 }]
	const seen: Set<string> = new Set()
	while (queue.length) {
		const { position, steps } = queue.shift()!
		const key = `${position[0]},${position[1]}`

		if (seen.has(key)) continue
		if (map[position[0]][position[1]] === '#') continue
		if (position[0] === end[0] && position[1] === end[1]) return steps

		seen.add(key)
		for (const [dx, dy] of [
			[0, 1],
			[1, 0],
			[0, -1],
			[-1, 0]
		]) {
			const [x, y] = [position[0] + dx, position[1] + dy]
			if (x < 0 || x > MAP_SIZE || y < 0 || y > MAP_SIZE) continue
			queue.push({ position: [x, y], steps: steps + 1 })
		}
	}
}

function partOne() {
	const mapCopy = map.map((row) => [...row])
	const steps = bfs(mapCopy)
	console.log('Part One:', steps)
}

function partTwo() {
	const mapCopy = map.map((row) => [...row])

	let lastFellByteIndex = Number_Of_Falling_Bytes

	while (lastFellByteIndex < input.length) {
		const [col, row] = input[lastFellByteIndex].split(',').map((n) => parseInt(n)) as Coordinate
		mapCopy[row][col] = '#'
		lastFellByteIndex++

		const steps = bfs(mapCopy)
		if (steps) continue

		return console.log('Part Two:', input[lastFellByteIndex - 1])
	}
}

partOne()
partTwo()
