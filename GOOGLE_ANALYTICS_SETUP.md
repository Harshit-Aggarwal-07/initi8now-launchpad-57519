# Google Analytics 4 Setup Guide

This guide explains how to set up Google Analytics 4 (GA4) tracking for your Initi8now application.

## Prerequisites

1. A Google Analytics account
2. A GA4 property created in Google Analytics

## Setup Steps

### 1. Create a GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" in the bottom left
3. Under "Property", click "Create Property"
4. Follow the setup wizard to create a GA4 property
5. Copy your **Measurement ID** (format: G-XXXXXXXXXX)

### 2. Add Measurement ID to Your Project

The application needs your GA4 Measurement ID to initialize tracking. 

**Option 1: Using Lovable Secrets (Recommended)**

1. Go to your project settings in Lovable
2. Navigate to "Secrets" section
3. Add a new secret:
   - Name: `VITE_GA_MEASUREMENT_ID`
   - Value: Your GA4 Measurement ID (e.g., `G-XXXXXXXXXX`)

**Option 2: Local Development**

If you're running the project locally, add the Measurement ID to your `.env` file:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Verify Installation

After deploying your changes:

1. Visit your live website
2. Open Google Analytics
3. Go to Reports → Realtime
4. You should see your visit tracked in real-time

## Custom Events Tracked

The application automatically tracks these events:

### Conversion Events
- `waitlist_signup` - When a user joins the waitlist (student or recruiter)
- `newsletter_signup` - When a user subscribes to the newsletter

### Engagement Events
- `form_start` - When a user begins filling out a form
- `form_submit` - When a user submits a form
- `button_click` - When specific buttons are clicked
- `user_type_toggle` - When user switches between student/recruiter view

### Navigation Events
- `navigation` - When user navigates to different pages
- Page views are automatically tracked on all pages

## Event Parameters

Each event includes relevant parameters for detailed analysis:

### Waitlist Signup Event
```javascript
{
  user_type: 'student' | 'recruiter',
  event_category: 'conversion',
  event_label: 'Waitlist Signup - [user_type]'
}
```

### Button Click Event
```javascript
{
  button_name: 'name of the button',
  button_location: 'location on page',
  event_category: 'engagement'
}
```

## Viewing Reports

### Real-time Reports
Go to: **Reports → Realtime** to see current activity

### Event Reports
Go to: **Reports → Engagement → Events** to see all tracked events

### Conversion Tracking
1. Go to **Admin → Events**
2. Mark `waitlist_signup` and `newsletter_signup` as conversions
3. These will now appear in conversion reports

## Privacy & Compliance

The implementation:
- Does not track personally identifiable information (PII)
- Respects user privacy settings
- Only tracks aggregated behavioral data
- Complies with Google Analytics terms of service

## Troubleshooting

### Events Not Showing Up

1. Check that `VITE_GA_MEASUREMENT_ID` is correctly set
2. Verify the Measurement ID format (should start with `G-`)
3. Check browser console for any errors
4. Wait 24-48 hours for data to appear in standard reports (Realtime shows immediately)

### Testing Events

Open browser console and check for:
```javascript
window.gtag // Should be defined
window.dataLayer // Should be an array
```

You can manually trigger test events in console:
```javascript
gtag('event', 'test_event', { test: true })
```

## Additional Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/9304153)
- [GA4 Event Reference](https://support.google.com/analytics/answer/9267735)
- [Custom Event Tracking](https://developers.google.com/analytics/devguides/collection/ga4/events)

## Support

For issues with:
- **Analytics setup**: Contact Google Analytics support
- **Application tracking**: Open an issue in the project repository
