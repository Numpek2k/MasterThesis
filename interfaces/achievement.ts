import {PhysicalActivityKey} from "@/constants/physicalActivities";

export interface Achievement {
  name: string
  description: string
  activityType?: PhysicalActivityKey
  target: number
  completed: boolean
}