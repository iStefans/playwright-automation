# Project TODOs & Improvements

## High Priority
- [ ] Refactor InventoryPage to include all burger menu (bm-burger-button) navigation options
- [ ] Create negative test scenarios for:
  - [ ] Invalid checkout form submissions
  - [ ] Out-of-stock product handling
  - [ ] Edge case user flows

## Test Improvements
- [ ] Add visual regression tests for all critical pages
- [ ] Implement API test coverage for backend validation
- [ ] Create test cases for error states:
  - [ ] 404 pages
  - [ ] Server error handling
  - [ ] Network failure scenarios

## Code Refactoring
- [ ] Standardize all selectors to use data-test attributes
- [ ] Create base page class for common functionality
- [ ] Implement custom reporter for better test output
- [ ] Move all test data to dedicated fixtures

## Documentation
- [ ] Add JSDoc comments to all page objects
- [ ] Create test case matrix document
- [ ] Document test environment requirements

## Technical Debt
- [ ] Replace all XPath selectors with CSS/data-test alternatives
- [ ] Implement proper wait strategies (remove hardcoded waits)
- [ ] Standardize test file naming convention

## Future Features
- [ ] Cross-browser test coverage
- [ ] Performance benchmarking
- [ ] Accessibility testing