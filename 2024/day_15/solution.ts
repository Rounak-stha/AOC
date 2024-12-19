import { join } from '@std/path/join'
import { readInput } from '../utils.ts'
import { assert } from '@std/assert/assert'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

type Width = number
type Height = number

type Content = 'Wall' | 'Empty' | 'Box' | 'Robot'
type Direction = 'Up' | 'Down' | 'Left' | 'Right'
type position = [number, number]

const DirectionMap: Record<Direction, position> = {
	Up: [-1, 0],
	Down: [1, 0],
	Left: [0, -1],
	Right: [0, 1]
}

const input = readInput(join(dirname, 'data', './input.txt'))

function mapToContent(c: string): Content {
	switch (c) {
		case '#':
			return 'Wall'
		case '.':
			return 'Empty'
		case 'O':
			return 'Box'
		case '@':
			return 'Robot'
		default:
			throw new Error('Invalid content')
	}
}

function reverseMapToContent(c: Content): string {
	switch (c) {
		case 'Wall':
			return '#'
		case 'Empty':
			return '.'
		case 'Box':
			return 'O'
		case 'Robot':
			return '@'
		default:
			throw new Error('Invalid content')
	}
}

function mapToDirection(c: string): Direction {
	switch (c) {
		case '^':
			return 'Up'
		case 'v':
			return 'Down'
		case '<':
			return 'Left'
		case '>':
			return 'Right'
		default:
			throw new Error('Invalid direction')
	}
}

let initialRobotPosition: position = [0, 0]

const [map, movements] = (function () {
	const splitted = input.split('\r\n\r\n')
	assert(splitted.length === 2)
	const [rawMap, rawMovements] = splitted
	const map = rawMap.split('\r\n').map((row, i) =>
		row.split('').map((c, j) => {
			const content = mapToContent(c)
			if (content === 'Robot') {
				initialRobotPosition = [i, j]
			}
			return content
		})
	)

	const movements = rawMovements
		.split('\r\n')
		.join('')
		.split('')
		.map((c) => mapToDirection(c)) as Direction[]
	return [map, movements]
})()

const NUM_OF_ROWS = map.length
const NUM_OF_COLS = map[0].length

function printMap(map: Content[][]) {
	map.forEach((row) => console.log(row.map((c) => reverseMapToContent(c)).join('')))
}

function partOne() {
	const mapCopy = map.map((row) => [...row])
	let robotPosition = [...initialRobotPosition]
	let sumOfGPS = 0

	function move(direction: Direction) {
		const [dx, dy] = DirectionMap[direction]
		let nextPosition = [robotPosition[0] + dx, robotPosition[1] + dy]
		let foundEmptySpace = false
		let hasBox = false

		while (mapCopy[nextPosition[0]][nextPosition[1]] !== 'Wall') {
			const nextContent = mapCopy[nextPosition[0]][nextPosition[1]]
			if (nextContent === 'Box') hasBox = true
			if (nextContent === 'Empty') {
				foundEmptySpace = true
				break
			}
			nextPosition = [nextPosition[0] + dx, nextPosition[1] + dy]
		}
		if (foundEmptySpace) {
			// empty space is at the nextPosition
			if (hasBox) mapCopy[nextPosition[0]][nextPosition[1]] = 'Box'
			mapCopy[robotPosition[0]][robotPosition[1]] = 'Empty'
			robotPosition = [robotPosition[0] + dx, robotPosition[1] + dy]
			mapCopy[robotPosition[0]][robotPosition[1]] = 'Robot'
		}
	}

	for (const movement of movements) {
		move(movement)
	}

	// printMap(mapCopy)

	for (let row = 1; row < NUM_OF_ROWS - 1; row++) {
		for (let col = 1; col < NUM_OF_COLS - 1; col++) {
			if (mapCopy[row][col] === 'Box') {
				sumOfGPS += 100 * row + col
			}
		}
	}
	console.log('part One: ', sumOfGPS)
}

type PartTwoBoxPosition = [position, position]
function partTwo() {
	let robotPosition = [initialRobotPosition[0], initialRobotPosition[1] * 2]

	function mapContent(c: Content): string {
		switch (c) {
			case 'Wall':
				return '##'
			case 'Empty':
				return '..'
			case 'Box':
				return '[]'
			case 'Robot':
				return '@.'
			default:
				throw new Error('Invalid content')
		}
	}
	const scaledMap = map.map((row) =>
		row
			.map((c) => mapContent(c))
			.join('')
			.split('')
	)

	function moveH(direction: Extract<Direction, 'Left' | 'Right'>) {
		const [dx, dy] = DirectionMap[direction]
		let nextPosition = [robotPosition[0] + dx, robotPosition[1] + dy]
		let foundEmptySpace = false
		let hasBox = false

		while (scaledMap[nextPosition[0]][nextPosition[1]] !== '#') {
			const nextContent = scaledMap[nextPosition[0]][nextPosition[1]]
			if (nextContent === '[' || nextContent == ']') hasBox = true
			else if (nextContent === '.') {
				foundEmptySpace = true
				break
			}
			nextPosition = [nextPosition[0] + dx, nextPosition[1] + 2 * dy]
		}
		if (foundEmptySpace) {
			// empty space is at the nextPosition
			if (hasBox) {
				// next position is the position of the empty space
				/**
				 * From the first empty space, we move in opposite direction to the robot and move the box till we reach the robot position
				 */
				const row = nextPosition[0]
				let col = nextPosition[1]
				while (col - dy !== robotPosition[1]) {
					scaledMap[row][col] = direction == 'Right' ? ']' : '['
					scaledMap[row][col - dy] = direction == 'Right' ? '[' : ']'
					col += -2 * dy
				}
			}
			scaledMap[robotPosition[0]][robotPosition[1]] = '.'
			robotPosition = [robotPosition[0] + dx, robotPosition[1] + dy]
			scaledMap[robotPosition[0]][robotPosition[1]] = '@'
		}
	}

	function moveV(direction: Extract<Direction, 'Up' | 'Down'>) {
		const [dx, dy] = DirectionMap[direction]
		let foundEmptySpace = false
		const boxes: PartTwoBoxPosition[][] = [] // Position of [ and ] which constitites a single box | [[[LeftPosition, RightPosition], [lp, rp], [lp, rp]], [lp, rp], [[lp, rp], [lp, rp]]]
		function reachedWall() {
			if (boxes.length) {
				const topBoxes = boxes[boxes.length - 1]
				for (const box of topBoxes) {
					const [[row, leftEdgeCol], [_, rightEdgeCol]] = box
					if (scaledMap[row + dx][leftEdgeCol] == '#' || scaledMap[row + dx][rightEdgeCol] == '#') {
						return true
					}
				}
			} else {
				const [row, col] = robotPosition
				return scaledMap[row + dx][col] == '#'
			}
		}

		function hasBoxesInNextPath() {
			const nextBoxes: PartTwoBoxPosition[] = []
			if (boxes.length) {
				for (const box of boxes[boxes.length - 1]) {
					const [[row, leftEdgeCol], [_, rightEdgeCol]] = box
					const valueAtLeftEdgeTop = scaledMap[row + dx][leftEdgeCol]
					const valueAtRightEdgeTop = scaledMap[row + dx][rightEdgeCol]

					// if the following is true, then we don't need to worry about box's right edge
					if (valueAtLeftEdgeTop == '[') {
						nextBoxes.push([
							[row + dx, leftEdgeCol],
							[row + dx, leftEdgeCol + 1]
						])
					} else {
						if (valueAtLeftEdgeTop == ']') {
							nextBoxes.push([
								[row + dx, leftEdgeCol - 1],
								[row + dx, leftEdgeCol]
							])
						}
						// For right edge, we only need to worry about a opening Box on top of it
						if (valueAtRightEdgeTop == '[') {
							nextBoxes.push([
								[row + dx, rightEdgeCol],
								[row + dx, rightEdgeCol + 1]
							])
						}
					}
				}
			} else {
				const [row, col] = robotPosition
				const valueAtTop = scaledMap[row + dx][col]
				if (valueAtTop == '[') {
					nextBoxes.push([
						[row + dx, col],
						[row + dx, col + 1]
					])
				} else if (valueAtTop == ']') {
					nextBoxes.push([
						[row + dx, col - 1],
						[row + dx, col]
					])
				}
			}

			if (nextBoxes.length) {
				boxes.push(nextBoxes)
				return true
			}
			return false
		}

		while (!reachedWall()) {
			if (!hasBoxesInNextPath()) {
				// empty space
				foundEmptySpace = true
				break
			}
		}

		if (foundEmptySpace) {
			if (boxes.length) {
				let nextRow = boxes[boxes.length - 1][0][0][0] + dx
				for (let i = boxes.length - 1; i >= 0; i--) {
					const topBoxes = boxes[i]
					for (const box of topBoxes) {
						const [[row, leftEdgeCol], [_, rightEdgeCol]] = box
						scaledMap[nextRow][leftEdgeCol] = '['
						scaledMap[nextRow][rightEdgeCol] = ']'
						scaledMap[row][leftEdgeCol] = '.'
						scaledMap[row][rightEdgeCol] = '.'
					}
					nextRow -= dx
				}
			}
			scaledMap[robotPosition[0]][robotPosition[1]] = '.'
			robotPosition = [robotPosition[0] + dx, robotPosition[1] + dy]
			scaledMap[robotPosition[0]][robotPosition[1]] = '@'
		}
	}

	for (const movement of movements) {
		if (movement == 'Left' || movement == 'Right') moveH(movement)
		else moveV(movement)
	}

	let sumOfGps = 0
	const NUM_OF_EXPANDED_COLS = NUM_OF_COLS * 2

	// scaledMap.forEach((row) => console.log(row.join('')))
	for (let row = 1; row < NUM_OF_ROWS - 1; row++) {
		for (let col = 2; col < NUM_OF_EXPANDED_COLS - 2; col++) {
			if (scaledMap[row][col] === '[') {
				sumOfGps += 100 * row + col
				col += 1
			}
		}
	}

	console.log('Part Two: ', sumOfGps)
}

partOne()
partTwo()
