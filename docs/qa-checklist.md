# QA Checklist

This checklist covers high-impact flows for Holidaze. Should run before each release or when major related changes land.

## Authentication

- [ ] Ensure the session is cleared (use the profile menu if it is already visible to sign out).
- [ ] From the home page, open the **Sign in or register** link and confirm the login view renders the “Welcome back” messaging.
- [ ] Submit the form with empty fields to confirm the “Enter a valid email” and “Password must be at least 6 characters” validations display.
- [ ] Sign in with a valid stud.noroff.no account and verify you land back on the home page.
- [ ] Open the profile menu, navigate to **Profile**, then sign out and confirm you return to **/auth/login** with the sign-in link visible again.

## Booking

- [ ] Start signed out, open a public venue, and confirm the CTA reads **Sign in to book**.
- [ ] Click the CTA to ensure you are redirected to the login page, then sign in and verify you are routed back to the same venue with the button reading **Book now**.
- [ ] With no dates selected, make sure **Book now** stays disabled.
- [ ] Select two available dates and confirm the button enables.
- [ ] Click **Book now** and verify the **Confirm booking** dialog opens; cancel out to ensure the dialog closes cleanly.

## Venue Management

- [ ] Sign in with the venue manager account, open the profile menu, and confirm the **Venue Manager** badge plus the **Manage venues** menu item appear.
- [ ] Go to **Manage venues**, pick a venue’s **Manage** link, and verify the detail view loads.
- [ ] Open the **Delete** dialog and cancel it to ensure the confirmation sheet closes without deleting the venue.
- [ ] Use the **Edit** link, confirm the edit form loads, then cancel to return to the dashboard.
- [ ] Open a venue’s **Bookings** link, confirm the bookings page renders, and navigate back to the dashboard.
- [ ] Use the **Create venue** link, attempt to submit the empty form, and confirm required-field validation appears before canceling back to Manage.

## Regression Smoke

- [ ] Load the home page and confirm featured venues render without layout issues.
- [ ] Search for a venue by city and ensure the results update along with the "results" counter.
- [ ] From the venues list, open a venue detail page and verify gallery images and amenities render correctly.
- [ ] Navigate to a user profile page and verify bookings and venues tabs load their content.
- [ ] View the site on a mobile viewport to confirm navigation, search, and booking actions remain usable.
