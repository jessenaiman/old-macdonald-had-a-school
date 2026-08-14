export type GradePathItem = {
  title: string;
  kicker: string;
  summary: string;
  icon: string;
  href?: string;
};

export type GradeTemplateProps = {
  grade: string;
  age: string;
  leadName: string;
  leadImage: string;
  leadQuote: string;
  headline: string;
  accentHeadline: string;
  summary: string;
  items: GradePathItem[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
  onPreview?: () => void;
  className?: string;
  badgeImage?: string;
};
