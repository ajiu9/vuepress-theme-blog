<template>
	<div class="plum-wrapper">
		<canvas ref="el" width="400px" height="400px"></canvas>
    <slot></slot>
	</div>
</template>
<script>
import { onMounted, ref, watch } from 'vue'
export default {
	setup() {
		const r180 = Math.PI
		const r90 = Math.PI / 2
		const r60 = Math.PI / 3
		const r30 = Math.PI / 6
		const r15 = Math.PI / 12
		const r120 = (Math.PI / 3) * 2
		const r360 = Math.PI * 2

		const el = ref(null)

		const { random } = Math

		const init = ref(5)
		const len = ref(5)
		const stopped = ref(false)
		const f = {
			start: () => {}
		}
		watch([init, len], () => f.start())

		onMounted(async () => {
			const canvas = el.value
			const { ctx } = initCanvas(canvas)
			const { width, height } = canvas

			let steps = [],
				prevSteps = [],
				iterations = 0

			const step = (x, y, rad) => {
				const length = random() * len.value

				const [nx, ny] = polar2cart(x, y, length, rad)

				ctx.beginPath()
				ctx.moveTo(x, y)
				ctx.lineTo(nx, ny)
				ctx.stroke()

				const rad1 = rad + random() * r15
				const rad2 = rad - random() * r15

				if (nx < -100 || nx > 500 || ny < -100 || ny > 500) return

				if (iterations <= init.value || random() > 0.5) steps.push(() => step(nx, ny, rad1))
				if (iterations <= init.value || random() > 0.5) steps.push(() => step(nx, ny, rad2))
			}

			// const controls = {}

			const frame = () => {
				iterations += 1
				prevSteps = steps
				steps = []

				if (!prevSteps.length) {
					controls.pause()
					stopped.value = true
				}
				prevSteps.forEach(i => i())
			}
			const controls = useRafFn(frame, { immediate: true, window: window })


			f.start = () => {
				controls.pause()
				iterations = 0
				ctx.clearRect(0, 0, width, height)
				ctx.lineWidth = 1
				ctx.strokeStyle = '#00000040'
				prevSteps = []
				steps =
					random() < 0.5
						? [() => step(0, random() * 400, 0), () => step(400, random() * 400, r180)]
						: [
								() => step(random() * 400, 0, r90),
								() => step(random() * 400, 400, -r90)
						  ]
				controls.resume()
				stopped.value = false
			}

			f.start()
		})

		return {
			el
		}
		function initCanvas(canvas, width = 400, height = 400, _dpi) {
			const ctx = canvas.getContext('2d')
			const dpr = window.devicePixelRatio || 1

			const bsr =
				ctx.webkitBackingStorePixelRatio ||
				ctx.mozBackingStorePixelRatio ||
				ctx.msBackingStorePixelRatio ||
				ctx.oBackingStorePixelRatio ||
				ctx.backingStorePixelRatio ||
				1

			const dpi = _dpi || dpr / bsr

			canvas.style.width = `${width}px`
			canvas.style.height = `${height}px`
			canvas.width = dpi * width
			canvas.height = dpi * height
			ctx.scale(dpi, dpi)
			return { ctx, dpi }
		}
		function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
			const dx = r * Math.cos(theta)
			const dy = r * Math.sin(theta)
			return [x + dx, y + dy]
		}
		function useRafFn(fn, options) {
			const { immediate = true, fpsLimit = undefined, window } = options

			const isActive = ref(false)
			const intervalLimit = fpsLimit ? 1000 / fpsLimit : null
			let previousFrameTimestamp = 0,
				rafId = null

			function loop(timestamp) {
				if (!isActive.value || !window) return

				const delta = timestamp - (previousFrameTimestamp || timestamp)

				if (intervalLimit && delta < intervalLimit) {
					rafId = window.requestAnimationFrame(loop)
					return
				}

				fn({ delta, timestamp })

				previousFrameTimestamp = timestamp
				rafId = window.requestAnimationFrame(loop)
			}

			function resume() {
				if (!isActive.value && window) {
					isActive.value = true
					rafId = window.requestAnimationFrame(loop)
				}
			}

			function pause() {
				isActive.value = false
				if (rafId != null && window) {
					window.cancelAnimationFrame(rafId)
					rafId = null
				}
			}

			if (immediate) resume()

			// tryOnScopeDispose(pause)

			return {
				isActive,
				pause,
				resume
			}
		}
		function tryOnScopeDispose(fn) {
			if (getCurrentScope()) {
				onScopeDispose(fn)
				return true
			}
			return false
		}
	}
}
</script>
<style lang="less" scoped>
.plum-wrapper

</style>
