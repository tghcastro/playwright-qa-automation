# Test Strategy

This strategy aims to provide robustness, clarity, and long-term maintainability, ensuring that tests serve as both automated checks and reliable documentation of system behavior. This reflects the way I would set up a test automation framework from scratch.


## About the Framework (Playwright)

The chosen framework for this project is Playwright with JavaScript. The decision to use Playwright comes from previous experience where a Proof of Concept was carried out comparing Playwright and Cypress. Both tools proved to be powerful, but Playwright stood out for being easier to develop with, providing everything needed out-of-the-box without relying on additional plugins. Its support tools, such as the Trace Viewer, also offered excellent insights during execution and debugging. Since then, Playwright has become my preferred choice whenever possible in new projects.

## Project Architecture

The test strategy is based on a layered design that balances simplicity and maintainability. The Page Object Model encapsulates the interaction logic with the application’s UI, ensuring a clear separation of concerns and making the test code easier to maintain as the system evolves. On top of that, an orchestration layer groups together contextual steps that can be reused across different test cases. For instance, actions like creating a user or performing a login are often prerequisites for other scenarios, and encapsulating them avoids duplication while keeping the test flow easy to read. By combining page objects with orchestration, the test cases remain expressive and focused on high-level behavior rather than technical details.

## Allure Reporting

Allure reporting adds another important layer of visibility. It not only displays historical execution data but also acts as structured logging. With the Base Page implementation, low-level interactions are automatically recorded as steps, and when grouped with orchestration-level steps, the resulting report provides a clear and detailed trace of the execution. This significantly improves observability and helps identify issues quickly.

## Critical QA Eye – Front-end Testability Improvements

One simple and important improvement would be the consistent use of test-friendly attributes in the DOM, such as `data-testid`. Currently, automated locators must often rely on CSS selectors / XPath or visible text, which can break easily when the UI changes. Providing stable, semantic attributes dedicated to testing would greatly increase test resilience and reduce maintenance effort.

Also, improving error handling and user feedback states would make automated validation more robust. For example, consistent error banners, toast messages, or field validation markers provide reliable hooks for automated checks and ensure that system behavior is clearly visible when something goes wrong. Currently, in the Login page, the application uses both a "Card Message" and the browser’s native message, while in the Search functionality, when a non-existent user is queried, only the table header is displayed with no feedback. Establishing a unified and consistent approach across the application would significantly improve testability and user experience

Another improvement, in case of Microservices Architecture, would be the introduction of a dedicated component testing layer. By decoupling front-end component from the back-end through mocks or stubs, it would be possible to test the UI in isolation. This would provide full control over the data being displayed, reduce dependencies on runtime environments, and significantly improve reliability. With fixed data in mocks, it would also be easier to implement Visual Regression Testing to detect even small UI glitches. In summary, this would lead to faster execution, higher coverage, and more stable pipelines while still keeping end-to-end tests for User Acceptance and integrated flows.

## Automated Tests

Firstly, I created the basic structure for the project in the main branch. This includes the Playwright project setup along with some development tools such as Linter, Allure, and DotEnv. I also added a Consts.js file to centralize constant values, which are commonly needed in test projects, as well as a Base Page Object. The Base Page is designed to automatically create Allure steps, via prototype inheritance, for all Page Objects that extend it. This ensures consistent reporting and improves traceability during test execution.

### Task 1 - Log In

For the first task, I created the tests, Page Objects, and the orchestration layer. Since login is the entry point of the application, no additional framework evolution was required at this stage beyond establishing the foundation for the test structure.

[PR Link](https://github.com/tghcastro/playwright-qa-automation/pull/2)

### Task 2 - Search/List

This task brought further improvements to the framework, which started to take shape more clearly.

Because it depends on a logged-in user and reused code from Task 1, I began the branch by including the same commits that implemented the related Page Objects and orchestration.

A Global Setup and Fixtures were also introduced to allow tests to reuse an authenticated session. This way, regardless of how many Search scenarios are executed, the login process is performed only once and reused, making the suite both faster and more focused. Initially, I created two fixtures, AuthenticatedPage and UnAuthenticatedPage, which can be reused across different tests, including those from Task 1.

The first scenario currently fails, since the description states that after signing in the user list should be displayed, but in practice it is not. I kept this validation in the test so the behavior is correctly documented and the failure is visible.

As requested in the detailed test cases, additional validations were implemented in the scenarios. One key improvement was the conversion of the table data into a JSON object, making assertions simpler, more flexible, and easier to maintain.

[PR Link](https://github.com/tghcastro/playwright-qa-automation/pull/3)


