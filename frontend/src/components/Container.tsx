import React from 'react';
import { cn } from '../src/utils/cn';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('container mx-auto max-w-6xl px-4 sm:px-8', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
