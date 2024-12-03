import { join } from '@std/path'
import { readInput } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInput(join(dirname, 'data', './input.txt'))

function partOne() {
	console.log(scan())
}

function partTwo() {
	console.log(scan(true))
}

function scan(part2: boolean = false) {
	let cursor = 0
	let checkPoint = 0
	let res = 0
	let mulEnabled = true

	let matches = 0

	while (cursor < input.length) {
		if (input[cursor] == 'm') {
			if (mulEnabled) {
				const mul = scanMul()
				if (mul) {
					matches += 1
					res += mul
				}
			}
		} else if (input[cursor] == 'd') {
			if (part2) {
				setCheckPoint()
				if (scanDont()) {
					mulEnabled = false
				} else {
					resetCursor()
					if (scanDo()) {
						mulEnabled = true
					}
				}
			}
		}
		consume()
	}

	function setCheckPoint() {
		checkPoint = cursor
	}

	function resetCursor() {
		cursor = checkPoint
	}

	function scanDo() {
		const isDo = input.slice(cursor, cursor + 4) == 'do()'
		if (isDo) consume(3)
		return isDo
	}

	function scanDont() {
		const isDont = input.slice(cursor, cursor + 7) == "don't()"
		if (isDont) consume(6)
		return isDont
	}

	function scanMul() {
		const isMul = input.slice(cursor, cursor + 4) == 'mul('

		if (!isMul) {
			return
		}

		consume(3)

		// scan for number
		let firstNum = 0
		let secondNum = 0

		if (isDigit(input[cursor + 1])) {
			consume()
			firstNum = scanDigit()
		} else {
			return
		}

		// Next char must be  ','
		if (input[cursor + 1] != ',') {
			return
		}

		// consume the ','
		consume()

		if (isDigit(input[cursor + 1])) {
			consume()
			secondNum = scanDigit()
		} else {
			return
		}

		// Next char must be  ')'
		if (input[cursor + 1] != ')') {
			return
		}

		// consume the ')'
		consume()
		return firstNum * secondNum
	}

	function consume(num: number = 1) {
		cursor += num
	}

	function isDigit(char: string) {
		return char >= '0' && char <= '9'
	}

	function scanDigit() {
		const start = cursor

		while (isDigit(input[cursor + 1])) {
			consume()
		}

		return parseInt(input.slice(start, cursor + 1))
	}

	return res
}

partOne()
partTwo()
