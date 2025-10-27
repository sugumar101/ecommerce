import { db } from '../db';
import { products } from '../db/schema';

const nikeProducts = [
  {
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 delivers visible Air cushioning from heel to toe for all-day comfort and style.',
    price: '150.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/air-max-270-mens-shoes-KkLcGR.png',
    category: 'Sneakers',
    brand: 'Nike',
    stock: 25,
  },
  {
    name: 'Nike Air Force 1',
    description: 'The radiance lives on in the Nike Air Force 1 \'07, the basketball original that puts a fresh spin on what you know best.',
    price: '110.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-jBrhbr.png',
    category: 'Sneakers',
    brand: 'Nike',
    stock: 30,
  },
  {
    name: 'Nike Dunk Low',
    description: 'Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns with crisp overlays and original team colors.',
    price: '100.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/dunk-low-mens-shoes-DDPY4T.png',
    category: 'Sneakers',
    brand: 'Nike',
    stock: 20,
  },
  {
    name: 'Nike React Infinity Run Flyknit 3',
    description: 'A comfortable, reliable shoe that\'s engineered to help keep you running. No matter your goals or skill level.',
    price: '160.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/react-infinity-run-flyknit-3-mens-road-running-shoes-ZQDvZD.png',
    category: 'Running',
    brand: 'Nike',
    stock: 15,
  },
  {
    name: 'Nike Blazer Mid \'77 Vintage',
    description: 'In the \'70s, Nike was the new shoe on the block. So new in fact, we were still breaking into the basketball scene.',
    price: '100.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/blazer-mid-77-vintage-mens-shoes-nw30B2.png',
    category: 'Sneakers',
    brand: 'Nike',
    stock: 18,
  },
  {
    name: 'Nike Air Jordan 1 Low',
    description: 'Inspired by the original that debuted in 1985, the Air Jordan 1 Low offers a clean, classic look that\'s familiar yet fresh.',
    price: '90.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/air-jordan-1-low-shoes-6Q1tFM.png',
    category: 'Sneakers',
    brand: 'Nike',
    stock: 22,
  },
];

export async function seedProducts() {
  try {
    console.log('Seeding products...');
    await db.insert(products).values(nikeProducts);
    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}