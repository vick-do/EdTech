# Requirements Document

## Introduction

This document specifies the requirements for a Document Feedback Widget feature on the document viewer page (document.html). The widget provides a non-intrusive way for users to submit feedback about the Ghana EdTech Strategy PDF without navigating away from the document. It captures contextual information (current page/section) automatically and stores feedback locally for future backend integration.

## Glossary

- **Widget**: A floating UI component that can toggle between collapsed (icon) and expanded (form) states
- **Feedback_Form**: The expanded state of the Widget containing input fields for user feedback
- **Collapsed_State**: The minimized Widget showing only a floating icon button
- **Expanded_State**: The Widget showing the full feedback form with textarea, rating, and submit button
- **Current_Page**: The PDF page number currently visible in the viewport, tracked via the existing `updateSidebarByPage()` function
- **Current_Section**: The document section corresponding to the Current_Page, derived from `sectionPageMap`
- **Feedback_Entry**: A data object containing the user's comment, optional rating, timestamp, page number, and section ID
- **Local_Storage**: Browser's localStorage API used to persist Feedback_Entries as backup
- **Backend_API**: The EduDoc API endpoint at `/api/feedback/submit` for persisting feedback to MongoDB
- **Device_ID**: A unique identifier for the user's browser/device, generated and stored in localStorage

## Requirements

### Requirement 1: Widget Collapsed State Display

**User Story:** As a document viewer, I want to see a small, unobtrusive feedback icon in the bottom-right corner, so that I know feedback functionality is available without it blocking my reading.

#### Acceptance Criteria

1. THE Widget SHALL display as a floating circular button in the bottom-right corner of the viewport
2. THE Widget SHALL use a speech bubble or feedback icon that is visually recognizable
3. THE Widget SHALL have a fixed position that remains visible during PDF scrolling
4. THE Widget SHALL use the existing color scheme (--primary-color: #2b6cb0 or --accent: #d4a574)
5. THE Widget SHALL not overlap with the PDF content area or sidebar navigation
6. WHEN the user hovers over the collapsed Widget, THE Widget SHALL display a subtle visual feedback (scale or shadow change)

### Requirement 2: Widget Expansion Interaction

**User Story:** As a document viewer, I want to click the feedback icon to expand a compact form, so that I can quickly provide feedback without leaving the document.

#### Acceptance Criteria

1. WHEN the user clicks the collapsed Widget, THE Widget SHALL expand to show the Feedback_Form
2. WHEN the Widget expands, THE Widget SHALL animate smoothly with a transition duration of 200-300ms
3. WHEN the Widget is expanded, THE Widget SHALL display a close button to return to Collapsed_State
4. WHEN the user clicks outside the expanded Widget, THE Widget SHALL remain expanded (not auto-close)
5. WHEN the user presses the Escape key while the Widget is expanded, THE Widget SHALL collapse to Collapsed_State
6. THE Expanded_State SHALL position the form above the collapsed icon location to avoid viewport overflow

### Requirement 3: Feedback Form Content

**User Story:** As a document viewer, I want a simple form with just a comment field and optional rating, so that I can provide feedback quickly without filling in personal information.

#### Acceptance Criteria

1. THE Feedback_Form SHALL contain a textarea for entering comments
2. THE Feedback_Form SHALL contain an optional satisfaction rating selector matching the homepage style (Very Satisfied to Very Dissatisfied)
3. THE Feedback_Form SHALL contain a submit button
4. THE Feedback_Form SHALL NOT contain any personal information fields (no name, no email)
5. THE textarea SHALL have placeholder text guiding the user on what feedback to provide
6. THE Feedback_Form SHALL use the Inter font family consistent with existing UI elements

### Requirement 4: Context Auto-Capture

**User Story:** As a feedback reviewer, I want to know which page/section the user was viewing when they submitted feedback, so that I can understand the context of their comments.

#### Acceptance Criteria

1. WHEN the user opens the Feedback_Form, THE Widget SHALL capture the Current_Page number from the PDF viewer
2. WHEN the user opens the Feedback_Form, THE Widget SHALL derive the Current_Section from the sectionPageMap
3. WHEN feedback is submitted, THE Feedback_Entry SHALL include the captured page number
4. WHEN feedback is submitted, THE Feedback_Entry SHALL include the captured section identifier
5. THE context capture SHALL use the existing `updateSidebarByPage()` logic or equivalent page detection

### Requirement 5: Feedback Submission and Storage

**User Story:** As a document viewer, I want my feedback to be sent to the backend and also saved locally as backup, so that it persists reliably.

#### Acceptance Criteria

1. WHEN the user submits feedback with a non-empty comment, THE Widget SHALL create a Feedback_Entry
2. THE Feedback_Entry SHALL include: comment text, optional rating, timestamp, page number, and section ID
3. THE Widget SHALL send the Feedback_Entry to the Backend_API at `/api/feedback/submit`
4. THE Widget SHALL include a Device_ID with each submission for tracking purposes
5. THE Widget SHALL store the Feedback_Entry in Local_Storage as backup
6. IF the Backend_API is unavailable, THEN THE Widget SHALL store locally and show a warning
7. THE Widget SHALL validate that the comment is not empty before allowing submission
8. THE Widget SHALL generate or retrieve a persistent Device_ID stored in localStorage

### Requirement 6: Submission Confirmation

**User Story:** As a document viewer, I want to see confirmation that my feedback was received, so that I know my submission was successful.

#### Acceptance Criteria

1. WHEN feedback is successfully submitted, THE Widget SHALL display a "Thanks!" confirmation message
2. THE confirmation message SHALL be visible for 2-3 seconds
3. AFTER the confirmation message displays, THE Widget SHALL automatically collapse to Collapsed_State
4. THE Feedback_Form SHALL clear all input fields after successful submission
5. WHEN an error occurs during submission, THE Widget SHALL display an error message instead of confirmation

### Requirement 7: Responsive Design

**User Story:** As a mobile user, I want the feedback widget to work well on my device, so that I can provide feedback regardless of screen size.

#### Acceptance Criteria

1. THE Widget SHALL be fully functional on mobile devices (viewport width < 768px)
2. THE Expanded_State SHALL adapt its size to fit smaller screens without horizontal overflow
3. THE Widget SHALL maintain touch-friendly tap targets (minimum 44x44px for interactive elements)
4. WHEN on mobile, THE Widget SHALL position itself to avoid overlap with the mobile menu button
5. THE Widget SHALL use responsive font sizes that remain readable on small screens

### Requirement 8: Accessibility

**User Story:** As a user with accessibility needs, I want the feedback widget to be keyboard navigable and screen reader compatible, so that I can use it effectively.

#### Acceptance Criteria

1. THE Widget SHALL be focusable and operable via keyboard navigation
2. THE collapsed Widget button SHALL have an appropriate aria-label describing its purpose
3. THE Expanded_State SHALL trap focus within the form until closed
4. THE Widget SHALL announce state changes to screen readers using aria-live regions
5. THE form inputs SHALL have associated labels for screen reader compatibility
6. THE Widget SHALL support high contrast mode and respect user color preferences

### Requirement 9: Visual Design Consistency

**User Story:** As a user, I want the feedback widget to match the existing page design, so that it feels like a natural part of the document viewer.

#### Acceptance Criteria

1. THE Widget SHALL use colors from the existing CSS variables (--primary-color, --accent, --text-primary)
2. THE Widget SHALL use the Inter font family for UI text
3. THE Widget SHALL use box-shadow styling consistent with existing page elements
4. THE Widget SHALL use border-radius values consistent with existing buttons and cards
5. THE Widget animations SHALL use smooth easing functions matching existing page transitions
