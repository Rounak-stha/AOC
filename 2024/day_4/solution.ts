import { join } from '@std/path/join'
import { readInputLines } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInputLines(join(dirname, 'data', './input.txt'))

const matrix = input.map((line) => line.split('')) // 140 x 140 (For the given input)

// we need to find the word XMAS either horizontally, vertically or digonally and the word can be spelled backwards

const DIRECTIONS: Record<string, [number, number]> = {
	RIGHt: [0, 1],
	LEFT: [0, -1],
	DOWN: [1, 0],
	UP: [-1, 0],
	RIGHT_DIAGONAL_UP: [-1, 1],
	RIGHT_DIAGONAL_DOWN: [1, 1],
	LEFT_DIAGONAL_UP: [-1, -1],
	LEFT_DIAGONAL_DOWN: [1, -1]
}

const ALL_DIRECTIONS = Object.values(DIRECTIONS)

const word = 'XMAS'
const NUM_OF_ROWS = matrix.length
const NUM_OF_COLS = matrix[0].length

function isOutOfBounds(row: number, column: number) {
	return row < 0 || row >= NUM_OF_ROWS || column < 0 || column >= NUM_OF_COLS
}

function partOne() {
	let count = 0

	for (let row = 0; row < matrix.length; row++) {
		for (let column = 0; column < matrix[row].length; column++) {
			const currentLetter = matrix[row][column]
			if (currentLetter === 'X') {
				for (const [rowPrime, colPrime] of ALL_DIRECTIONS) {
					let isValidDirection = true

					for (let i = 1; i < 4; i++) {
						const nextRow = row + rowPrime * i
						const nextColumn = column + colPrime * i

						if (isOutOfBounds(nextRow, nextColumn)) {
							isValidDirection = false
							break
						}
						const letter = matrix[row + rowPrime * i][column + colPrime * i]
						if (letter != word[i]) {
							isValidDirection = false
							break
						}
					}

					if (isValidDirection) {
						count += 1
					}
				}
			}
		}
	}
	console.log('Part one: ', count)
}

function checkRightBottomDiagonal(row: number, column: number) {
	if (isOutOfBounds(row, column)) return false
	const currentLetter = matrix[row][column]
	let word = currentLetter
	const expected = ['MAS', 'SAM']
	if (currentLetter == 'M' || currentLetter == 'S') {
		const direction = DIRECTIONS['RIGHT_DIAGONAL_DOWN']
		for (let i = 1; i < 3; i++) {
			const nextRow = row + direction[0] * i
			const nextColumn = column + direction[1] * i

			if (isOutOfBounds(nextRow, nextColumn)) {
				return false
			}

			word += matrix[nextRow][nextColumn]
		}
		if (expected.includes(word)) {
			return true
		}
	}
	return false
}

function checkRightTopDiagonal(row: number, column: number) {
	if (isOutOfBounds(row, column)) return false
	const currentLetter = matrix[row][column]
	let word = currentLetter
	const expected = ['MAS', 'SAM']
	if (currentLetter == 'M' || currentLetter == 'S') {
		const direction = DIRECTIONS['RIGHT_DIAGONAL_UP']
		for (let i = 1; i < 3; i++) {
			const nextRow = row + direction[0] * i
			const nextColumn = column + direction[1] * i

			if (isOutOfBounds(nextRow, nextColumn)) {
				return false
			}

			word += matrix[nextRow][nextColumn]
		}
		if (expected.includes(word)) {
			return true
		}
	}
	return false
}

function partTwo() {
	let count = 0

	for (let row = 0; row < matrix.length; row++) {
		for (let column = 0; column < matrix[row].length; column++) {
			if (checkRightBottomDiagonal(row, column) && checkRightTopDiagonal(row + 2, column)) {
				count += 1
			}
		}
	}
	console.log('Part two:', count)
}

partOne()
partTwo()
