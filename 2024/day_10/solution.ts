import { join } from '@std/path/join'
import { readInputLines } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInputLines(join(dirname, 'data', './input.txt'))

const map = input.map((i) => i.split('').map((i) => parseInt(i)))

const NUM_OF_ROWS = map.length
const NUM_OF_COLS = map[0].length

type Cell = [number, number]

const directions = [
	[-1, 0], // up
	[0, 1], // right
	[1, 0], // down
	[0, -1] // left
]

function isOutOfBounds(cell: Cell) {
	const [row, col] = cell
	return row < 0 || row >= NUM_OF_ROWS || col < 0 || col >= NUM_OF_COLS
}

type TraverseMeta =
	| {
			trailhead: string
			cache: Map<string, number>
			part: 'one'
			nineHeightPositionsFromTrailhead: Map<string, Set<string>>
	  }
	| {
			trailhead: string
			cache: Map<string, number>
			part: 'two'
	  }

/**
 * Recurse through every valid position while maintaining a cache to not recompute the same position
 *
 * For part one, we need to keep track of the number of valid directions that lead to a 9 but multiple trails can lead to the same 9 which is not wanted
 * so we keep track of the trailhead and the positions of the 9s that we have visited so far
 *
 * For Part 2, we can acknowledge eevery trail that lead to a 9,  thus no need to track visited 9 positions
 */

function traverse(cell: Cell, meta: TraverseMeta) {
	const { cache, part, trailhead } = meta
	const [row, col] = cell
	const key = `${row}_${col}`
	const currentValue = map[row][col]
	let validDirections = 0

	if (cache.has(key)) {
		if (part == 'one') return 0
		else return cache.get(key)!
	}

	for (let i = 0; i < directions.length; i++) {
		const newRow = row + directions[i][0]
		const newCol = col + directions[i][1]
		if (isOutOfBounds([newRow, newCol])) continue

		const newKey = `${newRow}_${newCol}`

		const nextValue = map[newRow][newCol]

		if (nextValue == currentValue + 1) {
			if (nextValue == 9) {
				if (part == 'one') {
					const nineHeightPositionsFromTrailhead = meta.nineHeightPositionsFromTrailhead
					if (!nineHeightPositionsFromTrailhead.has(trailhead)) {
						validDirections++
						nineHeightPositionsFromTrailhead.set(trailhead, new Set([newKey]))
					} else {
						const visitedNineHeights = nineHeightPositionsFromTrailhead.get(trailhead)!
						if (!visitedNineHeights.has(newKey)) {
							validDirections++
							visitedNineHeights.add(newKey)
						}
					}
				} else validDirections++
			} else validDirections += traverse([newRow, newCol], meta)
		}
	}

	cache.set(key, validDirections)
	return validDirections
}

function partOne() {
	let totalTrailScore = 0
	for (let row = 0; row < NUM_OF_ROWS; row++) {
		for (let col = 0; col < NUM_OF_COLS; col++) {
			if (map[row][col] == 0) {
				// if the current cell is a possible tailhead
				const trailScore = traverse([row, col], {
					trailhead: `${row}_${col}`,
					cache: new Map<string, number>(),
					nineHeightPositionsFromTrailhead: new Map<string, Set<string>>(),
					part: 'one'
				})
				totalTrailScore += trailScore
			}
		}
	}
	console.log('Part one', totalTrailScore)
}

function partTwo() {
	let totalTrailScore = 0
	for (let row = 0; row < NUM_OF_ROWS; row++) {
		for (let col = 0; col < NUM_OF_COLS; col++) {
			if (map[row][col] == 0) {
				// if the current cell is a possible tailhead
				const trailScore = traverse([row, col], {
					trailhead: `${row}_${col}`,
					cache: new Map<string, number>(),
					part: 'two'
				})
				totalTrailScore += trailScore
			}
		}
	}
	console.log('Part two', totalTrailScore)
}

partOne()
partTwo()
