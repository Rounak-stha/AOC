import { join } from '@std/path/join'
import { readInput } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInput(join(dirname, 'data', './input.txt'))

const [AvailablePatterns, DesigredDesigns] = input
	.split(/\r?\n\r?\n/)
	.map((s, i) => (i == 0 ? s.split(',').map((d) => d.trim()) : s.split(/\r?\n/)))

// Tried iterative appraoch on my own first
// It worked for the test case (the example data)
// but did not work for the actual input

/* function partOne() {
	let numberOfPossibleDesigns = 0
	for (const design of DesigredDesigns) {
		let start = 0
		let end = 1

		let lastFoundIndex = null

		while (start < design.length) {
			const pattern = design.slice(start, end)
			if (AvailablePatterns.includes(pattern)) {
				lastFoundIndex = end
			}
			if (end == design.length) {
				if (lastFoundIndex) {
					if (lastFoundIndex == end) {
						console.log('Found a design: ', design)
						numberOfPossibleDesigns++
					}
					start = lastFoundIndex
					end = start + 1
					lastFoundIndex = null
				} else break
			} else end++
		}
	}
	console.log('Part one: ', numberOfPossibleDesigns)
} */

// Took help from here
// https://www.youtube.com/watch?v=yd1FqnAUFL4
function partOne() {
	let numberOfPossibleDesigns = 0

	function canObtain(design: string, cache = new Map<string, boolean>()): boolean {
		if (design == '') return true
		if (cache.has(design)) return cache.get(design)!
		for (let i = 0; i < design.length; i++) {
			const pattern = design.slice(0, i + 1)
			if (AvailablePatterns.includes(pattern)) {
				const rest = design.slice(i + 1)
				if (canObtain(rest, cache)) {
					cache.set(rest, true)
					return true
				} else {
					cache.set(rest, false)
				}
			}
		}
		return false
	}

	for (const design of DesigredDesigns) {
		if (canObtain(design, new Map())) numberOfPossibleDesigns++
	}
	console.log('Part one: ', numberOfPossibleDesigns)
}

function partTwo() {
	let numberOfPossibleCombinations = 0

	function numOfPossibilities(design: string, cache = new Map<string, number>()) {
		if (design == '') return 1
		let count = 0

		if (cache.has(design)) return cache.get(design)!

		for (let i = 0; i < design.length; i++) {
			const pattern = design.slice(0, i + 1)
			if (AvailablePatterns.includes(pattern)) {
				const rest = design.slice(i + 1)
				const possibilities = numOfPossibilities(rest, cache)
				cache.set(rest, possibilities)
				count += possibilities
			}
		}
		return count
	}

	for (const design of DesigredDesigns) {
		numberOfPossibleCombinations += numOfPossibilities(design, new Map())
	}
	console.log('Part one: ', numberOfPossibleCombinations)
}

partOne()
partTwo()
