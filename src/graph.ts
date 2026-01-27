/**
 * Visual Dependency Graph
 * Interactive visualization showing how decisions flow from PRD → AGENT
 */

import * as d3 from "d3"

// Phase colors
const PHASE_COLORS: Record<string, string> = {
    PRD: "#3b82f6",     // Blue
    ARD: "#8b5cf6",     // Purple
    TRD: "#22c55e",     // Green
    TASKS: "#f59e0b",   // Orange
    AGENT: "#ef4444"    // Red
}

interface GraphNode {
    id: string
    phase: string
    label: string
    excerpt: string
    x?: number
    y?: number
    fx?: number | null
    fy?: number | null
}

interface GraphLink {
    source: string | GraphNode
    target: string | GraphNode
}

interface GraphData {
    nodes: GraphNode[]
    links: GraphLink[]
}

/**
 * Parse Chain output to extract key decisions from each phase
 */
export function parseChainOutput(content: string): GraphData {
    const nodes: GraphNode[] = []
    const links: GraphLink[] = []

    const sections = content.split(/\n\n---\n\n/)

    let prevPhaseNodes: string[] = []

    sections.forEach((section) => {
        const phaseMatch = section.match(/^# (PRD|ARD|TRD|TASKS|AGENT)/)
        if (!phaseMatch) return

        const phase = phaseMatch[1]
        const phaseContent = section.replace(/^# (PRD|ARD|TRD|TASKS|AGENT)\n\n/, "")

        // Extract key items (headers, bullet points, etc.)
        const items = extractKeyItems(phaseContent, phase)
        const currentPhaseNodes: string[] = []

        items.forEach((item, itemIdx) => {
            const nodeId = `${phase}-${itemIdx}`
            nodes.push({
                id: nodeId,
                phase,
                label: item.label,
                excerpt: item.excerpt
            })
            currentPhaseNodes.push(nodeId)

            // Link to previous phase nodes
            if (prevPhaseNodes.length > 0) {
                // Connect to relevant previous nodes (simplified: connect to all)
                const linkTarget = prevPhaseNodes[Math.min(itemIdx, prevPhaseNodes.length - 1)]
                links.push({
                    source: linkTarget,
                    target: nodeId
                })
            }
        })

        prevPhaseNodes = currentPhaseNodes
    })

    return { nodes, links }
}

interface KeyItem {
    label: string
    excerpt: string
}

function extractKeyItems(content: string, phase: string): KeyItem[] {
    const items: KeyItem[] = []
    const lines = content.split("\n")

    // Extract headers (## or ###)
    const headerPattern = /^#{2,3}\s+(.+)/

    for (const line of lines) {
        const match = line.match(headerPattern)
        if (match && items.length < 5) { // Limit to 5 items per phase
            const label = match[1].substring(0, 30) + (match[1].length > 30 ? "..." : "")
            items.push({
                label,
                excerpt: match[1]
            })
        }
    }

    // If no headers found, try bullet points
    if (items.length === 0) {
        const bulletPattern = /^[-*]\s+\*?\*?(.+?)\*?\*?:/
        for (const line of lines) {
            const match = line.match(bulletPattern)
            if (match && items.length < 5) {
                const label = match[1].substring(0, 30) + (match[1].length > 30 ? "..." : "")
                items.push({
                    label,
                    excerpt: line
                })
            }
        }
    }

    // Fallback: just add the phase as a single node
    if (items.length === 0) {
        items.push({
            label: phase,
            excerpt: `${phase} Output`
        })
    }

    return items
}

/**
 * Render the dependency graph using D3
 */
export function renderDependencyGraph(
    container: SVGSVGElement,
    data: GraphData,
    onNodeClick?: (node: GraphNode) => void
) {
    const width = container.clientWidth || 600
    const height = container.clientHeight || 400

    // Clear previous content
    d3.select(container).selectAll("*").remove()

    const svg = d3.select(container)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])

    // Add zoom behavior
    const g = svg.append("g")

    svg.call(
        d3.zoom<SVGSVGElement, unknown>()
            .extent([[0, 0], [width, height]])
            .scaleExtent([0.5, 3])
            .on("zoom", (event) => {
                g.attr("transform", event.transform)
            })
    )

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
        .force("link", d3.forceLink(data.links)
            .id((d: any) => d.id)
            .distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(50))

    // Draw links
    const link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke", "rgba(255, 255, 255, 0.2)")
        .attr("stroke-width", 1.5)

    // Draw nodes
    const node = g.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(data.nodes)
        .join("g")
        .attr("cursor", "pointer")
        .call(d3.drag<any, GraphNode>()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart()
                d.fx = d.x
                d.fy = d.y
            })
            .on("drag", (event, d) => {
                d.fx = event.x
                d.fy = event.y
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0)
                d.fx = null
                d.fy = null
            }))

    // Node circles
    node.append("circle")
        .attr("r", 25)
        .attr("fill", d => PHASE_COLORS[d.phase] || "#666")
        .attr("stroke", "rgba(255, 255, 255, 0.3)")
        .attr("stroke-width", 2)

    // Node labels
    node.append("text")
        .text(d => d.label.substring(0, 15))
        .attr("text-anchor", "middle")
        .attr("dy", 40)
        .attr("fill", "rgba(255, 255, 255, 0.8)")
        .attr("font-size", "10px")
        .attr("font-family", "-apple-system, sans-serif")

    // Phase badge
    node.append("text")
        .text(d => d.phase)
        .attr("text-anchor", "middle")
        .attr("dy", 4)
        .attr("fill", "white")
        .attr("font-size", "8px")
        .attr("font-weight", "600")
        .attr("font-family", "-apple-system, sans-serif")

    // Click handler
    if (onNodeClick) {
        node.on("click", (event, d) => {
            event.stopPropagation()
            onNodeClick(d)
        })
    }

    // Hover effects
    node.on("mouseenter", function () {
        d3.select(this).select("circle")
            .transition()
            .duration(150)
            .attr("r", 30)
    })
        .on("mouseleave", function () {
            d3.select(this).select("circle")
                .transition()
                .duration(150)
                .attr("r", 25)
        })

    // Update positions on tick
    simulation.on("tick", () => {
        link
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y)

        node.attr("transform", d => `translate(${d.x},${d.y})`)
    })

    return simulation
}
