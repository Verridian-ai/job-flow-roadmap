# Job Flow UI Component Library

A comprehensive, accessible component library built with React, TypeScript, and Tailwind CSS for the Job Flow platform.

## Overview

This component library provides a set of reusable, well-tested UI components that follow best practices for accessibility, performance, and developer experience. All components are fully typed with TypeScript and styled with Tailwind CSS.

## Components

### Button

A flexible button component with multiple variants, sizes, and loading states.

**Props:**
- `variant`: "primary" | "secondary" | "outline" | "ghost" | "danger"
- `size`: "sm" | "md" | "lg"
- `loading`: boolean
- `leftIcon`: React.ReactNode
- `rightIcon`: React.ReactNode

**Examples:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">Click me</Button>
<Button variant="outline" loading>Loading...</Button>
<Button variant="danger" leftIcon={<TrashIcon />}>Delete</Button>
```

---

### Input

A text input component with label, error states, and icon support.

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: React.ReactNode
- `rightIcon`: React.ReactNode

**Examples:**
```tsx
import { Input } from '@/components/ui';

<Input label="Email" type="email" placeholder="you@example.com" />
<Input label="Password" type="password" error="Password is required" />
<Input leftIcon={<SearchIcon />} placeholder="Search..." />
```

---

### Textarea

A multi-line text input component with label and error states.

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `resize`: "none" | "vertical" | "horizontal" | "both"

**Examples:**
```tsx
import { Textarea } from '@/components/ui';

<Textarea label="Description" placeholder="Enter description..." rows={4} />
<Textarea label="Bio" error="Bio is required" resize="vertical" />
```

---

### Select

A dropdown select component with label and error states.

**Props:**
- `label`: string
- `error`: string
- `helperText`: string

**Examples:**
```tsx
import { Select } from '@/components/ui';

<Select label="Country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</Select>
```

---

### Card

A container component with multiple variants and composable parts.

**Props:**
- `variant`: "default" | "outlined" | "elevated"
- `padding`: "none" | "sm" | "md" | "lg"

**Subcomponents:**
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`

**Examples:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Resume Builder</CardTitle>
    <CardDescription>Create your ATS-optimized resume</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    <Button>Save Resume</Button>
  </CardFooter>
</Card>
```

---

### Modal

A modal dialog component with overlay and customizable sizes.

**Props:**
- `open`: boolean
- `onClose`: () => void
- `size`: "sm" | "md" | "lg" | "xl" | "full"
- `closeOnOverlayClick`: boolean

**Subcomponents:**
- `ModalHeader`
- `ModalBody`
- `ModalFooter`

**Examples:**
```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';

<Modal open={isOpen} onClose={() => setIsOpen(false)} size="lg">
  <ModalHeader onClose={() => setIsOpen(false)}>
    Confirm Delete
  </ModalHeader>
  <ModalBody>
    Are you sure you want to delete this resume?
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="danger">Delete</Button>
  </ModalFooter>
</Modal>
```

---

### Badge

A small label component for displaying status, categories, or counts.

**Props:**
- `variant`: "default" | "success" | "warning" | "error" | "info"
- `size`: "sm" | "md" | "lg"

**Examples:**
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success">Active</Badge>
<Badge variant="error">Rejected</Badge>
<Badge variant="warning" size="lg">Pending</Badge>
```

---

### Alert

A notification component for displaying important messages to users.

**Props:**
- `variant`: "info" | "success" | "warning" | "error"
- `title`: string
- `onClose`: () => void

**Examples:**
```tsx
import { Alert } from '@/components/ui';

<Alert variant="success" title="Success!">
  Your resume has been saved successfully.
</Alert>

<Alert variant="error" title="Error" onClose={() => setAlert(null)}>
  Failed to save resume. Please try again.
</Alert>
```

---

## Installation

All components are located in `src/components/ui/` and can be imported individually:

```tsx
import { Button, Input, Card } from '@/components/ui';
```

## Styling

Components are styled using Tailwind CSS. Make sure your project has Tailwind configured with the necessary classes.

## TypeScript Support

All components are fully typed with TypeScript, providing excellent IDE autocomplete and type checking.

```tsx
import type { ButtonProps, InputProps } from '@/components/ui';
```

## Accessibility

All components follow WAI-ARIA best practices:
- Proper semantic HTML
- Keyboard navigation support
- Screen reader friendly
- Focus management
- ARIA attributes where needed

## Best Practices

### Form Components

Always provide labels for form inputs:

```tsx
<Input label="Email" type="email" required />
```

Handle errors gracefully:

```tsx
<Input
  label="Password"
  type="password"
  error={errors.password}
/>
```

### Buttons

Use appropriate variants:
- `primary` for main actions
- `secondary` for alternative actions
- `outline` for less prominent actions
- `ghost` for tertiary actions
- `danger` for destructive actions

Show loading states for async operations:

```tsx
<Button loading={isSubmitting} onClick={handleSubmit}>
  Submit
</Button>
```

### Modal

Always provide a way to close modals:

```tsx
<Modal open={isOpen} onClose={handleClose}>
  <ModalHeader onClose={handleClose}>Title</ModalHeader>
  {/* content */}
</Modal>
```

### Cards

Use cards to group related content:

```tsx
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Related Jobs</CardTitle>
  </CardHeader>
  <CardContent>
    {jobs.map(job => <JobCard key={job.id} {...job} />)}
  </CardContent>
</Card>
```

## Performance

- All components use React.forwardRef for ref forwarding
- Memoization where appropriate
- Minimal re-renders
- Tree-shakeable exports

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

When adding new components:
1. Follow existing patterns and conventions
2. Add proper TypeScript types
3. Include JSDoc documentation
4. Add usage examples
5. Ensure accessibility compliance
6. Update this README

## Future Components

Planned additions:
- Checkbox
- Radio
- Switch/Toggle
- Tabs
- Dropdown Menu
- Tooltip
- Toast/Snackbar
- Skeleton Loader
- Progress Bar
- Date Picker
- File Upload

---

**Version:** 1.0.0
**Last Updated:** 2025-11-13
**Agent:** Agent-5 (Infrastructure)
