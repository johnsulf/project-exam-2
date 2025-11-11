# QA Checklist

This checklist covers high-impact flows for Holidaze. Should run before each release or when major related changes land.

## Authentication

- [ ] Launch the site and log out of any existing session.
- [ ] Navigate to **/auth/login** and verify the "Welcome back" copy renders with the login form.
- [ ] Attempt to submit the form with empty fields and confirm validation messages appear.
- [ ] Sign in with a valid stud.noroff.no account and confirm the dashboard/profile loads without errors.
- [ ] Use the account menu to sign out, then refresh the page to ensure the session is cleared.

## Booking

- [ ] Open a venue I have made to ensure it exist.
- [ ] Select a valid date range and adjust the guest count within the allowed max.
- [ ] Submit the booking and confirm the success toast displays and the reservation appears under **My bookings**.
- [ ] Attempt to book a date range that overlaps an existing reservation and verify an error message is shown.
- [ ] While signed out, click **Sign in to book** and ensure you are redirected to the login page with a return link back to the venue.

## Venue Management

- [ ] Sign in with a venue manager account and open the **Manage venues** area.
- [ ] Create a new venue with images, amenities, and pricing; verify the success toast appears and the venue shows in your list.
- [ ] Edit an existing venue, change pricing and amenities, and confirm the updates persist after a refresh.
- [ ] Delete a venue and ensure it is removed from the list without errors.
- [ ] Trigger an error state (e.g., disconnect from the network before saving) and confirm the error toast displays helpful messaging.

## Regression Smoke

- [ ] Load the home page and confirm featured venues render without layout issues.
- [ ] Search for a venue by city and ensure the results update along with the "results" counter.
- [ ] From the venues list, open a venue detail page and verify gallery images and amenities render correctly.
- [ ] Navigate to a user profile page and verify bookings and venues tabs load their content.
- [ ] View the site on a mobile viewport to confirm navigation, search, and booking actions remain usable.

Document any failures, including console/network errors, with screenshots before handing the build off for release.
