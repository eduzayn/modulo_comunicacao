import { beforeAll } from 'vitest';
import dotenv from 'dotenv';

beforeAll(() => {
  // Load environment variables
  dotenv.config();
  
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Set test API URL
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';
  
  // Set test database URL if needed
  // process.env.DATABASE_URL = 'your-test-database-url';
});
