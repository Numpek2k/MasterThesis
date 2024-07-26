import {PhysicalActivityKey} from "@/constants/physicalActivities";

export interface ActivityJournal{
  journal: ActivityDay[]
}

export interface ActivityDay{
  date: string
  dailySteps: number
  items: ActivityItem[]
}

export interface ActivityItem{
  id: string
  type: PhysicalActivityKey
  amount: number
  points: number
}

export type UpdateJournalFunction = (updatedJournal: ActivityJournal) => Promise<void>;