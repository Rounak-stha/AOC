import { join } from '@std/path/join'
import { readInputLines } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInputLines(join(dirname, 'data', './input.txt'))

/**
 * rules: Map<number, Set<number>> : For each key, the key must be printed before the values
 * updates: number[][]
 */
const [rules, updates] = (function () {
	const rules = new Map<number, Set<number>>()
	const updates: number[][] = []

	let reachedUpdatesSection = false

	for (const line of input) {
		if (reachedUpdatesSection) {
			updates.push(line.split(',').map((num) => parseInt(num) as number))
		} else {
			if (line) {
				const [before, after] = line.split('|').map((num) => parseInt(num)) as [number, number]
				if (rules.has(before)) {
					rules.get(before)!.add(after)
				} else {
					rules.set(before, new Set([after]))
				}
			} else reachedUpdatesSection = true
		}
	}

	return [rules, updates]
})()

const incorrectUpdates: number[][] = []

function partOne() {
	let sum = 0

	for (const update of updates) {
		let isValid = true
		outer_loop: for (let i = 0; i < update.length - 1; i++) {
			for (let j = i + 1; j < update.length; j++) {
				if (rules.get(update[j])?.has(update[i])) {
					isValid = false
					incorrectUpdates.push(update)
					break outer_loop
				}
			}
		}
		if (isValid) sum += update[Math.floor(update.length / 2)]
	}
	console.log('Part one: ', sum)
}

function partTwo() {
	/**
	 * ALGORITHM
	 * For each update
	 * 		For each number in the update
	 * 			Check if all subsequent numbers should be printed after the current number according to the rule
	 * 			if not swap them
	 * 			do this until the current number is in the correct position
	 * 			follow this for all remaining numbers
	 * 		Increment the sum by the middle number
	 *
	 */
	let sum = 0
	for (const update of incorrectUpdates) {
		let index = 0
		while (index < update.length) {
			let isValid = true
			for (let i = index + 1; i < update.length; i++) {
				if (rules.get(update[i])?.has(update[index])) {
					// swap
					;[update[index], update[i]] = [update[i], update[index]]
					isValid = false
					break
				}
			}
			if (isValid) index += 1
		}
		sum += update[Math.floor(update.length / 2)]
	}
	console.log('Part two: ', sum)
}
partOne()
partTwo()
