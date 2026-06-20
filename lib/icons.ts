/**
 * Mapa de iconos para categorías. Importamos explícitamente cada icono de
 * lucide-react para evitar fallos por nombres dinámicos inexistentes y para
 * que el tree-shaking funcione.
 */
import {
  HardHat,
  Bath,
  Zap,
  Droplet,
  Paintbrush,
  Wind,
  Building2,
  DoorOpen,
  Home,
  Layers,
  Sun,
  PencilRuler,
  Ruler,
  ClipboardCheck,
  Factory,
  KeyRound,
  Grid2X2,
  Trees,
  Sparkles,
  ShieldCheck,
  Wrench,
  Truck,
  Hammer,
  BellRing,
  type LucideIcon,
} from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  HardHat,
  Bath,
  Zap,
  Droplet,
  Paintbrush,
  Wind,
  Building2,
  DoorOpen,
  Home,
  Layers,
  Sun,
  PencilRuler,
  Ruler,
  ClipboardCheck,
  Factory,
  KeyRound,
  Grid2X2,
  Trees,
  Sparkles,
  ShieldCheck,
  Wrench,
  Truck,
  Hammer,
  BellRing,
};

export function getCategoryIcon(name: string): LucideIcon {
  return categoryIcons[name] ?? HardHat;
}
