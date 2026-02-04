# Implementation Plan: Document Feedback Widget

## Overview

This plan implements a floating feedback widget for the document viewer page (document.html). The implementation follows an incremental approach: first building the core widget structure and state management, then adding form functionality, context capture, storage, and finally accessibility and responsive features.

## Tasks

- [x] 1. Create widget HTML structure and base styles
  - [x] 1.1 Add widget HTML markup to document.html
    - Add the feedback widget container with collapsed button and expanded panel
    - Include form elements: textarea, rating select, submit button
    - Add close button and status message container
    - Place before closing `</body>` tag
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 1.2 Add widget CSS styles to document.html
    - Add styles for collapsed state (fixed position, bottom-right, circular button)
    - Add styles for expanded state (panel above button, form layout)
    - Use existing CSS variables (--primary-color, --accent)
    - Use Inter font family for form elements
    - Add hover and focus states
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 9.1, 9.2_

- [x] 2. Implement widget state management
  - [x] 2.1 Create FeedbackWidget class with toggle functionality
    - Implement constructor with element references
    - Implement init() to set up initial state and event listeners
    - Implement expand() and collapse() methods
    - Implement toggle() method
    - Add click handler on toggle button to expand
    - Add click handler on close button to collapse
    - _Requirements: 2.1, 2.3_

  - [ ] 2.2 Write property test for widget state toggle
    - **Property 1: Widget State Toggle**
    - Test that clicking toggle expands, pressing Escape collapses
    - **Validates: Requirements 2.1, 2.5**

  - [x] 2.3 Add keyboard support for widget
    - Add Escape key handler to collapse expanded widget
    - Ensure toggle button is keyboard accessible
    - _Requirements: 2.5, 8.1_

- [x] 3. Implement context capture integration
  - [x] 3.1 Create getCurrentDocumentContext function
    - Extract current page detection logic from existing updateSidebarByPage
    - Implement section derivation from sectionPageMap
    - Return object with pageNumber, sectionId, sectionName
    - Handle edge cases when PDF not loaded
    - _Requirements: 4.1, 4.2, 4.5_

  - [ ] 3.2 Write property test for section derivation
    - **Property 3: Section Derivation from Page Number**
    - Test that page numbers map to correct sections per sectionPageMap
    - **Validates: Requirements 4.2**

  - [x] 3.3 Integrate context capture with widget expansion
    - Call getCurrentDocumentContext when widget expands
    - Store captured context in widget instance
    - Display context info in form (e.g., "Viewing: Infrastructure, Page 34")
    - _Requirements: 4.1, 4.2_

- [x] 4. Checkpoint - Verify widget toggle and context capture
  - Ensure widget expands/collapses correctly
  - Ensure context is captured and displayed
  - Ask the user if questions arise

- [ ] 5. Implement feedback storage and backend integration
  - [x] 5.1 Create FeedbackStorage utility object
    - Implement isAvailable() to check localStorage access
    - Implement getAll() to retrieve stored entries
    - Implement add(entry) to store new entry
    - Use storage key 'edtech-feedback-entries'
    - _Requirements: 5.5_

  - [x] 5.2 Implement device ID management
    - Create getDeviceId() function
    - Generate unique device ID if not exists
    - Store in localStorage with key 'edtech-device-id'
    - Retrieve existing ID on subsequent visits
    - _Requirements: 5.4, 5.8_

  - [x] 5.3 Implement backend API submission
    - Create submitToBackend(entry) async function
    - POST to /api/feedback/submit endpoint
    - Map rating values to backend enum format
    - Handle API errors gracefully
    - _Requirements: 5.3_

  - [ ] 5.4 Write property test for unique ID generation
    - **Property 4: Unique ID Generation**
    - Generate 100+ IDs and verify no duplicates
    - **Validates: Requirements 5.4**

  - [ ] 5.5 Write property test for storage round-trip
    - **Property 9: Storage Round-Trip**
    - Save entries and verify retrieval returns identical data
    - **Validates: Requirements 5.5**

- [x] 6. Implement form submission
  - [x] 6.1 Create feedback validation function
    - Implement validateFeedback(comment) function
    - Reject empty strings and whitespace-only strings
    - Return validation result with trimmed value or error
    - _Requirements: 5.6_

  - [ ] 6.2 Write property test for empty comment rejection
    - **Property 5: Empty Comment Rejection**
    - Test that whitespace-only strings are rejected
    - **Validates: Requirements 5.6**

  - [x] 6.3 Implement submit handler
    - Add form submit event listener
    - Validate comment input
    - Create FeedbackEntry with all required fields including device_id
    - Submit to backend API first
    - Store entry in localStorage as backup
    - Mark entry as synced:true if API succeeds, synced:false if fails
    - Handle API and storage errors gracefully
    - _Requirements: 5.1, 5.2, 5.3, 5.6_

  - [ ] 6.4 Write property test for submission creates complete entry
    - **Property 2: Feedback Submission Creates Complete Entry**
    - Test that valid submissions create entries with all fields
    - **Validates: Requirements 4.3, 4.4, 5.1, 5.2, 5.3**

- [x] 7. Implement submission feedback UI
  - [x] 7.1 Create confirmation and error display functions
    - Implement showConfirmation() to display "Thanks!" message
    - Implement showError(message) for error states
    - Use aria-live region for screen reader announcements
    - _Requirements: 6.1, 6.5, 8.4_

  - [x] 7.2 Implement post-submission behavior
    - Show confirmation message for 2-3 seconds
    - Clear form fields after successful submission
    - Collapse widget after confirmation timeout
    - _Requirements: 6.2, 6.3, 6.4_

  - [ ] 7.3 Write property test for form clearing
    - **Property 6: Form Clearing After Submission**
    - Test that form fields are empty after submission
    - **Validates: Requirements 6.4**

- [x] 8. Checkpoint - Verify complete submission flow
  - Test full flow: expand → enter feedback → submit → confirmation → collapse
  - Verify data is sent to backend API
  - Verify data is stored in localStorage as backup
  - Test error handling for empty comments
  - Test fallback when API is unavailable
  - Ask the user if questions arise

- [x] 9. Implement accessibility features
  - [x] 9.1 Add ARIA attributes to widget elements
    - Add aria-label to toggle button
    - Add aria-expanded to toggle button
    - Add role="dialog" to expanded panel
    - Add aria-labelledby to panel referencing title
    - Add aria-live="assertive" to status container
    - _Requirements: 8.2, 8.4_

  - [x] 9.2 Implement focus trap for expanded state
    - Track focusable elements within widget
    - Trap Tab/Shift+Tab to cycle within widget
    - Set initial focus to textarea when expanded
    - Return focus to toggle button when collapsed
    - _Requirements: 8.3_

  - [ ] 9.3 Write property test for focus trap
    - **Property 8: Focus Trap in Expanded State**
    - Test that tab navigation stays within widget
    - **Validates: Requirements 8.3**

  - [ ] 9.4 Write property test for accessibility of interactive elements
    - **Property 7: Accessibility - Interactive Elements**
    - Test focusability, labels, and tap target sizes
    - **Validates: Requirements 7.3, 8.1, 8.5**

- [x] 10. Implement responsive design
  - [x] 10.1 Add responsive CSS for mobile viewports
    - Adjust widget position for mobile (avoid menu button overlap)
    - Make expanded panel width responsive (max-width with percentage)
    - Ensure touch-friendly tap targets (min 44x44px)
    - Add responsive font sizes
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 10.2 Add mobile-specific behavior adjustments
    - Test and adjust z-index to stay above mobile sidebar
    - Ensure widget doesn't interfere with PDF scrolling on touch
    - _Requirements: 7.1, 7.4_

- [x] 11. Final integration and cleanup
  - [x] 11.1 Wire widget initialization to page load
    - Initialize FeedbackWidget after PDF.js setup
    - Ensure widget works even if PDF fails to load
    - _Requirements: 4.5_

  - [x] 11.2 Add smooth animations
    - Add CSS transitions for expand/collapse (200-300ms)
    - Add hover transitions for button states
    - Use appropriate easing functions
    - _Requirements: 2.2, 9.5_

- [x] 12. Final checkpoint - Complete feature verification
  - Test all user flows on desktop and mobile
  - Verify accessibility with keyboard navigation
  - Verify localStorage persistence across page reloads
  - Ensure all tests pass
  - Ask the user if questions arise

## Notes

- All tasks including tests are required for comprehensive coverage
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation uses vanilla JavaScript to match existing codebase patterns
- Backend API integration uses the EduDoc API at `/api/feedback/submit`
