import type { Category } from '@/types';

const CATEGORY_COLORS: Record<Category, string> = {
  office: 'bg-blue-100 text-blue-700',
  comic: 'bg-purple-100 text-purple-700',
  ecommerce: 'bg-emerald-100 text-emerald-700',
};

const CATEGORY_EMOJI: Record<Category, string> = {
  office: '💼',
  comic: '🎬',
  ecommerce: '🛍️',
};

const ICON_EMOJI: Record<string, string> = {
  Briefcase: '💼',
  Clapperboard: '🎬',
  ShoppingBag: '🛍️',
  Layers: '🔗',
  Sparkles: '✨',
  Globe: '🌐',
  ShieldAlert: '🔞',
  ShieldCheck: '🛡️',
  Video: '🎥',
  Film: '🎞️',
  Code2: '💻',
  Bot: '🤖',
  Cloud: '☁️',
  MessageSquare: '💬',
  FileText: '📄',
  Mic: '🎤',
  NotebookPen: '📓',
  Brain: '🧠',
  Image: '🖼️',
  Play: '▶️',
  MonitorPlay: '📺',
  Zap: '⚡',
  Palette: '🎨',
  LayoutTemplate: '📐',
  Paintbrush: '🖌️',
  Scissors: '✂️',
  Frame: '🖼️',
  Figma: '◆',
};

interface ToolIconProps {
  icon: string;
  name: string;
  category?: Category;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-9 w-9 text-base',
  md: 'h-11 w-11 text-lg',
  lg: 'h-14 w-14 text-xl',
};

export function ToolIcon({
  icon,
  name,
  category,
  size = 'md',
  className = '',
}: ToolIconProps) {
  const emoji = ICON_EMOJI[icon] ?? name.charAt(0);
  const colorClass = category
    ? CATEGORY_COLORS[category]
    : 'bg-primary/10 text-primary';

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl font-semibold ${sizeClasses[size]} ${colorClass} ${className}`}
      aria-hidden
    >
      {emoji}
    </div>
  );
}

export function CategoryIcon({
  category,
  icon,
  className = '',
}: {
  category: Category;
  icon: string;
  className?: string;
}) {
  const emoji = ICON_EMOJI[icon] ?? CATEGORY_EMOJI[category];
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${CATEGORY_COLORS[category]} ${className}`}
    >
      {emoji}
    </div>
  );
}
