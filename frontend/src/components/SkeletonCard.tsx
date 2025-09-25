import React from 'react';
import { cn } from '../src/utils/cn';

interface SkeletonCardProps {
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'group relative flex h-full flex-col items-center rounded-lg border border-border bg-card p-6 text-center',
        className
      )}
    >
      <div className="mb-4 h-12 w-12 rounded-md bg-muted/50 animate-pulse" />
      <div className="h-5 w-3/4 rounded-md bg-muted/50 animate-pulse mb-2" />
      <div className="h-4 w-full rounded-md bg-muted/50 animate-pulse" />
      <div className="h-4 w-1/2 rounded-md bg-muted/50 animate-pulse mt-1" />
    </div>
  );
};

export default SkeletonCard;
