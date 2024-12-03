/**
 * Read the input
 * @returns {Array<string>} The input lines
 */
export const readInputLines = (path: string) => {
	return Deno.readTextFileSync(path)
		.trim()
		.split('\n')
		.map((line) => line.trim())
}

/**
 * Read the input
 * @returns {string} The input
 */
export const readInput = (path: string) => {
	return Deno.readTextFileSync(path).trim()
}
