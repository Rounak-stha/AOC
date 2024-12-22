import { MinHeap } from './heap.ts'
import { assertEquals } from '@std/assert/equals'

// Test minheap with deno
Deno.test('MinHeap Insert', () => {
	const minHeap = new MinHeap([1, 2, 3, 4, 5].map((cost) => ({ cost })))
	assertEquals(
		minHeap.heap,
		[1, 2, 3, 4, 5].map((cost) => ({ cost }))
	)
	minHeap.insert({ cost: 0 })
	assertEquals(
		minHeap.heap,
		[0, 2, 1, 4, 5, 3].map((cost) => ({ cost }))
	)
	minHeap.insert({ cost: 6 })
	assertEquals(
		minHeap.heap,
		[0, 2, 1, 4, 5, 3, 6].map((cost) => ({ cost }))
	)
	minHeap.insert({ cost: -1 })
	assertEquals(
		minHeap.heap,
		[-1, 0, 1, 2, 5, 3, 6, 4].map((cost) => ({ cost }))
	)
	minHeap.insert({ cost: 7 })
	assertEquals(
		minHeap.heap,
		[-1, 0, 1, 2, 5, 3, 6, 4, 7].map((cost) => ({ cost }))
	)
	minHeap.insert({ cost: 8 })
	assertEquals(
		minHeap.heap,
		[-1, 0, 1, 2, 5, 3, 6, 4, 7, 8].map((cost) => ({ cost }))
	)
	minHeap.insert({ cost: -2 })
	assertEquals(
		minHeap.heap,
		[-2, -1, 1, 2, 0, 3, 6, 4, 7, 8, 5].map((cost) => ({ cost }))
	)
})

Deno.test('Minheap Pop', () => {
	const minHeap = new MinHeap([-2, -1, 1, 2, 0, 3, 6, 4, 7, 8, 5].map((cost) => ({ cost })))
	assertEquals(
		minHeap.heap,
		[-2, -1, 1, 2, 0, 3, 6, 4, 7, 8, 5].map((cost) => ({ cost }))
	)

	assertEquals(minHeap.removeMin().cost, -2)
	assertEquals(
		minHeap.heap,
		[-1, 0, 1, 2, 5, 3, 6, 4, 7, 8].map((cost) => ({ cost }))
	)
	assertEquals(minHeap.removeMin().cost, -1)
	assertEquals(
		minHeap.heap,
		[0, 2, 1, 4, 5, 3, 6, 8, 7].map((cost) => ({ cost }))
	)
	assertEquals(minHeap.removeMin().cost, 0)
	assertEquals(
		minHeap.heap,
		[1, 2, 3, 4, 5, 7, 6, 8].map((cost) => ({ cost }))
	)
	assertEquals(minHeap.removeMin().cost, 1)
	assertEquals(
		minHeap.heap,
		[2, 4, 3, 8, 5, 7, 6].map((cost) => ({ cost }))
	)
	assertEquals(minHeap.removeMin().cost, 2)
	assertEquals(
		minHeap.heap,
		[3, 4, 6, 8, 5, 7].map((cost) => ({ cost }))
	)
	assertEquals(minHeap.removeMin().cost, 3)
	assertEquals(
		minHeap.heap,
		[4, 5, 6, 8, 7].map((cost) => ({ cost }))
	)
	assertEquals(minHeap.removeMin().cost, 4)
	assertEquals(
		minHeap.heap,
		[5, 7, 6, 8].map((cost) => ({ cost }))
	)
	assertEquals(minHeap.removeMin().cost, 5)
	assertEquals(
		minHeap.heap,
		[6, 7, 8].map((cost) => ({ cost }))
	)
	assertEquals(minHeap.removeMin().cost, 6)
	assertEquals(
		minHeap.heap,
		[7, 8].map((cost) => ({ cost }))
	)
	assertEquals(minHeap.removeMin().cost, 7)
	assertEquals(
		minHeap.heap,
		[8].map((cost) => ({ cost }))
	)
	assertEquals(minHeap.removeMin().cost, 8)
	assertEquals(minHeap.heap, [])
	assertEquals(minHeap.removeMin(), undefined)
})
