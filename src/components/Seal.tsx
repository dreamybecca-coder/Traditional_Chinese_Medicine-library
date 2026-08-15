interface SealProps {
  size?: number;
  className?: string;
}

/**
 * 印章 Logo —— 朱砂方章，内刻小篆笔意「本」字
 * 「本」者，根也：治病必求于本（《黄帝内经·素问》）。
 * 篆书写法：一树擎天，三笔根须扎底——木之有根，人之有本。
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
      {/* 章体：朱砂底，边缘微圆如印石 */}
      <rect x="2" y="2" width="44" height="44" rx="9" fill="hsl(var(--primary))" />
      {/* 印面内栏（残边意趣：上细下略粗） */}
      <path
        d="M8.5 12 Q8.5 8.5 12 8.5 L36 8.5 Q39.5 8.5 39.5 12 L39.5 36 Q39.5 39.5 36 39.5 L12 39.5 Q8.5 39.5 8.5 36 Z"
        stroke="hsl(40 40% 92% / 0.5)"
        strokeWidth="1"
        fill="none"
      />
      {/* 小篆「本」 */}
      <g
        stroke="hsl(40 45% 95%)"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* 中竖：自顶贯底，中锋行笔 */}
        <path d="M24 10.5 C23.8 17 23.8 25 24 33" />
        {/* 弧横：两端微垂，篆意圆转 */}
        <path d="M13.5 18.5 Q24 22 34.5 18.5" />
        {/* 左撇：自交点徐出，婉转下行 */}
        <path d="M23.2 19.5 Q18.5 25 13.5 30.5" />
        {/* 右捺：与撇相称，舒展有度 */}
        <path d="M24.8 19.5 Q29.5 25 34.5 30.5" />
        {/* 三根：本之所指，根也 */}
        <path d="M18.5 31.5 L16.5 36.5" />
        <path d="M24 33 L24 38" strokeWidth="2.6" />
        <path d="M29.5 31.5 L31.5 36.5" />
      </g>
    </svg>
  );
}
