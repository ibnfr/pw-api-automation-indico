![Playwright Tests](https://github.com/ibnfr/pw-api-automation-indico/actions/workflows/playwright.yml/badge.svg)

# Playwright PetStore Swagger — API Automation (JavaScript)

Automated API tests for [PetStore Swagger](https://petstore.swagger.io/#/),
built with [Playwright](https://playwright.dev) and JavaScript.

This repository is the automation layer of a wider QA case study.

---

## Scope

14 automated test cases across 2 modules.

| Module | File | Test cases |
| --- | --- | --- |
| api | `tests/api/petstore.spec.js` | TC-API-001 … 014 |

Test IDs map can user for the manual test case document, so results can be traced
back to the original design.

---

## Why these scenarios

A scenario was automated when it met all of the following:

- Runs repeatedly in every regression cycle
- Produces a deterministic result for the same input
- Requires no visual or subjective judgement
- Data flow covers complete lifecycle (Create, Read, Delete)

Scenarios that were deliberately **left manual / out of scope**:

- Performance and Load testing under heavy parallel request spikes
- Advanced security/penetration testing on the endpoints
- Verification of token expiration periods for private endpoints


---

## Setup

Requires Node.js 18 or later.

```bash
npm install
npx playwright install
```

Create a `.env` file in the project root, using `.env.example` as a template:

```
BASE_URL=https://petstore.swagger.io/v2/pet
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
npx playwright test -g "001"

# open the HTML report
npx playwright show-report
```

---

## Project structure

```
pw-api-automation-indico/
├── tests/
│   └── api/
│       └── petstore.spec.js
├── .env.example
├── .gitignore
├── playwright.config.js
└── README.md
```

All API request definitions, endpoints lifecycle handling, and response data assertions live inside the spec file to keep sequential dependency clear and logical.

---

## Configuration notes

**API-Only Execution.** Browser project contexts (Chromium, Firefox, WebKit) are optimized or skipped inside `playwright.config.js` since API testing interacts directly with the network layers.

**Sequential Execution (Serial Mode).** The suite uses `test.describe.configure({ mode: 'serial' })` inside the spec file. This prevents Playwright from running the tests in parallel, ensuring that `DELETE` and `GET` requests successfully capture the temporary ID created by the preceding `POST` request.

**Artifacts on failure.** Console network logs and API traces are captured on failure to facilitate quick debugging without inflating the repository size.

---

## Notes from building this suite

**Dynamic Unique IDs prevent 404 Race Conditions.** The public Swagger PetStore API is volatile and shared globally. To prevent data from being overwritten or instantly cleared by other public workflows between our `POST` and `DELETE` requests, the suite implements a dynamic random ID generator (`Math.random()`) for each test run.

**Identified Data Validation Inconsistency (Bug/Defect).** During negative testing where a `string` was intentionally sent into the integer `id` field, a strict contrast was observed. Manual clients (Postman) gracefully returned `400 Bad Request`, whereas standard automation HTTP clients triggered a fatal unhandled backend crash, returning a `500 Internal Server Error` with `something bad happened` message. The test script asserts this actual 500 outcome to preserve honesty in reporting backend validation limits.

---

## 📊 Test Execution Report (API Test)

**Date of Execution:** October 20, 2026
**Automation Tool:** Playwright API Request (JavaScript)

### a. Summary
*   **Total Test Cases:** 14
*   **Pass:** 9
*   **Pass with Note:** 1
*   **Fail:** 4

### b. Pass Rate
*   **71.43% Pass Rate** (Calculated based on Pass and Pass with Note status)

### c. Defect / Bug List
Terdapat **4 skenario failed** pada pengujian validasi input negatif dengan rincian ID berikut:
*   **TC-API-006** (Invalid POST request - Empty Body)
*   **TC-API-007** (Invalid POST request - Missing Name)
*   **TC-API-008** (Invalid POST request - String on Integer ID)
*   **TC-API-009** (Invalid POST request - Invalid Status Value)

*Note: Bukti tangkapan layar (capture) respons error 500/data lolos serta catatan pengujian mendalam untuk masing-masing defect di atas telah dilampirkan secara lengkap di dalam dokumen master test case.*

---

## Author

Ibnu Farhan Ramadhan — QA Engineer