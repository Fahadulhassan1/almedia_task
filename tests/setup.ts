// Test setup file
import 'reflect-metadata';

// Mock console methods to avoid clutter in test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
