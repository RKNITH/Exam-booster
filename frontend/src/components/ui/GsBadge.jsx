import React from 'react';

const badgeMap = {
  GS1: 'badge-gs1',
  GS2: 'badge-gs2',
  GS3: 'badge-gs3',
  GS4: 'badge-gs4',
  Essay: 'badge-essay',
  all: 'badge-all',
};

export default function GsBadge({ paper, size = 'sm' }) {
  const cls = badgeMap[paper] || 'badge-all';
  return (
    <span className={cls}>
      {paper === 'all' ? 'All Papers' : paper}
    </span>
  );
}
