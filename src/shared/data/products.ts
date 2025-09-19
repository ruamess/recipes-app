import { Product } from 'entities/product/model/types'

export const products: Product[] = [
  // 🥩 Meat
  { id: 1, emoji: '🍗', name: 'Chicken', unit: 'kg', category: 'meat' },
  { id: 2, emoji: '🍖', name: 'Chicken Wings', unit: 'kg', category: 'meat' },
  { id: 3, emoji: '🍗', name: 'Chicken Legs', unit: 'kg', category: 'meat' },
  { id: 4, emoji: '🥩', name: 'Beef', unit: 'kg', category: 'meat' },
  { id: 5, emoji: '🥩', name: 'Pork', unit: 'kg', category: 'meat' },
  { id: 6, emoji: '🥩', name: 'Lamb', unit: 'kg', category: 'meat' },
  { id: 7, emoji: '🍔', name: 'Ground Beef', unit: 'kg', category: 'meat' },
  { id: 8, emoji: '🥓', name: 'Bacon', unit: 'g', category: 'meat' },
  { id: 9, emoji: '🥩', name: 'Steak', unit: 'kg', category: 'meat' },
  { id: 10, emoji: '🍖', name: 'Ribs', unit: 'kg', category: 'meat' },

  // 🐟 Fish & Seafood
  { id: 11, emoji: '🐟', name: 'Salmon', unit: 'kg', category: 'fish' },
  { id: 12, emoji: '🐟', name: 'Tuna', unit: 'kg', category: 'fish' },
  { id: 13, emoji: '🐠', name: 'Cod', unit: 'kg', category: 'fish' },
  { id: 14, emoji: '🐟', name: 'Hake', unit: 'kg', category: 'fish' },
  { id: 15, emoji: '🦐', name: 'Shrimp', unit: 'kg', category: 'fish' },
  { id: 16, emoji: '🦑', name: 'Squid', unit: 'kg', category: 'fish' },
  { id: 17, emoji: '🦀', name: 'Crab', unit: 'kg', category: 'fish' },
  { id: 18, emoji: '🦞', name: 'Lobster', unit: 'kg', category: 'fish' },
  { id: 19, emoji: '🦪', name: 'Oysters', unit: 'pcs', category: 'fish' },
  { id: 20, emoji: '🐟', name: 'Herring', unit: 'kg', category: 'fish' },

  // 🥛 Dairy & Eggs
  { id: 21, emoji: '🥛', name: 'Milk', unit: 'l', category: 'dairy' },
  { id: 22, emoji: '🥛', name: 'Kefir', unit: 'l', category: 'dairy' },
  { id: 23, emoji: '🥛', name: 'Yogurt', unit: 'ml', category: 'dairy' },
  { id: 24, emoji: '🧀', name: 'Cheese', unit: 'g', category: 'dairy' },
  { id: 25, emoji: '🥛', name: 'Sour Cream', unit: 'g', category: 'dairy' },
  { id: 26, emoji: '🥛', name: 'Cottage Cheese', unit: 'g', category: 'dairy' },
  { id: 27, emoji: '🥚', name: 'Eggs', unit: 'pcs', category: 'dairy' },
  { id: 28, emoji: '🥛', name: 'Cream', unit: 'ml', category: 'dairy' },
  { id: 29, emoji: '🧈', name: 'Butter', unit: 'g', category: 'dairy' },
  { id: 30, emoji: '🥛', name: 'Fermented Baked Milk', unit: 'ml', category: 'dairy' },

  // 🥦 Vegetables
  { id: 31, emoji: '🥔', name: 'Potato', unit: 'kg', category: 'vegetables' },
  { id: 32, emoji: '🥕', name: 'Carrot', unit: 'kg', category: 'vegetables' },
  { id: 33, emoji: '🧅', name: 'Onion', unit: 'kg', category: 'vegetables' },
  { id: 34, emoji: '🧄', name: 'Garlic', unit: 'pcs', category: 'vegetables' },
  { id: 35, emoji: '🥒', name: 'Cucumber', unit: 'pcs', category: 'vegetables' },
  { id: 36, emoji: '🍅', name: 'Tomato', unit: 'pcs', category: 'vegetables' },
  { id: 37, emoji: '🌽', name: 'Corn', unit: 'pcs', category: 'vegetables' },
  { id: 38, emoji: '🥦', name: 'Broccoli', unit: 'kg', category: 'vegetables' },
  { id: 39, emoji: '🥬', name: 'Lettuce', unit: 'pcs', category: 'vegetables' },
  { id: 40, emoji: '🍆', name: 'Eggplant', unit: 'pcs', category: 'vegetables' },

  // 🍎 Fruits
  { id: 41, emoji: '🍎', name: 'Apple', unit: 'pcs', category: 'fruits' },
  { id: 42, emoji: '🍐', name: 'Pear', unit: 'pcs', category: 'fruits' },
  { id: 43, emoji: '🍊', name: 'Orange', unit: 'pcs', category: 'fruits' },
  { id: 44, emoji: '🍋', name: 'Lemon', unit: 'pcs', category: 'fruits' },
  { id: 45, emoji: '🍌', name: 'Banana', unit: 'pcs', category: 'fruits' },
  { id: 46, emoji: '🍒', name: 'Cherry', unit: 'g', category: 'fruits' },
  { id: 47, emoji: '🍑', name: 'Peach', unit: 'pcs', category: 'fruits' },
  { id: 48, emoji: '🍉', name: 'Watermelon', unit: 'kg', category: 'fruits' },
  { id: 49, emoji: '🍇', name: 'Grapes', unit: 'g', category: 'fruits' },
  { id: 50, emoji: '🥭', name: 'Mango', unit: 'pcs', category: 'fruits' },

  // 🥫 Frozen & Other
  { id: 91, emoji: '🥟', name: 'Dumplings', unit: 'kg', category: 'frozen' },
  { id: 92, emoji: '🍕', name: 'Frozen Pizza', unit: 'pcs', category: 'frozen' },
  { id: 93, emoji: '🥞', name: 'Frozen Pancakes', unit: 'pcs', category: 'frozen' },
  { id: 94, emoji: '🍦', name: 'Ice Cream', unit: 'pcs', category: 'frozen' },
  { id: 95, emoji: '🍤', name: 'Tempura', unit: 'pcs', category: 'frozen' },
  { id: 96, emoji: '🥩', name: 'Frozen Steaks', unit: 'kg', category: 'frozen' },
  { id: 97, emoji: '🥗', name: 'Vegetable Mix', unit: 'kg', category: 'frozen' },
  { id: 98, emoji: '🍓', name: 'Frozen Berries', unit: 'kg', category: 'frozen' },
  { id: 99, emoji: '🥬', name: 'Frozen Spinach', unit: 'kg', category: 'frozen' },
  { id: 100, emoji: '🥖', name: 'Frozen Bread', unit: 'pcs', category: 'frozen' },
]
