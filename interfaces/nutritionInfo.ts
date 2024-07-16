export interface NutritionItem {
  name: string;
  calories: number;
  serving_size_g: number,
  fat_total_g: number,
  fat_saturated_g: number,
  protein_g: number,
  sodium_mg: number,
  potassium_mg: number,
  cholesterol_mg: number,
  carbohydrates_total_g: number,
  fiber_g: number,
  sugar_g: number
  [key: string]: any; // Additional properties that might be returned by the API
}

export interface NutritionInfo {
  items: NutritionItem[];
}

export const nutritionTestData: NutritionInfo = {
  "items": [
    {
      "name": "pork chop",
      "calories": 208.6,
      "serving_size_g": 100,
      "fat_total_g": 11.2,
      "fat_saturated_g": 3.5,
      "protein_g": 25.4,
      "sodium_mg": 53,
      "potassium_mg": 221,
      "cholesterol_mg": 82,
      "carbohydrates_total_g": 0,
      "fiber_g": 0,
      "sugar_g": 0
    },
    {
      "name": "tomato",
      "calories": 18.2,
      "serving_size_g": 100,
      "fat_total_g": 0.2,
      "fat_saturated_g": 0,
      "protein_g": 0.9,
      "sodium_mg": 4,
      "potassium_mg": 23,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 3.9,
      "fiber_g": 1.2,
      "sugar_g": 2.6
    },
    {
      "name": "potato",
      "calories": 92.7,
      "serving_size_g": 100,
      "fat_total_g": 0.1,
      "fat_saturated_g": 0,
      "protein_g": 2.5,
      "sodium_mg": 10,
      "potassium_mg": 70,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 21,
      "fiber_g": 2.2,
      "sugar_g": 1.2
    }
  ]
}