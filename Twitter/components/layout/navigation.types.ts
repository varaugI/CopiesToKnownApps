import type { LucideIcon } from "lucide-react";

export interface TwitterNavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  active?: boolean;
  badge?: number | string;
  badgeLabel?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface TwitterHeaderAction {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
  disabled?: boolean;
  onSelect: () => void;
}
