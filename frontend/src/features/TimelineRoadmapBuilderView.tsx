import React, { useState, useRef } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import { format, differenceInDays, addDays } from 'date-fns';

interface Milestone {
  id: number;
  date: Date;
  description: string;
}

const TimelineRoadmapBuilderView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const svgRef = useRef<SVGSVGElement>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 1, date: new Date(2023, 0, 15), description: 'Project Kick-off' },
    { id: 2, date: new Date(2023, 2, 1), description: 'Phase 1 Complete' },
    { id: 3, date: new Date(2023, 5, 20), description: 'Phase 2 Complete' },
  ]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const timelineStart = new Date(2023, 0, 1);
  const timelineEnd = new Date(2023, 11, 31);
  const totalDays = differenceInDays(timelineEnd, timelineStart);
  const svgWidth = 800;
  const svgHeight = 400;

  const dateToX = (date: Date) => {
    const daysFromStart = differenceInDays(date, timelineStart);
    return (daysFromStart / totalDays) * (svgWidth - 100) + 50;
  };

  const xToDate = (x: number) => {
      const days = ((x - 50) / (svgWidth - 100)) * totalDays;
      return addDays(timelineStart, days);
  }

  const handlePointerDown = (id: number) => {
    setDragging(id);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragging === null) return;
    const svgPoint = svgRef.current?.createSVGPoint();
    if (!svgPoint) return;
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    const transformedPoint = svgPoint.matrixTransform(svgRef.current?.getScreenCTM()?.inverse());

    setMilestones(milestones.map(m =>
        m.id === dragging ? { ...m, date: xToDate(transformedPoint.x) } : m
    ));
  };

  const handlePointerUp = () => {
    setDragging(null);
  };

  const addMilestone = () => {
      if (!newMilestoneText || !newMilestoneDate) {
          addToast({ type: 'error', message: 'Please provide a date and description.' });
          return;
      }
      setMilestones([...milestones, {id: Date.now(), date: new Date(newMilestoneDate), description: newMilestoneText}]);
      setNewMilestoneText('');
  }

  const handleDownload = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'timeline.svg';
      link.click();
      URL.revokeObjectURL(url);
      addToast({ type: 'success', message: 'Timeline downloaded as SVG!' });
    }
  };

  return (
    <ToolPageLayout
      title="Timeline/Roadmap Builder"
      onBack={onBack}
      description="Create a timeline with draggable milestones."
    >
      <div className="space-y-4">
        <div className="flex gap-4">
            <input type="date" value={newMilestoneDate} onChange={e => setNewMilestoneDate(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Milestone description" value={newMilestoneText} onChange={e => setNewMilestoneText(e.target.value)} className="w-full p-2 border rounded" />
            <button onClick={addMilestone} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
        </div>
        <svg
          ref={svgRef}
          width={svgWidth}
          height={svgHeight}
          className="border rounded-md"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <line x1="50" y1={svgHeight / 2} x2={svgWidth - 50} y2={svgHeight / 2} stroke="black" strokeWidth="2" />
          {milestones.map((m, i) => (
            <g key={m.id} transform={`translate(${dateToX(m.date)}, ${svgHeight / 2})`} onPointerDown={() => handlePointerDown(m.id)} style={{cursor: dragging === m.id ? 'grabbing' : 'grab'}}>
              <circle cx="0" cy="0" r="8" fill="blue" />
              <text x="0" y={i % 2 === 0 ? -20 : 40} textAnchor="middle" fontSize="12">{m.description}</text>
              <text x="0" y={i % 2 === 0 ? -35 : 25} textAnchor="middle" fontSize="10">{format(m.date, 'MMM d')}</text>
            </g>
          ))}
        </svg>
        <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded-md">Download as SVG</button>
      </div>
    </ToolPageLayout>
  );
};

export default TimelineRoadmapBuilderView;
