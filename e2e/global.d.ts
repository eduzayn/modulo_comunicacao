import { Page } from '@playwright/test';

declare global {
  namespace PlaywrightTest {
    interface Page extends Page {
      // Extensões personalizadas do Page, se necessário
    }
  }
} 