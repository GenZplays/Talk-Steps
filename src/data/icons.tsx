import type { LucideIcon } from "lucide-react";
import {
  Apple,
  Backpack,
  Bed,
  Bike,
  BookOpen,
  Bus,
  Car,
  Cat,
  Clock,
  Cloud,
  Cookie,
  Dog,
  DoorOpen,
  Ear,
  Fish,
  Flower2,
  Frown,
  GlassWater,
  HandHeart,
  Heart,
  House,
  Leaf,
  Moon,
  Pencil,
  Shirt,
  Smile,
  Sun,
  TreeDeciduous,
  Utensils,
} from "lucide-react";

export const ICONS = {
  Apple,
  Backpack,
  Bed,
  Bike,
  BookOpen,
  Bus,
  Car,
  Cat,
  Clock,
  Cloud,
  Cookie,
  Dog,
  DoorOpen,
  Ear,
  Fish,
  Flower2,
  Frown,
  GlassWater,
  HandHeart,
  Heart,
  House,
  Leaf,
  Moon,
  Pencil,
  Shirt,
  Smile,
  Sun,
  TreeDeciduous,
  Utensils,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export const ICON_CHOICES = Object.keys(ICONS) as IconName[];

export function IconView({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Glyph = ICONS[name] ?? Ear;
  return <Glyph className={className} aria-hidden strokeWidth={1.75} />;
}
