import { join } from '@std/path/join'
import { readInputLines } from '../utils.ts'
import { MinHeap } from './heap.ts'

type Position = [number, number]
type direction = Position

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

let StartPosition: Position = [0, 0]
let EndPosition: Position = [0, 0]

const input = readInputLines(join(dirname, 'data', './input.txt'))
const map = input.map((line, row) =>
	line.split('').map((char, col) => {
		if (char == 'S') StartPosition = [row, col]
		if (char == 'E') EndPosition = [row, col]
		return char
	})
)

function printMap(map: string[][]) {
	map.forEach((row) => console.log(row.join('')))
}

function getNextDirectionsAndCost(direction: Position) {
	const [dx, dy] = direction
	return [
		{ direction: [dx, dy], cost: 1 }, // same direction, cost: 1 (step)
		{ direction: [dy, -dx], cost: 1001 }, // rotate clockwise, cost: 1000 (rotate) + 1 (step)
		{ direction: [-dy, dx], cost: 1001 } // rotate counter clockwise, cost: 1000 (rotate) + 1 (step)
	]
}

/**
 * Use Dikjstra's algorithm to find the shortest path
 */
function partOne() {
	const heap = new MinHeap([{ cost: 0, position: StartPosition, direction: [0, 1] }]) // assume start direction is right
	const visited = new Set<string>()

	const mapCopy = map.map((row) => [...row])

	while (heap.heap.length) {
		// Each time get the minimum cost path
		const { cost, position, direction } = heap.removeMin() as {
			cost: number
			position: Position
			direction: Position
		}
		for (const { cost: additionalCost, direction: newDirection } of getNextDirectionsAndCost(direction)) {
			const key = `${position[0]}_${position[1]}_${newDirection[0]}_${newDirection[1]}`

			if (visited.has(key)) continue
			visited.add(key)

			const newPostion: Position = [position[0] + newDirection[0], position[1] + newDirection[1]]

			if (map[newPostion[0]][newPostion[1]] == '#') continue
			if (map[newPostion[0]][newPostion[1]] == 'E') {
				return console.log('Part one: ', cost + additionalCost)
			}

			// mapCopy[position[0]][position[1]] = '.'
			mapCopy[newPostion[0]][newPostion[1]] = 'S'
			// printMap(mapCopy) // uncomment to visualize while debugginf

			heap.insert({ cost: cost + additionalCost, position: newPostion, direction: newDirection })
		}
	}
}

type Node = {
	position: Position
	prev: Node | null
}

function partTwo() {
	const heap = new MinHeap([{ cost: 0, node: { position: StartPosition, prev: null }, direction: [0, 1] }]) // assume start direction is right
	const visited = new Map<string, number>() // key: position, value: cost

	const mapCopy = [...map]

	const possiblePaths: Node[] = []

	while (heap.heap.length) {
		const { cost, node, direction } = heap.removeMin() as {
			cost: number
			node: Node
			direction: Position
		}
		const position = node.position

		for (const { cost: additionalCost, direction: newDirection } of getNextDirectionsAndCost(direction)) {
			const newPostion: Position = [position[0] + newDirection[0], position[1] + newDirection[1]]
			const key = `${newPostion[0]}_${newPostion[1]}`

			if (visited.has(key)) {
				if (visited.get(key)! != cost + additionalCost) continue
			}
			visited.set(key, cost + additionalCost)

			if (map[newPostion[0]][newPostion[1]] == '#') continue
			if (map[newPostion[0]][newPostion[1]] == 'E') {
				possiblePaths.push({ position: newPostion, prev: node })
				continue
			}

			// mapCopy[position[0]][position[1]] = '.'
			mapCopy[newPostion[0]][newPostion[1]] = 'S'
			printMap(mapCopy) // uncomment to visualize while debugginf

			heap.insert({
				cost: cost + additionalCost,
				node: { position: newPostion, prev: node },
				direction: newDirection
			})
		}
	}
	const seenLocations = new Set<string>()
	let numberOfBestSeats = 0
	for (const node of possiblePaths) {
		let current: Node | null = node
		while (current) {
			const key = `${current.position[0]}_${current.position[1]}`
			if (seenLocations.has(key)) continue
			seenLocations.add(key)
			numberOfBestSeats++
			current = current.prev
		}
	}
	console.log('Part two: ', numberOfBestSeats)
}

partOne()
partTwo()
