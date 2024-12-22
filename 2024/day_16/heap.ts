interface HeapElement {
	cost: number
	[key: string]: any
}

export class MinHeap {
	heap: HeapElement[]

	constructor(arr: HeapElement[]) {
		this.heap = arr
		const lastNonLeafNode = Math.floor(this.heap.length / 2 - 1)
		for (let i = lastNonLeafNode; i >= 0; i--) {
			this.heapifyDown(i)
		}
	}

	heapifyDown(index: number) {
		const arrLen = this.heap.length
		const temp = index
		const left = 2 * index + 1
		const right = 2 * index + 2

		if (left < arrLen && this.heap[index].cost > this.heap[left].cost) {
			index = left
		}

		if (right < arrLen && this.heap[index].cost > this.heap[right].cost) {
			index = right
		}

		if (index !== temp) {
			;[this.heap[temp], this.heap[index]] = [this.heap[index], this.heap[temp]]
			this.heapifyDown(index)
		}
	}

	heapifyUp(index?: number) {
		if (index === undefined) {
			index = this.heap.length - 1
		}

		const parentIndex = Math.floor((index - 1) / 2)

		if (parentIndex >= 0 && this.heap[parentIndex].cost > this.heap[index].cost) {
			;[this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]]
			this.heapifyUp(parentIndex)
		}
	}

	insert(element: HeapElement) {
		this.heap.push(element)
		this.heapifyUp()
	}

	removeMin() {
		const min = this.heap[0]
		this.heap[0] = this.heap[this.heap.length - 1]
		this.heap.pop()
		this.heapifyDown(0)
		return min
	}
}
