import React from 'react';

export function SkeletonLine({ w = 'w-full', h = 'h-4' }) {
  return <div className={`skeleton ${w} ${h} rounded`} />;
}

export function SkeletonCard() {
  return (
    <div className="card space-y-4">
      <SkeletonLine h="h-6" w="w-3/4" />
      <SkeletonLine h="h-4" w="w-1/3" />
      <div className="space-y-2">
        <SkeletonLine />
        <SkeletonLine />
        <SkeletonLine w="w-4/5" />
      </div>
    </div>
  );
}

export function SkeletonResult() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card space-y-4">
        <SkeletonLine h="h-8" w="w-1/2" />
        <div className="flex gap-2">
          <SkeletonLine h="h-6" w="w-16" />
          <SkeletonLine h="h-6" w="w-20" />
        </div>
        <SkeletonLine />
        <SkeletonLine />
        <SkeletonLine w="w-3/4" />
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="card space-y-3">
          <SkeletonLine h="h-6" w="w-2/5" />
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine w="w-4/5" />
        </div>
      ))}
    </div>
  );
}
