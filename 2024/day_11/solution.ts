import { join } from '@std/path/join'
import { readInputLines } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInputLines(join(dirname, 'data', './input.txt'))

const initialStones = input[0].split(' ').map((i) => parseInt(i))

/**
 * I had to take help from the internet to solve this problem. Thought I could come up with a recursive solution by my own but I was wrong.
 * https://www.youtube.com/watch?v=pVfsmQSlVOQ
 *
 * Part one ues bruteforce iterative approach and works for 25 blinks but the number of stones grows exponentially and it's not feasible to calculate for 75 blinks
 * Part two uses a recursive approach with memoization to calculate the number of stones after 75 blinks
 * We memoize the number of stones after X blinks for a stone with number Y
 * So for the initial firt stone, we do all the calculation, but for subsequent stones, if we have STone Y for Bibk X, e return the memoized value, or do the calculation and memoize it
 */

const PART_ONE_BLINKS = 25
const PART_TWO_BLINKS = 75

function partOne() {
	let stones = [...initialStones]
	for (let blink = 0; blink < PART_ONE_BLINKS; blink++) {
		const newStones = []
		for (const stone of stones) {
			if (stone == 0) {
				newStones.push(1)
				continue
			}
			const stoneStr = String(stone)
			const stoneLength = stoneStr.length

			if (stoneLength % 2 == 0) {
				newStones.push(Number(stoneStr.slice(0, stoneLength / 2)), Number(stoneStr.slice(stoneLength / 2)))
			} else {
				newStones.push(stone * 2024)
			}
		}
		stones = newStones
	}

	console.log('Part one', stones.length)
}

function partTwo() {
	const stones = [...initialStones]
	const cache: Map<string, number> = new Map() // key = number_blink
	let count = 0

	function recurse(stone: number, blink: number): number {
		const key = `${stone}_${blink}`
		let count = 0

		if (cache.has(key)) return cache.get(key)!
		if (blink == PART_TWO_BLINKS) return 1

		const stoneStr = String(stone)
		const stoneLength = stoneStr.length

		if (stone == 0) return recurse(1, blink + 1)
		else if (stoneLength % 2 == 0) {
			count =
				recurse(Number(stoneStr.slice(0, stoneLength / 2)), blink + 1) +
				recurse(Number(stoneStr.slice(stoneLength / 2)), blink + 1)
		} else {
			count = recurse(stone * 2024, blink + 1)
		}
		cache.set(key, count)
		return count
	}

	for (const stone of stones) {
		count += recurse(stone, 0)
	}

	console.log('Part two', count)
}

partOne()
partTwo()
