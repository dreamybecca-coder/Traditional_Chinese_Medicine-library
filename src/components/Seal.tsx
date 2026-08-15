interface SealProps {
  size?: number;
  className?: string;
}

/**
 * 印章 Logo —— 朱砂方章，内刻篆文「本」字
 * 「本」者，根也：治病必求于本（《黄帝内经·素问》）。
 * 字形依《说文》篆书本义：一木擎天，上生双枝，冠覆如盖，
 * 中贯一横，直下归根——参照中研院汉字字形演变字形摹写。
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
      {/* 篆文「本」——依中研院字形摹写 */}
      <g
        stroke="hsl(40 45% 95%)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      >
        {/* 中干：一贯到底 */}
        <path d="M24 9.5 L24 38.5" />
        {/* 左枝：自分杈处上扬外展 */}
        <path d="M24 15.5 Q19.5 14 17.8 8.5" />
        {/* 右枝：与左相称 */}
        <path d="M24 15.5 Q28.5 14 30.2 8.5" />
        {/* 冠盖：覆于中干如穹 */}
        <path d="M14 31 C14 22.5 18.2 18.8 24 18.8 C29.8 18.8 34 22.5 34 31" />
        {/* 中横：冠下贯干 */}
        <path d="M16.5 26 L31.5 26" />
      </g>
    </svg>
  );
}
