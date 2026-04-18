# AdminPart — backend API integration

All endpoints live under `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:5000/api/v1`).
Auth tokens are attached automatically by the Axios instance in `src/lib/api.ts`.

## Architecture

Each feature module follows the `api/ → hooks/ → component/` pattern:

```
AdminPart/
├── Dashboard/
│   ├── api/      dashboard.api.ts
│   ├── hooks/    useDashboard.ts
│   ├── types/    dashboard.types.ts
│   └── component/Dashboard.tsx
│
├── Administration/
│   ├── api/      administrator.api.ts, teacher.api.ts, student.api.ts
│   ├── hooks/    useAdministrators.ts, useTeachers.ts, useStudents.ts
│   ├── types/    administrator.types.ts
│   └── component/...
│
└── Settings/
    ├── api/      aboutAndTerm.api.ts, featuresAndQuestions.api.ts
    ├── hooks/    useAboutAndTerm.ts, useFeaturesAndQuestions.ts
    ├── types/    settings.types.ts
    └── component/AboutUs.tsx, TermsConditions.tsx, ...
```

Conventions:

- **api/** — one file per backend resource. Each function is a thin Axios wrapper that extracts `data.data` from the standard `sendResponse` envelope.
- **hooks/** — one file per resource grouping. Queries use stable `queryKey` arrays; mutations invalidate the relevant query keys on success.
- **types/** — response envelopes mirror the backend shape (`{ success, message, data }`).
- **component/** — consumes hooks; handles `isLoading` / `isError` states locally.

## Endpoint map

### Dashboard (`/admin/dashboard`)

| UI                | Hook                    | Endpoint                              |
| ----------------- | ----------------------- | ------------------------------------- |
| Stat cards        | `useUserStats`          | `GET /dashboard/stats`                |
| Students donut    | `useStudentGenderStats` | `GET /dashboard/stats/student-gender` |
| Administrator row | `useAdministrators`     | `GET /users/administrators`           |

### Administration (`/admin/administration`)

| UI                        | Hook                          | Endpoint                                               |
| ------------------------- | ----------------------------- | ------------------------------------------------------ |
| Admin cards               | `useAdministrators`           | `GET /users/administrators`                            |
| Create admin              | `useCreateAdministrator`      | `POST /users/register` (multipart, role=administrator) |
| Edit admin profile        | `useUpdateAdministrator`      | `PUT /users/:id`                                       |
| Toggle active state       | `useToggleAdministratorState` | `PUT /users/:id` with `{ state }`                      |
| Teachers list (slug view) | `useTeachers`                 | `GET /users/my-teachers`                               |
| Students list (slug view) | `useStudents`                 | `GET /users/my-students`                               |

Teacher/student **profile** pages (grades, quizzes, behaviors, etc.) still use mock data in `teacher.api.ts` because the backend has no aggregate endpoints for them yet. Each mock is marked with a `TODO: backend —` comment describing the expected future endpoint.

### Settings (`/admin/settings`)

| UI                    | Hook                    | Endpoint                                           |
| --------------------- | ----------------------- | -------------------------------------------------- |
| About Us (view)       | `useAbout`              | `GET /aboutAndTerm/about`                          |
| About Us (first save) | `useCreateAboutOrTerm`  | `POST /aboutAndTerm/create` with `docType="about"` |
| About Us (update)     | `useUpdateAboutOrTerm`  | `PUT /aboutAndTerm/update/:id`                     |
| Terms (view)          | `useTerms`              | `GET /aboutAndTerm/terms`                          |
| Terms (first save)    | `useCreateAboutOrTerm`  | `POST /aboutAndTerm/create` with `docType="terms"` |
| Terms (update)        | `useUpdateAboutOrTerm`  | `PUT /aboutAndTerm/update/:id`                     |
| App features          | `useAppFeatures`        | `GET /featuresAndQuestions/AppFeatures`            |
| FAQs                  | `useFAQs`               | `GET /featuresAndQuestions/FAQquestions`           |
| Create feature / FAQ  | `useCreateFeatureOrFAQ` | `POST /featuresAndQuestions/create`                |
| Update feature / FAQ  | `useUpdateFeatureOrFAQ` | `PUT /featuresAndQuestions/update/:id`             |

## Auth requirements

- `GET /users/my-students`, `GET /users/my-teachers` — require `authorizeRoles("administrator")` on the backend. The hook only returns data when the logged-in user is an administrator.
- `GET /dashboard/stats` and `GET /dashboard/stats/student-gender` — require `protect` (any authenticated user).
- `GET /users/administrators` is currently public on the backend; the hook still includes the auth header via the shared Axios interceptor.

## Adding a new admin endpoint

1. Add the response/payload types in the feature's `types/*.types.ts`.
2. Add a thin fetch function in `api/*.api.ts` that returns `data.data`.
3. Add a `useX` hook (query) or `useXMutation` hook (mutation) with a stable `queryKey` and `invalidateQueries` on success.
4. Consume the hook from the component and render `isLoading` / `isError`.
5. Update the endpoint map above.
