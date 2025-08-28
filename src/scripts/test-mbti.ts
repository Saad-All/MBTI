import { TestValidator } from '@/lib/utils/test-validator'

console.log('Running MBTI Algorithm Validation Tests...\n')

const validator = new TestValidator()
const results = validator.runAllTests()
validator.printResults(results)

// Exit with error code if tests failed
const failedTests = results.filter(r => !r.passed)
if (failedTests.length > 0) {
  process.exit(1)
}