# KRATOS V5 — Neuro-UX Rules (TDAH-first Design)

## 1. Cognitive Load Management

### 1.1 Miller's Law Compliance
**Rule**: Never show more than 7±2 decision elements simultaneously
**Implementation**:
- Limit sidebar navigation items to 7
- Restrict action buttons per card to 3
- Cap filter options in dropdowns to 9
- Use progressive disclosure for complex features

### 1.2 Single Primary Action
**Rule**: Each screen must have exactly one dominant action
**Implementation**:
- Primary button with prominent styling
- Secondary actions in muted colors
- Context menu for additional options
- Clear visual hierarchy with size and color

### 1.3 Spatial Memory Preservation
**Rule**: Fixed positions for recurring elements
**Implementation**:
- Consistent shell layout (TopHUD, Sidebar, BottomDock)
- Persistent island positions in WorldMap
- Stable sorting in lists and tables
- Predictable interaction patterns

## 2. Focus Preservation

### 2.1 Checkpoint System
**Rule**: 1-click context restoration
**Implementation**:
- Automatic checkpoint on navigation
- Visual indicator of last position
- Keyboard shortcut (Ctrl+Shift+Z) for resume
- Manual checkpoint creation option

### 2.2 Focus Mode
**Rule**: Dim non-essential elements during deep work
**Implementation**:
- Toggle with keyboard shortcut (Ctrl+Shift+F)
- Reduce opacity of side panels to 40%
- Keep primary action area at 100% visibility
- Auto-exit after 30 minutes of inactivity

### 2.3 Reduced Motion Respect
**Rule**: Honor system motion preferences
**Implementation**:
- CSS media query: `@media (prefers-reduced-motion: reduce)`
- Disable all non-essential animations
- Keep functional transitions (state changes)
- Provide motion toggle in settings

## 3. Information Architecture

### 3.1 9 Operational Questions
**Rule**: Interface must answer these 9 questions in ≤10 seconds:
1. Where am I? (Current location/context)
2. What am I doing? (Current task/project)
3. What's running? (Active processes/missions)
4. What broke? (Errors/alerts)
5. Where did I stop? (Last checkpoint)
6. What's late? (Overdue items)
7. Which project is at risk? (Risk indicators)
8. What's my next action? (Clear guidance)
9. What should I NOT open now? (Focus blockers)

### 3.2 Status Visibility
**Rule**: Real-time system state always visible
**Implementation**:
- Live connection indicator in TopHUD
- Color-coded status badges throughout
- Pulse animations for critical updates
- Sound notifications for high-priority events

### 3.3 Progress Indicators
**Rule**: Clear progress for all ongoing tasks
**Implementation**:
- Progress rings for quantifiable tasks
- Skeleton loaders for unknown duration
- Percentage completion for long processes
- Estimated time remaining when calculable

## 4. Error Recovery

### 4.1 Graceful Degradation
**Rule**: System remains usable during partial failures
**Implementation**:
- Fallback to cached data when offline
- Mock data for completely broken services
- Clear error messages with recovery steps
- Automatic retry with exponential backoff

### 4.2 Undo System
**Rule**: All destructive actions are reversible
**Implementation**:
- 5-second undo toast for deletions
- Version history for document changes
- Soft delete with 30-day retention
- Bulk operation confirmation dialogs

## 5. Interaction Design

### 5.1 Keyboard Navigation
**Rule**: Full functionality without mouse
**Implementation**:
- Tab order follows visual hierarchy
- Arrow keys for list navigation
- Enter/space for activation
- Escape for closing modals

### 5.2 Touch Target Sizes
**Rule**: Minimum 44px for interactive elements
**Implementation**:
- Buttons: minimum 44px × 44px
- Links: minimum 44px height with padding
- Form inputs: minimum 44px height
- Icons: minimum 44px touch area with padding

### 5.3 Feedback Timing
**Rule**: Immediate feedback for all interactions
**Implementation**:
- Visual feedback within 100ms
- State changes within 300ms
- Progress indicators for >1s operations
- Completion confirmation for all actions

## 6. Visual Design

### 6.1 Contrast Requirements
**Rule**: WCAG AA compliance minimum
**Implementation**:
- Text: 4.5:1 contrast ratio
- UI elements: 3:1 contrast ratio
- Focus indicators: 3:1 contrast ratio
- High contrast mode available

### 6.2 Typography Hierarchy
**Rule**: Clear visual distinction between content levels
**Implementation**:
- Font weight differences (400, 500, 600, 700)
- Size hierarchy (10px to 28px scale)
- Color contrast for emphasis
- Letter spacing for all caps labels

### 6.3 Color Coding
**Rule**: Consistent semantic color usage
**Implementation**:
- Green: Success, healthy, live
- Yellow: Warning, degraded, cached
- Red: Error, critical, offline
- Blue: Information, active, primary
- Purple: AI, Aurora, OMNIS

## 7. Performance

### 7.1 Response Time Targets
**Rule**: Perceptible performance thresholds
**Implementation**:
- 0.1s: Direct manipulation (drag, resize)
- 0.3s: Simple interactions (click, tap)
- 1.0s: Complex operations (save, submit)
- 10s: Large data processing (reports, exports)

### 7.2 Loading States
**Rule**: Never show blank screens
**Implementation**:
- Skeleton loaders for known layouts
- Progress indicators for unknown duration
- Cached content when available
- Clear error states when failed

## 8. Accessibility

### 8.1 Screen Reader Support
**Rule**: Full NVDA/JAWS/VoiceOver compatibility
**Implementation**:
- Semantic HTML structure
- ARIA labels for custom components
- Landmark regions for navigation
- Skip links for keyboard users

### 8.2 Keyboard-Only Navigation
**Rule**: 100% functionality without mouse
**Implementation**:
- Focus management for all components
- Visible focus indicators
- Keyboard shortcuts documentation
- Logical tab order

## 9. Content Strategy

### 9.1 Microcopy Principles
**Rule**: Clear, concise, actionable language
**Implementation**:
- Action verbs for buttons ("Save", "Delete")
- Context-specific error messages
- Progress indicators with clear status
- Help text that prevents errors

### 9.2 Information Density
**Rule**: Optimize for scanning, not reading
**Implementation**:
- Bullet points instead of paragraphs
- Highlight key numbers and metrics
- Use icons for common actions
- Progressive disclosure for details

## 10. Testing & Validation

### 10.1 TDAH User Testing
**Rule**: Regular validation with TDAH users
**Implementation**:
- Quarterly usability sessions
- Task completion time measurements
- Error rate tracking
- Satisfaction surveys

### 10.2 Cognitive Walkthroughs
**Rule**: Evaluate cognitive load for each workflow
**Implementation**:
- Step-by-step task analysis
- Decision point identification
- Memory load assessment
- Recovery path validation

These rules form the foundation of KRATOS's Neuro-UX approach, ensuring the interface supports focus, reduces cognitive load, and enables productive work for users with TDAH and other neurodivergent conditions.