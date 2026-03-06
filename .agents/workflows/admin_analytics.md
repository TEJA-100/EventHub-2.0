# Admin Analytics Workflow
---
description: Create admin analytics dashboard with charts and Excel export, and prevent admins from registering for events.
---
1. **Update Registration API**: Modify `app/api/events/[id]/route.ts` POST handler to reject registrations when the authenticated user has role `COLLEGE_ADMIN`.
2. **Create Analytics API**: Add `app/api/admin/analytics/route.ts` that aggregates registration data per event (total registrations, breakdown by college, student details) and returns JSON suitable for charting and CSV export.
3. **Add CSV Export Endpoint**: In the same API, provide a `GET /export` that streams an Excel/CSV file of the aggregated data.
4. **Install Chart Library**: Add `chart.js` (or lightweight alternative) to the project dependencies.
5. **Build Admin Dashboard UI**:
   - Create `components/AdminAnalytics.tsx` that fetches data from the analytics API and renders a pie chart (registrations per event) and a bar chart (registrations per college).
   - Include a "Download Excel" button that calls the export endpoint.
   - Integrate this component into `app/college/page.tsx` (admin dashboard).
6. **Style Charts**: Use the existing glassmorphism theme and ensure responsiveness.
7. **Test**: Verify that students can register, admins cannot, and analytics display correct data with export working.
