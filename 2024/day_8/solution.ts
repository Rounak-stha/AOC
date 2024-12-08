import { join } from '@std/path/join'
import { readInputLines } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInputLines(join(dirname, 'data', './input.txt'))
const map: string[][] = input.map((line) => line.split(''))

const NUM_OF_ROWS = map.length
const NUM_OF_COLS = map[0].length

type Position = [number, number]

function isOutOfBounds(position: Position) {
	return position[0] < 0 || position[0] >= NUM_OF_ROWS || position[1] < 0 || position[1] >= NUM_OF_COLS
}

function scaleTwice(positionA: Position, positionB: Position): Position {
	return [positionB[0] + (positionB[0] - positionA[0]), positionB[1] + (positionB[1] - positionA[1])] as Position
}

/** ALGORITHM:
 * Basically a vector scaling problem
 */

const distinctAntennasPositions = new Map<string, Set<string>>() // Antenna_Name -> Set of positions(row_col)

function partOne() {
	const antinodePositions = new Set<string>() // row_col

	for (let row = 0; row < NUM_OF_ROWS; row++) {
		for (let col = 0; col < NUM_OF_COLS; col++) {
			if (map[row][col] != '.') {
				const currAntennaName = map[row][col]
				if (distinctAntennasPositions.has(currAntennaName)) {
					distinctAntennasPositions.get(currAntennaName)!.add(`${row}_${col}`)
				} else {
					distinctAntennasPositions.set(currAntennaName, new Set([`${row}_${col}`]))
				}
			}
		}
	}

	// for each antenna, check if there's an antinode
	// each antenna pair are always in a straight line, so they will always have a antinode but we need to check if it is i the given bounds
	// to do this, calculate the row and col vector difference between the two antennas and perform vector addition / subtraction in

	for (const p of distinctAntennasPositions.values()) {
		const positions = Array.from(p)
		for (let i = 0; i < positions.length - 1; i++) {
			const antennaOne = positions[i].split('_').map((n) => parseInt(n)) as Position
			for (let j = i + 1; j < positions.length; j++) {
				const antennaTwo = positions[j].split('_').map((n) => parseInt(n)) as Position
				const newPositionExtendingFromAntennaOne = scaleTwice(antennaTwo, antennaOne)
				const newPositionExtendingFromAntennaTwo = scaleTwice(antennaOne, antennaTwo)

				if (!isOutOfBounds(newPositionExtendingFromAntennaOne))
					antinodePositions.add(
						`${newPositionExtendingFromAntennaOne[0]}_${newPositionExtendingFromAntennaOne[1]}`
					)
				if (!isOutOfBounds(newPositionExtendingFromAntennaTwo))
					antinodePositions.add(
						`${newPositionExtendingFromAntennaTwo[0]}_${newPositionExtendingFromAntennaTwo[1]}`
					)
			}
		}
	}

	console.log('Part one: ', antinodePositions.size)
}

function partTwo() {
	const antinodePositions = new Set<string>() // row_col

	for (const p of distinctAntennasPositions.values()) {
		const positions = Array.from(p)
		for (let i = 0; i < positions.length - 1; i++) {
			const antennaOne = positions[i].split('_').map((n) => parseInt(n)) as Position
			for (let j = i + 1; j < positions.length; j++) {
				const antennaTwo = positions[j].split('_').map((n) => parseInt(n)) as Position

				antinodePositions.add(`${antennaOne[0]}_${antennaOne[1]}`)
				antinodePositions.add(`${antennaTwo[0]}_${antennaTwo[1]}`)

				let possibleAntinodePosition: Position

				let antennaOneCopy: Position = [...antennaOne]
				let antennaTwoCopy: Position = [...antennaTwo]
				let temp: Position

				while (!isOutOfBounds((possibleAntinodePosition = scaleTwice(antennaTwoCopy, antennaOneCopy)))) {
					antinodePositions.add(`${possibleAntinodePosition[0]}_${possibleAntinodePosition[1]}`)
					temp = antennaOneCopy
					antennaOneCopy = possibleAntinodePosition
					antennaTwoCopy = temp
				}

				antennaOneCopy = [...antennaOne]
				antennaTwoCopy = [...antennaTwo]

				while (!isOutOfBounds((possibleAntinodePosition = scaleTwice(antennaOneCopy, antennaTwoCopy)))) {
					antinodePositions.add(`${possibleAntinodePosition[0]}_${possibleAntinodePosition[1]}`)
					temp = antennaTwoCopy
					antennaTwoCopy = possibleAntinodePosition
					antennaOneCopy = temp
				}
			}
		}
	}

	console.log('Part two: ', antinodePositions.size)
}

partOne()
partTwo()
