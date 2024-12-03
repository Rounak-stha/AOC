import { join } from '@std/path'
import { readInputLines } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInputLines(join(dirname, 'data', './input.txt'))

const unsafeLevelsFromPartOne: number[][] = []

let safeCountFromPartOne = 0
let safeCountAfterSingleJump = 0

function isPairSafe(pair: [number, number], increasing: boolean): boolean {
	const diff = Math.abs(pair[1] - pair[0])
	if (increasing) return pair[1] > pair[0] && diff <= 3
	return pair[1] < pair[0] && diff <= 3
}

const report = input.map((line) => line.split(' ').map((l) => parseInt(l)))

function partOne() {
	for (const levels of report) {
		if (checkSingleInput(levels)) safeCountFromPartOne += 1
	}

	console.log('Part One Safe Count', safeCountFromPartOne)
}

function checkSingleInput(levels: number[]): boolean {
	let isSafe = true

	// check if the levels are strictly increasing or decreasing
	let increasing = true

	if (levels[1] < levels[0]) {
		increasing = false
	}

	for (let i = 0; i < levels.length - 1; i++) {
		if (!isPairSafe([levels[i], levels[i + 1]], increasing)) {
			isSafe = false
			unsafeLevelsFromPartOne.push(levels)
			break
		}
	}

	return isSafe
}

/**
 * DO NOT USE THIS
 * This method does not account for the first level, it assumes that the first level is safe
 * Thus this edge case is not covered
 */
function checkIfLevelsSafe(levels: number[], alreadySkipped: boolean = false): boolean {
	const diff = Math.abs(levels[0] - levels[1])
	if (diff == 0 || diff > 3) {
		return false
	}

	// check if the levels are strictly increasing or decreasing
	let increasing = true

	if (levels[1] < levels[0]) {
		increasing = false
	}

	for (let i = 0; i < levels.length - 1; i++) {
		const safe = isPairSafe([levels[i], levels[i + 1]], increasing)
		if (!safe) {
			if (alreadySkipped) {
				return false
			}
			const sliceA = [...levels]
			const sliceB = [...levels]

			sliceA.splice(i, 1)
			sliceB.splice(i + 1, 1)

			return checkIfLevelsSafe(sliceA, true) || checkIfLevelsSafe(sliceB, true)
		}
	}

	return true
}

function partTwo() {
	for (const levels of report) {
		if (checkSingleInput(levels)) {
			safeCountAfterSingleJump += 1
		} else {
			for (let i = 0; i < levels.length; i++) {
				if (checkSingleInput(levels.toSpliced(i, 1))) {
					safeCountAfterSingleJump += 1
					break
				}
			}
		}
	}
	console.log('Part Two Safe Count', safeCountAfterSingleJump)
}

partOne()
partTwo()
