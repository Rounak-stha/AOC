import { join } from '@std/path/join'
import { readInputLines } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInputLines(join(dirname, 'data', './input.txt'))
const map = input.map((i) => i.split(''))

const NUM_OF_ROWS = map.length
const NUM_OF_COLS = map[0].length

const DIRECIONS = [
	[-1, 0], // up
	[0, 1], // right
	[1, 0], // down
	[0, -1] // left
]

type DirectionString = '-1_0' | '0_1' | '1_0' | '0_-1'
type Directions = 'up' | 'right' | 'down' | 'left'

const DIRECIONS_NAME: Record<DirectionString, Directions> = {
	'-1_0': 'up',
	'0_1': 'right',
	'1_0': 'down',
	'0_-1': 'left'
}

type Cell = [number, number]
type Meta = { sides: { up: { num: number; cell: Cell[] }; right: { num: number; cell: Cell[] } }; area: number }

function isOutOfBounds(row: number, col: number) {
	return row < 0 || row >= NUM_OF_ROWS || col < 0 || col >= NUM_OF_COLS
}

/**
 * Go through every neighbour cell and check if it is of same type
 * If not then its a perimeter
 *
 * For part two, we need to keep track of sides
 * The logic is almost as same as the perimeter with extra calculations
 * If the neighbour cell is not of same type then it forms a part of the side
 * We keep track of the directions
 * In a plane (2 x 2 grid), we honly have 2 directions that consitiutes a side
 * So if **continous** perimeters are on the same direction the they form a side
 * 	If there's gap then it forms a new side
 * To define the boundary, we take the average of the two cells that form the side
 * For example,
 * AAABAAA For 0 indexed array, there are2 boundaries between 2nd and 3rd cell and 3rd and 4th cell
 * SO the boundary is at 2.5 and 3.5
 * BUT we also have acse when there's a diffreent type inside the boundary of of the current tracking type
 * For eample:
 * AAA.AAA
 *  AAA|BBA
 *  AAA|BBA
 *  ABB|AAA
 *  ABB|AAA
 *  AAA.AAA
 *
 * The 4 continous verticle perimeters (|) must form 2 sides
 * One for the upper square B block and one for the lower square B block
 *
 * To address this, we also need to track direction that the boundary separates the sides from
 * For example, for the upper block, type A is on the left and type B is on the right
 * But for the bottom block, type A is on the right and type B is on the left
 *
 * Ro address this, just add a small consistent offset to the boundary
 * Fro example, if the boundary is on the right side of the type add 0.1 and vice versa
 * Do the same for up and down directions
 */

function partOne() {
	const visited: Set<string> = new Set() // key = row_col
	let price = 0

	function visit(row: number, col: number, meta: { perimeter: number; area: number }) {
		const key = `${row}_${col}`
		if (visited.has(key)) return
		visited.add(key)

		meta.area += 1

		const currentVal = map[row][col]

		for (const [rowOffset, colOffset] of DIRECIONS) {
			const newRow = row + rowOffset
			const newCol = col + colOffset

			if (isOutOfBounds(newRow, newCol)) {
				meta.perimeter += 1
				continue
			}

			const nextVal = map[newRow][newCol]

			if (currentVal == nextVal) {
				if (visited.has(`${newRow}_${newCol}`)) continue
				visit(newRow, newCol, meta)
			} else {
				meta.perimeter += 1
			}
		}
	}

	for (let row = 0; row < NUM_OF_ROWS; row++) {
		for (let col = 0; col < NUM_OF_COLS; col++) {
			const key = `${row}_${col}`
			if (!visited.has(key)) {
				const meta = { perimeter: 0, area: 0 }
				visit(row, col, meta)
				price += meta.area * meta.perimeter
			}
		}
	}

	console.log('Part one', price)
}

function partTwo() {
	const visited: Set<string> = new Set() // key = row_col
	let price = 0

	function visit(row: number, col: number, meta: Meta) {
		const key = `${row}_${col}`
		if (visited.has(key)) return
		visited.add(key)

		meta.area += 1

		const currentVal = map[row][col]

		for (const [rowOffset, colOffset] of DIRECIONS) {
			const newRow = row + rowOffset
			const newCol = col + colOffset
			const directionStr = `${rowOffset}_${colOffset}` as DirectionString
			const direction = DIRECIONS_NAME[directionStr]

			const sideRow = (row + newRow) / 2
			const sideCol = (col + newCol) / 2

			if (isOutOfBounds(newRow, newCol)) {
				if (direction == 'up' || direction == 'down') {
					meta.sides['right'].num += 1
					const updatedSideRow = direction == 'up' ? sideRow + 0.1 : sideRow - 0.1
					meta.sides['right'].cell.push([updatedSideRow, col])
				} else {
					meta.sides['up'].num += 1
					const updatedSideCol = direction == 'left' ? sideCol + 0.1 : sideCol - 0.1
					meta.sides['up'].cell.push([row, updatedSideCol])
				}
				continue
			}

			const nextVal = map[newRow][newCol]

			if (currentVal == nextVal) {
				if (visited.has(`${newRow}_${newCol}`)) continue
				visit(newRow, newCol, meta)
			} else {
				if (direction == 'up' || direction == 'down') {
					meta.sides['right'].num += 1
					const updatedSideRow = direction == 'up' ? sideRow + 0.1 : sideRow - 0.1
					meta.sides['right'].cell.push([updatedSideRow, col])
				} else {
					meta.sides['up'].num += 1
					const updatedSideCol = direction == 'left' ? sideCol + 0.1 : sideCol - 0.1
					meta.sides['up'].cell.push([row, updatedSideCol])
				}
			}
		}
	}

	for (let row = 0; row < NUM_OF_ROWS; row++) {
		for (let col = 0; col < NUM_OF_COLS; col++) {
			const key = `${row}_${col}`
			if (!visited.has(key)) {
				let sides = 0
				const meta: Meta = { area: 0, sides: { up: { cell: [], num: 0 }, right: { num: 0, cell: [] } } }
				visit(row, col, meta)

				const area = meta.area

				/**
				 * Differnt column = different side
				 * same continous column = same side
				 * discontinuation on same column means new side
				 */

				// sort by columns
				const groupedCols = Object.values(
					meta.sides.up.cell.reduce<Record<number, Set<string>>>((a, c) => {
						if (!a[c[1]]) a[c[1]] = new Set([`${c[0]}_${c[1]}`])
						else a[c[1]].add(`${c[0]}_${c[1]}`)
						return a
					}, {})
				)
				const sortedGroupedCols: Cell[][] = []

				groupedCols.forEach((col) => {
					const temp = (Array.from(col).map((v) => v.split('_').map((n) => parseFloat(n))) as Cell[]).sort(
						(a, b) => a[0] - b[0]
					)
					sortedGroupedCols.push(temp)
				})

				sortedGroupedCols.forEach((col) => {
					sides += 1
					for (let i = 1; i < col.length; i++) {
						const prevRow = col[i - 1][0]
						const currentRow = col[i][0]
						if (Math.abs(currentRow - prevRow) > 1) {
							sides += 1
						}
					}
				})

				const groupedRows = Object.values(
					meta.sides.right.cell.reduce<Record<number, Set<string>>>((a, c) => {
						if (!a[c[0]]) a[c[0]] = new Set([`${c[0]}_${c[1]}`])
						else a[c[0]].add(`${c[0]}_${c[1]}`)
						return a
					}, {})
				)
				const sortedGroupedRows: Cell[][] = []

				groupedRows.forEach((row) => {
					const temp = (Array.from(row).map((v) => v.split('_').map((n) => parseFloat(n))) as Cell[]).sort(
						(a, b) => a[1] - b[1]
					)
					sortedGroupedRows.push(temp)
				})

				sortedGroupedRows.forEach((row) => {
					sides += 1
					for (let i = 1; i < row.length; i++) {
						const prevCol = row[i - 1][1]
						const currentCol = row[i][1]
						if (Math.abs(currentCol - prevCol) > 1) {
							sides += 1
						}
					}
				})

				// console.log({ currentVal: map[row][col], area, sides })
				price += area * sides
			}
		}
	}

	console.log('Part one', price)
}

partOne()
partTwo()
