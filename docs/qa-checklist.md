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

- [ ] Load the home page, confirm the hero and **Featured Venues** sections render, then follow **See all Venues** to reach the listing view.
- [ ] Use the desktop search bar (city or keywords) and ensure the results counter updates and shows “filtered results”; clear the search and confirm the count resets.
- [ ] Open any venue card, verify the booking widget (book heading, guest controls) renders, then click **Sign in or register** and confirm you are routed back to the same venue after logging in.
- [ ] From the profile menu, open **Profile**, verify the **Your bookings** section, and switch between **Upcoming** and **Earlier** tabs to ensure both render.
- [ ] Resize to a mobile viewport (≈390px wide), open the “Search venues” sheet, confirm the panel renders, then close it and verify the CTA still works.
