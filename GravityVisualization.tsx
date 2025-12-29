
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GravityVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 400;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll("*").remove();

    // Create a mesh background to represent spacetime
    const spacing = 30;
    const gridData = [];
    for (let x = 0; x <= width; x += spacing) {
      for (let y = 0; y <= height; y += spacing) {
        gridData.push({ x, y, ox: x, oy: y });
      }
    }

    const mesh = svg.append('g').attr('class', 'mesh');
    const nodes = mesh.selectAll('circle')
      .data(gridData)
      .enter()
      .append('circle')
      .attr('r', 1)
      .attr('fill', '#4fd1c5')
      .attr('opacity', 0.4);

    const sun = { x: width / 2, y: height / 2, mass: 5000 };

    const updateGrid = (mx: number, my: number) => {
      nodes.attr('cx', (d: any) => {
        const dx = d.ox - mx;
        const dy = d.oy - my;
        const distSq = dx * dx + dy * dy;
        const force = sun.mass / (distSq + 1000);
        return d.ox - dx * force;
      }).attr('cy', (d: any) => {
        const dx = d.ox - mx;
        const dy = d.oy - my;
        const distSq = dx * dx + dy * dy;
        const force = sun.mass / (distSq + 1000);
        return d.oy - dy * force;
      });
    };

    updateGrid(sun.x, sun.y);

    // Add mass
    svg.append('circle')
      .attr('cx', sun.x)
      .attr('cy', sun.y)
      .attr('r', 20)
      .attr('fill', 'orange')
      .style('filter', 'blur(5px)')
      .attr('class', 'sun-core');

    svg.on('mousemove', (event) => {
      const [mx, my] = d3.pointer(event);
      updateGrid(mx, my);
      svg.select('.sun-core').attr('cx', mx).attr('cy', my);
    });

  }, []);

  return (
    <div className="w-full bg-slate-900/50 rounded-xl p-4 border border-cyan-500/30">
      <p className="text-sm text-cyan-300 mb-2 text-center">حرك الفأرة لمحاكاة تشوه الزمكان</p>
      <svg ref={svgRef} className="w-full cursor-none"></svg>
    </div>
  );
};

export default GravityVisualization;
