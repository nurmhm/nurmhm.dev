"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

const NODE_COUNT = 140
const LINK_DISTANCE = 1.6
const BOUNDS = { x: 7, y: 4, z: 3 }

function canRender() {
  if (typeof window === "undefined") return false
  if (!window.matchMedia("(min-width: 1024px)").matches) return false
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}

/** Drifting node graph behind the hero. Desktop + motion-allowed + WebGL only; otherwise renders nothing. */
export default function ConstellationBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(canRender())
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!enabled || !container) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 50)
    camera.position.z = 7

    const group = new THREE.Group()
    scene.add(group)

    const positions = new Float32Array(NODE_COUNT * 3)
    const velocities = new Float32Array(NODE_COUNT * 3)
    for (let i = 0; i < NODE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * BOUNDS.x * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS.y * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * BOUNDS.z * 2
      velocities[i * 3] = (Math.random() - 0.5) * 0.004
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.004
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002
    }

    const pointGeometry = new THREE.BufferGeometry()
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const pointMaterial = new THREE.PointsMaterial({ color: 0x34d399, size: 0.06, transparent: true, opacity: 0.9 })
    group.add(new THREE.Points(pointGeometry, pointMaterial))

    // Worst case every pair links; in practice only a small fraction do, so the draw range is trimmed each frame.
    const maxSegments = (NODE_COUNT * (NODE_COUNT - 1)) / 2
    const linePositions = new Float32Array(maxSegments * 6)
    const lineColors = new Float32Array(maxSegments * 6)
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage))
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage))
    const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending })
    group.add(new THREE.LineSegments(lineGeometry, lineMaterial))

    const lineColor = new THREE.Color(0x22d3ee)
    const pointer = { x: 0, y: 0 }
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", onResize)

    let visible = true
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(container)

    let frame = 0
    const tick = () => {
      frame = requestAnimationFrame(tick)
      if (!visible || document.hidden) return

      for (let i = 0; i < NODE_COUNT * 3; i++) {
        positions[i] += velocities[i]
        const axis = i % 3
        const limit = axis === 0 ? BOUNDS.x : axis === 1 ? BOUNDS.y : BOUNDS.z
        if (Math.abs(positions[i]) > limit) velocities[i] *= -1
      }
      pointGeometry.attributes.position.needsUpdate = true

      let vertex = 0
      for (let a = 0; a < NODE_COUNT; a++) {
        for (let b = a + 1; b < NODE_COUNT; b++) {
          const dx = positions[a * 3] - positions[b * 3]
          const dy = positions[a * 3 + 1] - positions[b * 3 + 1]
          const dz = positions[a * 3 + 2] - positions[b * 3 + 2]
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (distance > LINK_DISTANCE) continue
          const strength = 1 - distance / LINK_DISTANCE
          for (const node of [a, b]) {
            linePositions[vertex * 3] = positions[node * 3]
            linePositions[vertex * 3 + 1] = positions[node * 3 + 1]
            linePositions[vertex * 3 + 2] = positions[node * 3 + 2]
            lineColors[vertex * 3] = lineColor.r * strength
            lineColors[vertex * 3 + 1] = lineColor.g * strength
            lineColors[vertex * 3 + 2] = lineColor.b * strength
            vertex++
          }
        }
      }
      lineGeometry.setDrawRange(0, vertex)
      lineGeometry.attributes.position.needsUpdate = true
      lineGeometry.attributes.color.needsUpdate = true

      group.rotation.y += (pointer.x * 0.25 - group.rotation.y) * 0.03
      group.rotation.x += (pointer.y * 0.15 - group.rotation.x) * 0.03
      camera.position.z = 7 + Math.min(window.scrollY / 400, 3)

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("resize", onResize)
      pointGeometry.dispose()
      pointMaterial.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [enabled])

  if (!enabled) return null
  return <div ref={containerRef} aria-hidden className="pointer-events-none absolute inset-0 opacity-70" />
}
