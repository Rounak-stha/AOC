import { join } from '@std/path/join'
import { readInput } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

type Width = number
type Height = number
type Position = [number, number]
type Velocity = Position

const gridSize: [Width, Height] = [101, 103]
const origin = gridSize.map((s) => Math.floor(s / 2))

// 101, 103

const input = readInput(join(dirname, 'data', './input.txt'))
const robots: [Position, Velocity][] = (function () {
	const rawMachines = input.split('\r\n').map(
		(m) =>
			m
				.split(' ')
				.map((l) => l.split('=')[1].trim())
				.map((l) => l.split(',').map((i) => parseInt(i))) as [Position, Velocity]
	)
	return rawMachines
})()

function isOnAxes(position: Position) {
	return position[0] === origin[0] || position[1] === origin[1]
}

function findQuadrantForPosition(position: Position) {
	if (position[0] < origin[0] && position[1] < origin[1]) return 1
	else if (position[0] > origin[0] && position[1] < origin[1]) return 2
	else if (position[0] < origin[0] && position[1] > origin[1]) return 3
	else if (position[0] > origin[0] && position[1] > origin[1]) return 4
	throw new Error('Invalid position')
}

function normalizeZero(num: number) {
	return num === 0 ? 0 : num
}

function normalizePosition(position: Position): Position {
	let [x, y] = position.map((p, i) => normalizeZero(p % gridSize[i]))
	if (x < 0) x = gridSize[0] + x
	if (y < 0) y = gridSize[1] + y
	return [x, y]
}

/**
 * Ahh..! The laws of motion
 */
function partOne() {
	const NUMBER_OF_SECONDS = 100

	/**
	 * 	1  |  2
	 * ---------
	 * 	3  |  4
	 *
	 */
	const quadrantAndNumOfRobots = {
		1: 0,
		2: 0,
		3: 0,
		4: 0
	}

	for (const robot of robots) {
		const [initialPosition, velocity] = robot
		const finalPosition = normalizePosition(
			initialPosition.map((p, i) => p + velocity[i] * NUMBER_OF_SECONDS) as Position
		)

		if (!isOnAxes(finalPosition)) {
			const quadrant = findQuadrantForPosition(finalPosition)
			quadrantAndNumOfRobots[quadrant]++
		}
	}

	console.log(
		'Part one: ',
		Object.values(quadrantAndNumOfRobots).reduce((a, c) => a * c, 1)
	)
}

/**
 * https://www.youtube.com/watch?v=ySUUTxVv31U
 * 100% cheated on this one
 * I don't get what the problem actually wants
 * It says that the robots will form a Christmas tree at a point
 * but what's the shape of it?
 * I mean we can't just speculate it either as the question has already one assumption that will result in an answer it expects
 * The solution in the video itself is not absolute
 *
 * The proposed solution is to find the number of second at which the safety factor will be minimal
 * So lets do that
 */
function partTwo() {
	const minimumSafety = {
		seconds: Infinity,
		factor: Infinity
	}
	const NUMBER_OF_SECONDS = gridSize[0] * gridSize[1]
	const robotsCopy = [...robots]

	for (let i = 1; i <= NUMBER_OF_SECONDS; i++) {
		/**
		 * 	1  |  2
		 * ---------
		 * 	3  |  4
		 *
		 */
		const quadrantAndNumOfRobots = {
			1: 0,
			2: 0,
			3: 0,
			4: 0
		}

		for (let j = 0; j < robotsCopy.length; j++) {
			const [initialPosition, velocity] = robotsCopy[j]
			const finalPosition = normalizePosition(initialPosition.map((p, i) => p + velocity[i]) as Position)

			if (!isOnAxes(finalPosition)) {
				const quadrant = findQuadrantForPosition(finalPosition)
				quadrantAndNumOfRobots[quadrant]++
			}

			robotsCopy[j][0] = finalPosition
		}
		const safetyFactor = Object.values(quadrantAndNumOfRobots).reduce((a, c) => a * c, 1)

		if (safetyFactor < minimumSafety.factor) {
			minimumSafety.factor = safetyFactor
			minimumSafety.seconds = i
		}
	}
	console.log('Part two: ', minimumSafety.seconds)
}

partOne()
partTwo()
