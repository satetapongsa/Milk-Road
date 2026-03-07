import { createClient } from '@supabase/supabase-js';
import { products } from './src/data/products.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase URL or Key is missing.');
  console.error('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedProducts() {
  console.log('🌱 Starting to seed products...');
  
  for (const product of products) {
    console.log(`Inserting: ${product.name}`);
    const { id, ...productData } = product; // Remove original ID if you want DB to auto-generate or use the same ID
    
    // Convert specs array to JSONB
    const { data, error } = await supabase
      .from('products')
      .insert([
        { 
          id: product.id, // Forcing ID based on old data to keep things consistent
          name: product.name,
          category: product.category,
          description: product.description,
          price: product.price,
          image: product.image,
          specs: product.specs, // Supabase client auto-converts arrays/objects into JSONB
          is_active: true
        }
      ]);

    if (error) {
       console.error(`❌ Error inserting ${product.name}:`, error.message);
    } else {
       console.log(`✅ Success: ${product.name}`);
    }
  }

  console.log('🎉 Seeding completed!');
}

seedProducts();
