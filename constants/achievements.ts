import {Achievement} from "@/interfaces/achievement";

// Extended achievements with more milestones
export const Achievements: Achievement[] = [
  // Running achievements
  {
    name: "Półmaraton",
    description: "Przebiegnij 21 km",
    activityType: 'RUNNING',
    target: 21,
    completed: false
  },
  {
    name: "Maraton",
    description: "Przebiegnij 42 km",
    activityType: 'RUNNING',
    target: 42,
    completed: false
  },
  {
    name: "Biegowy Mistrz",
    description: "Przebiegnij 100 km",
    activityType: 'RUNNING',
    target: 100,
    completed: false
  },
  {
    name: "Ultramaratonista",
    description: "Przebiegnij 200 km",
    activityType: 'RUNNING',
    target: 200,
    completed: false
  },
  {
    name: "Biegowy Bohater",
    description: "Przebiegnij 500 km",
    activityType: 'RUNNING',
    target: 500,
    completed: false
  },
  // Swimming achievements
  {
    name: "Pływacki debiut",
    description: "Płyń 1 godzinę",
    activityType: 'SWIMMING',
    target: 60,
    completed: false
  },
  {
    name: "Pływacki mistrz",
    description: "Płyń 5 godzin",
    activityType: 'SWIMMING',
    target: 300,
    completed: false
  },
  {
    name: "Aquaman",
    description: "Płyń 10 godzin",
    activityType: 'SWIMMING',
    target: 600,
    completed: false
  },
  {
    name: "Syrena",
    description: "Płyń 20 godzin",
    activityType: 'SWIMMING',
    target: 1200,
    completed: false
  },
  {
    name: "Posejdon",
    description: "Płyń 50 godzin",
    activityType: 'SWIMMING',
    target: 3000,
    completed: false
  },
  // Cycling achievements
  {
    name: "Pierwsze 20 km",
    description: "Przejedź 20 km na rowerze",
    activityType: 'CYCLING',
    target: 20,
    completed: false
  },
  {
    name: "Rowerowy maraton",
    description: "Przejedź 42 km na rowerze",
    activityType: 'CYCLING',
    target: 42,
    completed: false
  },
  {
    name: "Rowerowy ekspert",
    description: "Przejedź 100 km na rowerze",
    activityType: 'CYCLING',
    target: 100,
    completed: false
  },
  {
    name: "Rowerowy mistrz",
    description: "Przejedź 200 km na rowerze",
    activityType: 'CYCLING',
    target: 200,
    completed: false
  },
  {
    name: "Rowerowy heros",
    description: "Przejedź 300 km na rowerze",
    activityType: 'CYCLING',
    target: 300,
    completed: false
  },
  // Climbing achievements
  {
    name: "Pierwsze 2 godziny",
    description: "Wspinaj się przez 2 godziny",
    activityType: 'CLIMBING',
    target: 120,
    completed: false
  },
  {
    name: "Wspinka",
    description: "Wspinaj się przez 5 godzin",
    activityType: 'CLIMBING',
    target: 300,
    completed: false
  },
  {
    name: "Dziki wspin",
    description: "Wspinaj się przez 10 godzin",
    activityType: 'CLIMBING',
    target: 600,
    completed: false
  },
  {
    name: "Kozica górska",
    description: "Wspinaj się przez 20 godzin",
    activityType: 'CLIMBING',
    target: 1200,
    completed: false
  },
  {
    name: "Spuder-man",
    description: "Wspinaj się przez 50 godzin",
    activityType: 'CLIMBING',
    target: 3000,
    completed: false
  },
];
