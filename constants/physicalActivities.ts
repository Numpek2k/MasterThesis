export const PhysicalActivities:  Record<PhysicalActivityKey, PhysicalActivity> = {
  RUNNING: { label: "Bieganie", ratio: 0.75 },
  SWIMMING: { label: "Pływanie", ratio: 1.3 },
  CYCLING: { label: "Jazda na rowerze", ratio: 0.5 },
  CLIMBING: { label: "Wspinaczka", ratio: 1.5 },
};

export const ActivityLabels: Record<PhysicalActivityKey, string> = {
  RUNNING: "Odległość (km)",
  SWIMMING: "Długość treningu (min.)",
  CYCLING: "Odległość (km)",
  CLIMBING: "Długość treningu (min.)",
};

export type PhysicalActivityKey = 'RUNNING' | 'SWIMMING' | 'CYCLING' | 'CLIMBING';

interface PhysicalActivity {
  label: string;
  ratio: number;
}