'use client';

import Image from 'next/image';

export function Logo({ compact = false, size }: { compact?: boolean; size?: number }) {
  const logoSize = size ?? (compact ? 48 : 88);

  return (
    <div className="flex items-center" aria-label="FIXORA">
      <Image
        src="/fxlogo.png"
        alt="FIXORA Home Repair and Maintenance"
        width={logoSize}
        height={logoSize}
        priority
        className="shrink-0 object-contain"
        style={{ width: logoSize, height: logoSize }}
      />
    </div>
  );
}
