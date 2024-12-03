import { join } from '@std/path'
import { readInputLines } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInputLines(join(dirname, 'data', './input.txt'))

const left = new Array(input.length)
const right = new Array(input.length)

function partOne() {
	input.forEach((line, i) => {
		const [l, r] = line.split('   ')
		left[i] = l
		right[i] = r
	})

	left.sort()
	right.sort()

	let totalDistance = 0

	for (let i = 0; i < left.length; i++) {
		const l = left[i]
		const r = right[i]
		totalDistance += Math.abs(l - r)
	}
	console.log('totalDistance: ', totalDistance)
}

function partTwo() {
	// create frequency map
	const rightFreq = new Map()

	let similarity = 0

	for (let i = 0; i < left.length; i++) {
		rightFreq.set(right[i], (rightFreq.get(right[i]) || 0) + 1)
	}

	// for each number in left
	for (const leftNum of left) {
		const freq = rightFreq.get(leftNum) || 0
		similarity += parseInt(leftNum) * freq
	}

	console.log('similarity: ', similarity)
}

partOne()
partTwo()
