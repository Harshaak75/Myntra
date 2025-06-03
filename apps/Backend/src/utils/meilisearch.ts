import axios from 'axios';
import { melli_key, melli_url } from '../config';

const meili = axios.create({
  // baseURL: 'http://localhost:7700/indexes/products',
  baseURL: melli_url,
  
  headers: {
    Authorization: `Bearer ${melli_key}`,
    'Content-Type': 'application/json',
  },
});

export const syncProductsToMeilisearch = async (products: any[]) => {
  console.log(products)
  try {
    const res = await axios.post(
      `${melli_url}/indexes/product/documents?primaryKey=id`,
      products,
      {
        headers: {
          Authorization: `Bearer ${melli_key}`,
          "Content-Type": 'application/json',
        },
      }
    );
    console.log('Synced to Meilisearch:', res.data);
  } catch (err) {
    console.error('Failed to sync with Meilisearch:', err);
  }
};

export const deleteProductFromMeilisearch = async (id: number) => {
  try {
    const res = await meili.delete(`/documents/${id}`);
    console.log('Deleted from Meilisearch:', res.data);
  } catch (err) {
    console.error('Failed to delete from Meilisearch:', err);
  }
};

export const searchProducts = async (query: string) => {
  try {
    const res = await meili.post('/search', { q: query });
    console.log('Search results:', res.data.hits);
    return res.data.hits;
    
  } catch (err) {
    console.error('Search failed:', err);
  }
};


