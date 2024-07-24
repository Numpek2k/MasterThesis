import {NutritionSimpleItem} from "@/interfaces/nutritionInfo";

export interface NutritionJournal{
  journal: NutritionDay[]
}

export interface NutritionDay{
  date: string
  items: NutritionSimpleItem[]
}


export const nutritionJournalTestData: NutritionJournal ={
  "journal": [
    {
      "date": "14-07-2024",
      "items": [
        {
          "name": "Kotlet Schabowy 14",
          "calories": 208.6,
          "serving_size_g": 100,
          "fat_total_g": 11.2,
          "protein_g": 25.4,
          "carbohydrates_total_g": 0,
        },
        {
          "name": "tomato",
          "calories": 18.2,
          "serving_size_g": 100,
          "fat_total_g": 0.2,
          "protein_g": 0.9,
          "carbohydrates_total_g": 3.9,
        },
        {
          "name": "potato",
          "calories": 92.7,
          "serving_size_g": 100,
          "fat_total_g": 0.1,
          "protein_g": 2.5,
          "carbohydrates_total_g": 21,
        }
      ]
    },
    {
      "date": "15-07-2024",
      "items": [
        {
          "name": "Kotlet Schabowy 15",
          "calories": 208.6,
          "serving_size_g": 100,
          "fat_total_g": 11.2,
          "protein_g": 25.4,
          "carbohydrates_total_g": 0,
        },
        {
          "name": "tomato",
          "calories": 18.2,
          "serving_size_g": 100,
          "fat_total_g": 0.2,
          "protein_g": 0.9,
          "carbohydrates_total_g": 3.9,
        },
        {
          "name": "potato",
          "calories": 92.7,
          "serving_size_g": 100,
          "fat_total_g": 0.1,
          "protein_g": 2.5,
          "carbohydrates_total_g": 21,
        }
      ]
    },
    {
      "date": "16-07-2024",
      "items": [
        {
          "name": "Kotlet Schabowy 16",
          "calories": 208.6,
          "serving_size_g": 100,
          "fat_total_g": 11.2,
          "protein_g": 25.4,
          "carbohydrates_total_g": 0,
        },
        {
          "name": "tomato",
          "calories": 18.2,
          "serving_size_g": 100,
          "fat_total_g": 0.2,
          "protein_g": 0.9,
          "carbohydrates_total_g": 3.9,
        },
        {
          "name": "potato",
          "calories": 92.7,
          "serving_size_g": 100,
          "fat_total_g": 0.1,
          "protein_g": 2.5,
          "carbohydrates_total_g": 21,
        }
      ]
    }
  ]
}