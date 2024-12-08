import { join } from '@std/path/join'
import { readInputLines } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInputLines(join(dirname, 'data', './input.txt'))
const parsedInput: [number, number[]][] = input.map((line) => {
	const [testValue, nums] = line.split(':').map((n) => n.trim())
	return [parseInt(testValue), nums.split(' ').map((n) => parseInt(n))]
})

function add(a: number, b: number) {
	return a + b
}

function multiply(a: number, b: number) {
	return a * b
}

function concat(a: number, b: number) {
	return parseInt(`${a}${b}`)
}

/** ALGORITHM:
 * Brute force
 * First we need to find all possible operator combinations
 * Before that we need to know the number of operations for current test and how many combinations are possible
 * For n operands, there are (n - 1) operators and k^(n - 1) combinations,where k is the number of operators
 * This works because for k number of perator, there'll be k number of operator option in each position
 * 	and representing each number of combinations as the number in bae k, ill gve us all possible combinations where we can correspond each number to an operator
 * We can represent each combination as a binary number and convert it to a string
 */

function partOne() {
	let sum = 0

	for (const [testValue, nums] of parsedInput) {
		const numOfOPerators = nums.length - 1
		const numOfPossibledOPeratorCobinations = Math.pow(2, numOfOPerators)
		const allOPeratorCombinations = []

		for (let i = 0; i < numOfPossibledOPeratorCobinations; i++) {
			const currCombination = i
				.toString(2)
				.padStart(numOfOPerators, '0')
				.split('')
				.map((n) => (n == '0' ? '+' : '*'))
			allOPeratorCombinations.push(currCombination)
		}

		for (const currOperatorCombination of allOPeratorCombinations) {
			let currRes = nums[0]
			for (let i = 1; i < nums.length; i++) {
				const currOperator = currOperatorCombination[i - 1]
				if (currOperator == '+') {
					currRes = add(currRes, nums[i])
				} else {
					currRes = multiply(currRes, nums[i])
				}
			}
			if (currRes == testValue) {
				sum += testValue
				break
			}
		}
	}
	console.log('Part One:', sum)
}

function partTwo() {
	let sum = 0

	for (const [testValue, nums] of parsedInput) {
		const numOfOPerators = nums.length - 1
		const numOfPossibledOPeratorCobinations = Math.pow(3, numOfOPerators)
		const allOPeratorCombinations = []

		for (let i = 0; i < numOfPossibledOPeratorCobinations; i++) {
			const currCombination = i
				.toString(3)
				.padStart(numOfOPerators, '0')
				.split('')
				.map((n) => {
					switch (n) {
						case '0':
							return '+'
						case '1':
							return '*'
						case '2':
							return '||'
					}
				})
			allOPeratorCombinations.push(currCombination)
		}

		for (const currOperatorCombination of allOPeratorCombinations) {
			let currRes = nums[0]
			for (let i = 1; i < nums.length; i++) {
				const currOperator = currOperatorCombination[i - 1]
				if (currOperator == '+') {
					currRes = add(currRes, nums[i])
				} else if (currOperator == '*') {
					currRes = multiply(currRes, nums[i])
				} else if (currOperator == '||') {
					currRes = concat(currRes, nums[i])
				}
			}
			if (currRes == testValue) {
				sum += testValue
				break
			}
		}
	}
	console.log('Part two:', sum)
}

partOne()
partTwo()
