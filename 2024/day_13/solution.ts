import { join } from '@std/path/join'
import { readInput } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

type Coordinates = [number, number]

const input = readInput(join(dirname, 'data', './input.txt'))
const machines: Coordinates[][] = (function () {
	const rawMachines = input.split('\r\n\r\n').map(
		(m) =>
			m
				.split('\r\n')
				.map((l) => l.split(':')[1].trim())
				.map((l) => l.split(',').map((i) => parseInt(i.split(/[+=]/)[1]))) as Coordinates[]
	)
	return rawMachines
})()

/**
 * The story forms a problem of System of Linear Equation
 * Solved using Cramer's rule
 *
 * For part two, the constant(the Prize coordinate) is updated to a very large value
 */

function partOne() {
	let numberOfTokens = 0
	for (const machine of machines) {
		const [a1, a2] = machine[0]
		const [b1, b2] = machine[1]
		const [c1, c2] = machine[2]

		const buttonAMoves = (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1)
		const buttonBMoves = (a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1)

		if (Number.isInteger(buttonAMoves) && Number.isInteger(buttonBMoves)) {
			numberOfTokens += buttonAMoves * 3 + buttonBMoves
		}
	}
	console.log(numberOfTokens)
}

function partTwo() {
	const prizeCoordinateOffsetConversion = 10000000000000
	let numberOfTokens = 0
	for (const machine of machines) {
		const [a1, a2] = machine[0]
		const [b1, b2] = machine[1]
		const [c1, c2] = machine[2].map((i) => i + prizeCoordinateOffsetConversion)

		const buttonAMoves = (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1)
		const buttonBMoves = (a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1)

		if (Number.isInteger(buttonAMoves) && Number.isInteger(buttonBMoves)) {
			numberOfTokens += buttonAMoves * 3 + buttonBMoves
		}
	}
	console.log(numberOfTokens)
}

partOne()
partTwo()
