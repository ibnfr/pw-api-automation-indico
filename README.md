![Playwright Tests](https://github.com/ibnfr/pw-ui-automation-indico/actions/workflows/playwright.yml/badge.svg)

# Playwright SauceDemo — UI Automation (JavaScript)

Automated UI tests for [SauceDemo](https://www.saucedemo.com/),
built with [Playwright](https://playwright.dev) and JavaScript.

This repository is the automation layer of a wider QA case study.

---

## Scope

6 automated test cases across 2 modules.

| Module | File | Test cases |
| --- | --- | --- |
| Authentication | `tests/auth/login.spec.js` | TC-UI-AUTH-001-1 … 001-4 |
| E2E | `tests/e2e/checkout.spec.js` | TC-UI-CHECKOUT-001-1, 001-2 |

Test IDs map can user for the manual test case document, so results can be traced
back to the original design.

---

## Why these scenarios

A scenario was automated when it met all of the following:

- Runs repeatedly in every regression cycle
- Produces a deterministic result for the same input
- Requires no visual or subjective judgement
- Does not depend on data created by another test

Scenarios that were deliberately **left manual**:

- Flows that cross user roles and require switching accounts mid-test
- Verification of data consistency between modules
- Exploratory checks where the expected behaviour is not yet confirmed
- Screens whose layout is still changing, so selectors are not yet stable


---

## Setup

Requires Node.js 18 or later.

```bash
npm install
npx playwright install
```

Create a `.env` file in the project root, using `.env.example` as a template:

```
BASE_URL=https://www.saucedemo.com
STANDARD_USERNAME=standard_user
USER_PASSWORD=secret_sauce
```

The demo credentials are published openly by OrangeHRM. They are kept in `.env`
rather than hard-coded to follow the practice that would apply to a real
environment.

---

## Running the tests

```bash
# all tests
npx playwright test

# a single file
npx playwright test tests/auth/login.spec.js

# watch the browser
npx playwright test --headed

# filter by test name
npx playwright test -g "001-1"

# open the HTML report
npx playwright show-report
```

---

## Project structure

```
playwright-orangehrm-js/
├── pages/
│   ├── LoginPage.js
│   └── CheckoutPage.js
├── tests/
│   ├── auth/
│   │   └── login.spec.js
│   └── e2e/
│       └── checkout.spec.js
├── .env.example
├── .gitignore
├── playwright.config.js
└── README.md
```

Page objects expose locators and actions only. Assertions live in the spec files,
which keeps the page objects reusable across tests with different expectations.

---

## Configuration notes

**Chromium only.** Cross-browser testing was declared out of scope in the test
plan, so the browser projects here match that decision rather than enabling all
three by default.

**One retry locally, two in CI.** The demo instance is shared and its data is
modified by other users during a run. A single retry separates genuine failures
from transient interference without masking a real regression.

**Two workers.** The shared instance throttles under heavy parallel load, which
produces timeouts that look like defects but are not.

**Artifacts on failure only.** Screenshots and video are captured on failure,
traces on the first retry. This keeps debugging information available without
inflating the repository.

---

## Notes from building this suite

**Locators avoid user data.** The profile dropdown was initially matched by the
logged-in user's name. That name belongs to an employee record other users can
edit, so it was replaced with a design-system class that does not change with
the data.

**`count()` does not wait.** Methods like `count()`, `textContent()` and
`isVisible()` read the DOM immediately, unlike `expect()` which retries. On this
Vue-based application the URL changes before the view finishes rendering, so
waiting on a visible element — not on the URL — is what makes the checks stable.

**"No Records Found" appears twice.** The application shows the message both in
the results area and in a toast notification, which triggers a strict mode
violation. The locator targets the `span` in the results area specifically.

---

## Author

Ibnu Farhan Ramadhan — QA Engineer