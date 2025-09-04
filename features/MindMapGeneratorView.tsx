import React, { useState, useRef, useEffect } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import * as d3 from 'd3-force';
import svgPanZoom from 'svg-pan-zoom';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
}

const MindMapGeneratorView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', name: 'Central Idea', fx: 400, fy: 300 },
  ]);
  const [links, setLinks] = useState<Link[]>([]);
  const [newNodeName, setNewNodeName] = useState('');
  const [selectedParent, setSelectedParent] = useState('1');

  useEffect(() => {
    if (!svgRef.current) return;

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => (d as Node).id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(400, 300));

    const linkElements = d3.select(svgRef.current).selectAll('.link');
    const nodeElements = d3.select(svgRef.current).selectAll('.node');

    simulation.on('tick', () => {
      linkElements
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      nodeElements
        .attr('transform', d => `translate(${(d as Node).x}, ${(d as Node).y})`);
    });

    const panZoomInstance = svgPanZoom(svgRef.current, {
        zoomEnabled: true,
        controlIconsEnabled: true
    });

    return () => {
      simulation.stop();
      panZoomInstance.destroy();
    };
  }, [nodes, links]);

  const addNode = () => {
      if (!newNodeName) {
          addToast({ type: 'error', message: 'Please enter a name for the new node.'});
          return;
      }
      const newNodeId = (nodes.length + 1).toString();
      const newNode: Node = { id: newNodeId, name: newNodeName };
      const newLink: Link = { source: selectedParent, target: newNodeId };

      setNodes([...nodes, newNode]);
      setLinks([...links, newLink]);
      setNewNodeName('');
  }

  const handleDownload = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mind-map.svg';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <ToolPageLayout
      title="Mind Map Generator"
      onBack={onBack}
      description="Create a mind map with a force-directed graph."
    >
      <div className="space-y-4">
        <div className="flex gap-4">
          <input type="text" placeholder="New node name" value={newNodeName} onChange={e => setNewNodeName(e.target.value)} className="w-full p-2 border rounded" />
          <select value={selectedParent} onChange={e => setSelectedParent(e.target.value)} className="p-2 border rounded">
            {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
          <button onClick={addNode} className="px-4 py-2 bg-blue-600 text-white rounded">Add Node</button>
        </div>
        <svg ref={svgRef} width="800" height="600" className="border rounded-md">
            <g className="links">
                {links.map((link, i) => <line key={i} className="link" stroke="#999" strokeOpacity="0.6" strokeWidth="2" />)}
            </g>
            <g className="nodes">
                {nodes.map(node => (
                    <g key={node.id} className="node">
                        <circle r="10" fill="blue" />
                        <text dy="25" textAnchor="middle">{node.name}</text>
                    </g>
                ))}
            </g>
        </svg>
        <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded-md">Download as SVG</button>
      </div>
    </ToolPageLayout>
  );
};

export default MindMapGeneratorView;
