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
    return Math.max(50, Math.min(svgWidth - 50, (daysFromStart / totalDays) * (svgWidth - 100) + 50));
  };

  const xToDate = (x: number) => {
      const days = ((x - 50) / (svgWidth - 100)) * totalDays;
      return addDays(timelineStart, days);
  }

  const handlePointerDown = (id: number, e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(id);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragging === null) return;

    // Calculate new date based on mouse position relative to SVG
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;

    const mouseX = e.clientX - svgRect.left;
    const newDate = xToDate(mouseX);

    // Constrain date to timeline bounds
    const clampedDate = new Date(Math.max(timelineStart.getTime(), Math.min(timelineEnd.getTime(), newDate.getTime())));

    setMilestones(milestones.map(m =>
        m.id === dragging ? { ...m, date: clampedDate } : m
    ));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
     if (dragging !== null) {
         setDragging(null);
         // Optionally release capture if it was set on the circle, but here we handled move on SVG.
         // If we set capture on the element in pointerDown, we should release it here if we had reference to it.
         // But capturing on element usually means events go to element.
         // Here we listen to move on SVG container which is better for drag-n-drop across surface.
     }
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
        <div className="border rounded-md overflow-hidden bg-white">
            <svg
            ref={svgRef}
            width={svgWidth}
            height={svgHeight}
            className="select-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            >
            <rect width={svgWidth} height={svgHeight} fill="white" />
            <line x1="50" y1={svgHeight / 2} x2={svgWidth - 50} y2={svgHeight / 2} stroke="#333" strokeWidth="4" strokeLinecap="round" />

            {/* Ticks/Months */}
            {Array.from({length: 12}).map((_, i) => {
                const date = new Date(2023, i, 1);
                const x = dateToX(date);
                return (
                    <g key={i} transform={`translate(${x}, ${svgHeight/2})`}>
                        <line y1="-10" y2="10" stroke="#ccc" strokeWidth="2" />
                        <text y="25" textAnchor="middle" fontSize="10" fill="#666">{format(date, 'MMM')}</text>
                    </g>
                )
            })}

            {milestones.map((m, i) => (
                <g key={m.id} transform={`translate(${dateToX(m.date)}, ${svgHeight / 2})`}
                onPointerDown={(e) => handlePointerDown(m.id, e)}
                style={{cursor: dragging === m.id ? 'grabbing' : 'grab'}}>

                {/* Connector line */}
                <line x1="0" y1="0" x2="0" y2={i % 2 === 0 ? -30 : 50} stroke="#666" strokeWidth="1" strokeDasharray="4 2" />

                {/* Milestone Circle */}
                <circle cx="0" cy="0" r={dragging === m.id ? 10 : 8} fill={dragging === m.id ? "#2563eb" : "#3b82f6"} stroke="white" strokeWidth="2" />

                {/* Description Box */}
                <g transform={`translate(0, ${i % 2 === 0 ? -30 : 50})`}>
                     <rect x="-60" y={i % 2 === 0 ? -25 : 0} width="120" height="25" rx="4" fill="#f3f4f6" stroke="#d1d5db" />
                     <text x="0" y={i % 2 === 0 ? -8 : 17} textAnchor="middle" fontSize="12" fill="#1f2937">{m.description}</text>
                </g>
                <text x="0" y={i % 2 === 0 ? -60 : 85} textAnchor="middle" fontSize="10" fill="#6b7280">{format(m.date, 'MMM d')}</text>
                </g>
            ))}
            </svg>
        </div>
        <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded-md">Download as SVG</button>
      </div>
    </ToolPageLayout>
  );
};

export default TimelineRoadmapBuilderView;
