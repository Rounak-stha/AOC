import { join } from '@std/path/join'
import { readInput } from '../utils.ts'

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInput(join(dirname, 'data', './input.txt'))

const parsedInput = input.split('').map((i) => parseInt(i))

/**
 * Odd input index -> File block
 * 		- Number at odd index -> number of file block
 * 		- File id -> Math.floor(index / 2)
 * Even input index -> Enpty Space
 * 		- Number at even index -> number of empty space
 */

/**
 * 	- Maintain a separate list of files and empty spaces
 * 	- The first file blck can not move, which we use to initialize the compressed array
 * 	- Thus for the 2 list, for the same index, theempty space came before the file block
 * 	- Now play wth the 2 lists to move file blocks and empty spaces
 *
 */
const fileBlockStack: number[] = []
const emptySpaceQueue: number[] = []

function partOne() {
	const input = [...parsedInput]
	const compressed: number[] = Array.from({ length: input[0] }).fill(0) as number[] // index of first file block is 0, so we need to fill with 0

	for (let i = 1; i < input.length; i++) {
		if (i % 2 == 0) {
			fileBlockStack.push(input[i])
		} else {
			emptySpaceQueue.push(input[i])
		}
	}

	const emptySpace = [...emptySpaceQueue]
	const fileBlock = [...fileBlockStack]

	let emptySpaceIndex = 0

	let headFileIndex = 0
	let tailFileIndex = fileBlock.length - 1

	while (headFileIndex <= tailFileIndex) {
		const emptySpaceLength = emptySpace[emptySpaceIndex]
		const tailFileLength = fileBlock[tailFileIndex]
		const headFileLength = fileBlock[headFileIndex]

		if (headFileIndex == tailFileIndex) {
			// we reached end
			// spread the remaining file block
			compressed.push(...(Array.from({ length: tailFileLength }).fill(tailFileIndex + 1) as number[]))
			break
		}

		if (emptySpaceLength > tailFileLength) {
			compressed.push(...(Array.from({ length: tailFileLength }).fill(tailFileIndex + 1) as number[]))
			tailFileIndex -= 1
			emptySpace[emptySpaceIndex] -= tailFileLength
		} else if (emptySpaceLength < tailFileLength) {
			compressed.push(...(Array.from({ length: emptySpaceLength }).fill(tailFileIndex + 1) as number[]))
			compressed.push(...(Array.from({ length: headFileLength }).fill(headFileIndex + 1) as number[]))
			emptySpaceIndex += 1
			headFileIndex += 1
			fileBlock[tailFileIndex] -= emptySpaceLength
		} else {
			compressed.push(...(Array.from({ length: tailFileLength }).fill(tailFileIndex + 1) as number[]))
			compressed.push(...(Array.from({ length: headFileLength }).fill(headFileIndex + 1) as number[]))
			tailFileIndex -= 1
			headFileIndex += 1
			emptySpaceIndex += 1
		}
	}

	console.log(compressed.reduce((acc, curr, index) => acc + curr * index, 0))
}

type EmptySpaceWithAddedFiles = { added: { id: number; length: number }[]; emptySpace: number }[]
type FileBlocks = { id: number; length: number }[]

function partTwo() {
	const fileBlocks: FileBlocks = fileBlockStack.map((length, index) => ({ id: index + 1, length }))
	const emptySpacesWithAddedFiles: EmptySpaceWithAddedFiles = emptySpaceQueue.map((emptySpace) => ({
		added: [],
		emptySpace
	}))

	for (let fileIndex = fileBlocks.length - 1; fileIndex >= 0; fileIndex--) {
		const fileId = fileBlocks[fileIndex].id
		const fileLength = fileBlocks[fileIndex].length

		if (fileLength == 0) continue

		// Search for the first empty space with enough space that comes before the file block
		const firstemptySpaceWithEnoughSpace = (function () {
			for (let i = 0; i <= fileIndex; i++) {
				if (emptySpacesWithAddedFiles[i].emptySpace >= fileLength) {
					return i
				}
			}
			return -1
		})()

		if (firstemptySpaceWithEnoughSpace != -1) {
			emptySpacesWithAddedFiles[firstemptySpaceWithEnoughSpace].added.push({ id: fileId, length: fileLength })
			emptySpacesWithAddedFiles[firstemptySpaceWithEnoughSpace].emptySpace -= fileLength
			fileBlocks[fileIndex].id = 0 // file becomes empty space
		}
	}

	const compressed: number[] = Array.from({ length: parsedInput[0] }).fill(0) as number[]

	// create compressed data from the list
	for (let i = 0; i < emptySpacesWithAddedFiles.length; i++) {
		emptySpacesWithAddedFiles[i].added.forEach((file) => {
			compressed.push(...(Array.from({ length: file.length }).fill(file.id) as number[]))
		})
		if (emptySpacesWithAddedFiles[i].emptySpace > 0) {
			compressed.push(...(Array.from({ length: emptySpacesWithAddedFiles[i].emptySpace }).fill(0) as number[]))
		}

		const nextFileBlock = fileBlocks[i]
		if (nextFileBlock) {
			compressed.push(...(Array.from({ length: nextFileBlock.length }).fill(nextFileBlock.id) as number[]))
		}
	}

	console.log(compressed.reduce((acc, curr, index) => acc + curr * index, 0))
}

partOne()
partTwo()
