import 'twin.macro';
import React, { HTMLAttributes, PropsWithChildren, useEffect, useState } from 'react';
import tw from 'twin.macro';

const Collapse: React.FC<
  PropsWithChildren<{
    className?: HTMLAttributes<HTMLDivElement>['className'];
    height: string | number;
    maxHeight: string | number;
    expanded: boolean;
  }>
> = ({ children, className = '', height, maxHeight, expanded }) => {
  const [localHeight, setLocalHeight] = useState<string | number>(height);

  useEffect(() => {
    if (expanded) setLocalHeight(maxHeight);
    else setLocalHeight(height);
  }, [height, maxHeight, expanded]);

  const animationClass = expanded ? tw`animate-fade-in` : tw`animate-fade-out`;

  return (
    <div
      css={[tw`transition-all duration-200 overflow-hidden`, animationClass]}
      style={{ height: localHeight, maxHeight }}
    >
      {children}
    </div>
  );
};

export default Collapse;
