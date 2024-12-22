import { join } from '@std/path/join'
import { readInput } from '../utils.ts'

type Instruction = [number, number] // [opcode, operand]

const dirname = import.meta.dirname

if (!dirname) throw new Error("I can't find dirname")

const input = readInput(join(dirname, 'data', './input.txt'))

const [rawRegister, rawProgram] = input.split(/\r?\n\r?\n/).map((s, i) => (i == 0 ? s.split(/\r?\n/) : s)) as [
	string[],
	string
]

const [Initial_Reg_A, Initial_Reg_B, Initial_Reg_C] = rawRegister.map((r) => parseInt(r.split(':')[1].trim()))

let [Reg_A, Reg_B, Reg_C] = [Initial_Reg_A, Initial_Reg_B, Initial_Reg_C] // copy initial registers

const program: Array<Instruction> = rawProgram
	.split(':')[1]
	.trim()
	.split(',')
	.map(Number)
	.reduce((result, _, i, arr) => {
		if (i % 2 === 0) {
			result.push([arr[i], arr[i + 1]])
		}
		return result
	}, [] as Array<Instruction>)

let Instruction_Pointer = 0
const outputs: number[] = []

function getComboOperandValue(operand: number) {
	if (operand <= 3) return operand
	if (operand == 4) return Reg_A
	if (operand == 5) return Reg_B
	if (operand == 6) return Reg_C
	throw 'Invalid Operand: ' + operand
}

function operation_adv(operand: number) {
	const operandVal = getComboOperandValue(operand)
	Reg_A = Math.floor(Reg_A / Math.pow(2, operandVal))
	Instruction_Pointer++
}

function operation_bxl(operand: number) {
	Reg_B ^= operand
	Instruction_Pointer++
}

function operation_bst(operand: number) {
	const operandVal = getComboOperandValue(operand)
	Reg_B = operandVal % 8
	Instruction_Pointer++
}

function operation_jnz(operand: number) {
	if (Reg_A == 0) Instruction_Pointer++
	else Instruction_Pointer = operand / 2
}

function operation_bxc(operand: number) {
	Reg_B ^= Reg_C
	Instruction_Pointer++
}

function operation_out(operand: number) {
	const operandVal = getComboOperandValue(operand)
	outputs.push(operandVal % 8)
	Instruction_Pointer++
}

function operation_bdv(operand: number) {
	const operandVal = getComboOperandValue(operand)
	Reg_B = Math.floor(Reg_A / Math.pow(2, operandVal))
	Instruction_Pointer++
}

function operation_cdv(operand: number) {
	const operandVal = getComboOperandValue(operand)
	Reg_C = Math.floor(Reg_A / Math.pow(2, operandVal))
	Instruction_Pointer++
}

function operate(instruction: Instruction) {
	const [opcode, operand] = instruction
	switch (opcode) {
		case 0:
			operation_adv(operand)
			break
		case 1:
			operation_bxl(operand)
			break
		case 2:
			operation_bst(operand)
			break
		case 3:
			operation_jnz(operand)
			break
		case 4:
			operation_bxc(operand)
			break
		case 5:
			operation_out(operand)
			break
		case 6:
			operation_bdv(operand)
			break
		case 7:
			operation_cdv(operand)
			break
	}
}

function partOne() {
	while (Instruction_Pointer < program.length) {
		operate(program[Instruction_Pointer])
	}
	console.log('Part One', outputs.join(','))
}

// Reverse Engineer
// Works for the example input but not for the actual input
function partTwo() {
	const expectedOutcome = rawProgram
		.split(':')[1]
		.trim()
		.split(',')
		.map((i) => parseInt(i))
	// we need the instruction pointer to be at the last output instruction
	Instruction_Pointer = program.findIndex((p) => p[0] == 5)

	function findInitialRegA(outcome: number[], a: number): number | null {
		if (!outcome.length) {
			console.log('Returning a')
			return a
		}
		for (let i = 0; i < 8; i++) {
			let b = i ^ 5
			const c = a >> b
			b = b ^ 6
			b = b ^ c
			const output = b % 8
			if (output == outcome[outcome.length - 1]) {
				const s = findInitialRegA(outcome.slice(0, -1), a << 3)
				if (!s) continue
				return s
			}
		}
		return null
	}
	console.log(findInitialRegA(expectedOutcome, 5))
}

partOne()
// partTwo()

/**
 * [2,4], [1,5], [7,5], [1,6], [4,1], [5,5], [0,3], [3,0]
 * Step 1: Reg_B = Reg_A % 8
 * Step 2: Reg_B = Reg_B ^ 5
 * Step 3: Reg_C = Reg_A / 2 ** Reg_B
 * Step 4: Reg_B = Reg_B ^ 6
 * Step 5: Reg_B = Reg_B ^ Reg_C
 * Step 6: Output Reg_B % 8
 * Step 7: Reg_A = Reg_A / 2 ** 3
 * Step 8: if (Reg_A > 0) Jump 1 else END
 */
