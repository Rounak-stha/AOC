import { join } from '@std/path/join'
import { readInputLines } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInputLines(join(dirname, 'data', './input.txt'))

type Position = [number, number]
type Direction = Position

const startingPosition: Position = [0, 0]

const map = input.map((line, r) => {
	const row = line.split('')
	const foundIndex = row.findIndex((char) => char == '^')
	if (foundIndex != -1) {
		startingPosition[0] = r
		startingPosition[1] = foundIndex
	}
	return row
})

const NUM_OF_ROWS = map.length
const NUM_OF_COLS = map[0].length

function isOutOfBounds(position: Position) {
	return position[0] < 0 || position[0] >= NUM_OF_ROWS || position[1] < 0 || position[1] >= NUM_OF_COLS
}

function hasObstruction(position: Position) {
	return map[position[0]][position[1]] == '#'
}

function hasObstructionInMap(map: string[][], position: Position) {
	return map[position[0]][position[1]] == '#'
}

function turn(direction: Direction): Direction {
	return [direction[1], -direction[0]] // Rotate 90 degrees clockwise
}

function calculateNextPosition(currPosition: Position, direction: Direction): Position {
	return [currPosition[0] + direction[0], currPosition[1] + direction[1]]
}

const INITIAL_DIRECTION: Direction = [-1, 0] // Initial direction: UP

const visitedPositions = new Set<string>() // To keep track of visited positions row_col

function partOne() {
	let numOfSteps = 0
	let currDirection: Position = [...INITIAL_DIRECTION]
	let currPosition: Position = [...startingPosition]
	let nextPosition: Position = calculateNextPosition(currPosition, currDirection)

	while (!isOutOfBounds(nextPosition)) {
		if (hasObstruction(nextPosition)) {
			currDirection = turn(currDirection)
			nextPosition = calculateNextPosition(currPosition, currDirection)
		} else {
			currPosition = nextPosition
			nextPosition = calculateNextPosition(currPosition, currDirection)
			const key = currPosition.join('_')
			if (!visitedPositions.has(key)) {
				visitedPositions.add(key)
				numOfSteps++
			}
		}
	}
	console.log('Part One', numOfSteps)
}

function isStartingPosition(position: Position) {
	return position[0] == startingPosition[0] && position[1] == startingPosition[1]
}

function partTwo() {
	let validObstacles = 0

	/**
	 * Algorithm:
	 * For every visited step n Part one, we'll add a obstruction to see if the Guard runs in a loop
	 * To check if the Guard runs in a loop, we need to keep track of the direction it was moving in the previous step
	 * If for the same position, the guard has same direction as it did before, then it's a loop
	 */
	for (const p of visitedPositions) {
		const position = p.split('_').map((p) => parseInt(p)) as Position
		if (!isStartingPosition(position)) {
			const localVisitedPositionWithDirections = new Map<string, Set<string>>()
			// create a copy of the map
			const copyMap = map.map((row) => [...row])

			// add obstacle at current position
			copyMap[position[0]][position[1]] = '#'

			let currDirection: Position = [...INITIAL_DIRECTION]
			let currPosition: Position = [...startingPosition]
			let nextPosition: Position = calculateNextPosition(currPosition, currDirection)

			while (!isOutOfBounds(nextPosition)) {
				if (hasObstructionInMap(copyMap, nextPosition)) {
					currDirection = turn(currDirection)
					nextPosition = calculateNextPosition(currPosition, currDirection)
				} else {
					const key = currPosition.join('_')
					if (!localVisitedPositionWithDirections.has(key)) {
						localVisitedPositionWithDirections.set(key, new Set([currDirection.join('_')]))
					} else {
						// check if the Guard is moving in same direction as it did before
						if (localVisitedPositionWithDirections.get(key)!.has(currDirection.join('_'))) {
							validObstacles++
							break
						}
						localVisitedPositionWithDirections.get(key)!.add(currDirection.join('_'))
					}
					currPosition = nextPosition
					nextPosition = calculateNextPosition(currPosition, currDirection)
				}
			}
		}
	}
	console.log('Part Two: ', validObstacles)
}

partOne()
partTwo()
