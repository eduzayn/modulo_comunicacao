import { createOpenAPIConfig } from '@edunexia/core';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

/**
 * OpenAPI configuration for the Communication Module
 */
const options = createOpenAPIConfig({
  moduleId: 'communication',
  title: 'Communication API',
  description: 'API for the Communication Module of the EduNexia Platform',
  version: '1.0.0',
  apis: [
    path.join(process.cwd(), 'src', 'app', 'api', 'communication', '**', '*.ts'),
    path.join(process.cwd(), 'src', 'types', '*.ts'),
  ],
});

/**
 * Generated OpenAPI specification
 */
export const spec = swaggerJsdoc(options);
