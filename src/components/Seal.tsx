interface SealProps {
  size?: number;
  className?: string;
}

/**
 * 印章 Logo —— 朱砂方章，内刻宋体「本」字
 * 「本」者，根也：治病必求于本（《黄帝内经·素问》）。
 * 用思源宋体特粗字重直接入印，笔画如碑刻，人人识得。
 */
export default function Seal({ size = 40, className = '' }: SealProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="中医知识库印章"
    >
      {/* 章体：朱砂底，微圆如印石 */}
      <rect x="2" y="2" width="44" height="44" rx="9" fill="hsl(var(--primary))" />
      {/* 印面内栏 */}
      <rect
        x="7.5"
        y="7.5"
        width="33"
        height="33"
        rx="5"
        stroke="hsl(40 40% 92% / 0.55)"
        strokeWidth="1"
      />
      {/* 「本」字入印 */}
      <text
        x="24"
        y="33.2"
        textAnchor="middle"
        fontSize="25"
        fontWeight="900"
        fill="hsl(40 45% 95%)"
        style={{ fontFamily: '"Noto Serif SC", "Songti SC", serif' }}
      >
        本
      </text>
    </svg>
  );
}
