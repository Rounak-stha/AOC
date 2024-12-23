import { join } from '@std/path/join'
import { readInputLines } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

type Position = [number, number]

const input = readInputLines(join(dirname, 'data', './input.txt'))

let StartPosition: Position = [0, 0]

const map = input.map((line, row) =>
	line.split('').map((char, col) => {
		if (char == 'S') StartPosition = [row, col]
		return char
	})
)

function printMap(map: string[][]) {
	map.forEach((row) => console.log(row.join('')))
}

const directions: Position[] = [
	[0, 1], // right
	[1, 0], // down
	[0, -1], // left
	[-1, 0] // up
]

// printMap(map)

function isOutOfBounds(position: Position): boolean {
	return position[0] < 0 || position[1] < 0 || position[0] >= map.length || position[1] >= map[0].length
}

const trackAndTime: Map<string, number> = new Map()
trackAndTime.set(`${StartPosition[0]}_${StartPosition[1]}`, 0)
const start = { position: StartPosition, time: 0 }
const tracks = [start]

let numberOfSkipsForTwoSkips = 0

function partOne() {
	const visited = new Set<string>()

	// First Iterate through the current tracks to find the time it takes to reach each track point
	// NOTE: There's only one possible track
	outer: while (true) {
		const { position: currentPosition, time } = tracks[tracks.length - 1]
		for (const direction of directions) {
			const [dx, dy] = direction
			const [x, y] = [currentPosition[0] + dx, currentPosition[1] + dy]
			const key = `${x}_${y}`

			if (visited.has(key)) continue
			visited.add(key)

			if (map[x][y] == 'E') {
				trackAndTime.set(key, time + 1)
				break outer
			}
			if (map[x][y] == '.') {
				const currTrackTime = time + 1
				trackAndTime.set(key, currTrackTime)
				tracks.push({ position: [x, y], time: currTrackTime })
			}
		}
	}

	// Since two skips are allowed, from each track point we can skip to 8 different following directions
	const DirectionsforTrack: Position[] = [
		[-1, 1], // Right Top Diagonal
		[1, 1], // Right Down Diagonal
		[-1, -1], // eft Top Diagonal
		[1, -1], // Left Down  Diagonal
		[-2, 0], // top 2x
		[2, 0], // Down 2x
		[0, -2], // Left 2x
		[0, 2] // Right 2x
	]

	for (const track of tracks) {
		const { position, time } = track
		for (const direction of DirectionsforTrack) {
			const [dx, dy] = direction
			const [x, y] = [position[0] + dx, position[1] + dy]

			if (isOutOfBounds([x, y]) || map[x][y] == '#') continue

			const key = `${x}_${y}`

			const nextTrackTime = trackAndTime.get(key)!

			if (nextTrackTime < time) continue

			const timeSaved = nextTrackTime - time - 2 // since we are skipping 2 steps, the 2 steps need to be subtracted as well
			if (timeSaved >= 100) numberOfSkipsForTwoSkips++
		}
	}

	console.log('Part One', numberOfSkipsForTwoSkips)
}

// Took help: https://www.youtube.com/watch?v=tWhwcORztSY
function partTwo() {
	let numberOfSkipsThatSave100OrMoreForNSkips = 0
	for (const track of tracks) {
		// tracks from part one
		const { position, time } = track
		for (let skip = 2; skip <= 20; skip++) {
			// each step in row or column (currently we're stepping over rows), we can skip to 4 different directions
			// these forms a rectangle and together forms a diamond shape
			// visit this: https://excalidraw.com/#json=dShQ9iHV8ktXgCfUIIU3g,YztmKgvfrkpuKe9AUij-jw
			for (let dx = 1; dx <= skip; dx++) {
				const dy = skip - dx
				const newPositions = [
					[dx, dy],
					[dy, -dx],
					[-dx, -dy],
					[-dy, dx]
				] as Position[]
				for (const [dx, dy] of newPositions) {
					const [x, y] = [position[0] + dx, position[1] + dy]
					if (isOutOfBounds([x, y]) || map[x][y] == '#') continue
					const key = `${x}_${y}`

					const nextTrackTime = trackAndTime.get(key)!

					if (nextTrackTime < time) continue

					const timeSaved = nextTrackTime - time - skip // since we are skipping `skip` steps, the `skip` steps need to be subtracted as well
					if (timeSaved >= 100) numberOfSkipsThatSave100OrMoreForNSkips++
				}
			}
		}
	}
	console.log('Part Two', numberOfSkipsThatSave100OrMoreForNSkips)
}

partOne()
partTwo()
