const [dayNumber] = Deno.args

if (!dayNumber) {
	console.error('Usage: Day number is required. deno run day <dayNumber>')
	Deno.exit(1)
}

const filePath = `./2024/day_${dayNumber}/solution.ts`

try {
	// Ensure the file exists before trying to execute it
	await Deno.stat(filePath)
} catch (error) {
	if (error instanceof Deno.errors.NotFound) {
		console.error(`Error: File ${filePath} does not exist.`)
		Deno.exit(1)
	} else {
		throw error // Other errors should not be swallowed
	}
}

const command = new Deno.Command('deno', {
	args: ['run', '--allow-read', filePath]
})

const { code, stdout, stderr } = await command.output() // Execute the command and capture output

if (code === 0) {
	console.log(new TextDecoder().decode(stdout)) // Print standard output
} else {
	console.error(new TextDecoder().decode(stderr)) // Print errors
	Deno.exit(code)
}
