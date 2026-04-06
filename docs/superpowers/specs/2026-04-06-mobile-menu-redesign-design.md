# Mobile Menu Redesign

## Summary

Redesign the mobile navigation menu in `src/features/navigation/components/mobile-menu.tsx` to improve visual hierarchy, readability, touch ergonomics, and information grouping. The new mobile menu keeps the existing desktop navbar behavior intact while restructuring the mobile panel into three explicit zones: header, navigation body, and footer.

This redesign is limited to the navigation experience on mobile and the supporting data shape in `src/features/navigation/components/navbar.tsx`. It does not introduce new routes. `Contacto` is resolved as WhatsApp, and the removed `Colecciones` route is not restored.

## Goals

- Increase hierarchy contrast between primary navigation items and subcategories.
- Replace the current indented submenu treatment with a darker, more legible secondary style.
- Split the mobile panel into three visual levels: header, main navigation, footer.
- Add a quick search field in the header area of the mobile panel.
- Move `Ayuda` and contact actions out of the main navigation body.
- Guarantee touch targets of at least `48px` height for all interactive mobile items.
- Improve accessibility with stronger text contrast and clearer expanded/collapsed state indicators.

## Non-Goals

- No redesign of the desktop dropdown in the top navbar beyond keeping data consistent.
- No new `/colecciones` or `/contacto` route.
- No sitewide search backend. The search field is a UI affordance for quick access and can initially route to the existing product listing flow.
- No redesign of `UserMenu` or cart interactions.

## Chosen Direction

The selected direction is the equivalent of visual option `B`: a structured, utilitarian mobile menu with strong scanning behavior and minimal implementation risk.

Characteristics:

- Explicit top, middle, and bottom zones.
- Primary items displayed as section-level labels with larger serif typography and stronger weight.
- Subcategories shown as direct rows without left border or nested indentation.
- Footer actions visually separated from the shopping/navigation flow.
- Chevron rotation used as the primary expanded-state signal for `Explorar`.

## Information Architecture

### Header Zone

The header zone contains:

- Brand/logo on the left.
- Close button (`X`) on the right.
- Quick search field directly below the header row.

The search field should be part of the menu panel itself so users can search immediately after opening the menu without leaving the navigation context.

### Navigation Zone

The central navigation zone contains the main sections only:

- `Explorar`
- `Talles`
- `Colecciones`, kept as a navigation label but resolved to `/productos` because the original route no longer exists.

`Explorar` is the only expandable item in the current scope and contains category links passed from `Navbar`.

Subcategories:

- Must not use indentation as the main hierarchy cue.
- Must use darker text than the current muted foreground.
- May use row background, separators, or spacing to distinguish themselves from primary items.

### Footer Zone

The footer zone contains utility and contact actions:

- `Ayuda`
- `WhatsApp`
- Social media icons/links

The footer is visually separated from the navigation body to reduce cognitive load in the primary navigation area.

## Interaction Design

### Open and Close Behavior

The mobile panel should preserve the current close behaviors:

- Toggle button in the navbar.
- Close button inside the panel.
- Clicking the backdrop/overlay.
- Pressing `Escape`.
- Navigating to a new route.

### Expandable Section Behavior

`Explorar` behaves as an accordion trigger.

Requirements:

- When expanded, the chevron rotates `180deg`.
- When collapsed, the chevron returns to default orientation.
- The state must be visually understandable without relying only on color.
- The expanded area must be associated through `aria-controls`.
- The trigger must expose `aria-expanded`.

Only one expandable section exists in scope, so no multi-accordion coordination is required beyond the existing `expanded` state.

### Search Behavior

The quick search field is present in the visual structure from the first implementation.

Implementation options, in recommended order:

1. Route to `/productos` with a query param when submitted.
2. Reuse an existing search interaction if one already exists in navigation/product listing code.
3. If neither is ready, render the search field as a non-breaking UI shell with disabled submit behavior until search wiring is added.

The design assumes option 1 if feasible with current routing.

## Visual Hierarchy

### Primary Items

Primary items in the navigation zone should:

- Use larger text than subcategories.
- Use stronger weight (`semibold` or `bold`).
- Use `foreground`-level contrast.
- Maintain a minimum interactive height between `52px` and `56px`.

These items should read as section titles rather than secondary links.

### Subcategories

Subcategories under `Explorar` should:

- Use smaller type than primary items.
- Use a dark neutral color stronger than the current `muted-foreground`.
- Avoid pale gray that risks failing contrast expectations.
- Keep a minimum height of `48px`.
- Avoid decorative indentation, left borders, or visually “nested list” treatments.

The hierarchy should come from scale, weight, spacing, and color, not from shrinking readability.

### Footer Utilities

Footer links should be calmer than primary navigation but still comfortably legible:

- Standard UI sizing.
- `foreground` or dark neutral color.
- Clear separation from the main nav via border and spacing.

Social icons should be secondary but tappable, not ornamental only.

## Layout and Scrolling

The mobile menu panel should be built as a vertical flex container:

- Fixed header block.
- Scrollable middle block.
- Fixed footer block.

This prevents footer actions from disappearing below a long category list and makes the menu feel intentional rather than like a single overflowing list.

Recommended structure:

- Outer panel: column flex layout sized to available viewport height.
- Header: non-scrolling.
- Navigation body: `overflow-y-auto`.
- Footer: non-scrolling with top border.

## Accessibility Requirements

- All interactive rows must meet or exceed `48px` height.
- Text contrast for submenu items must be significantly darker than the current light gray treatment.
- Interactive controls must maintain explicit labels.
- Accordion trigger must expose `aria-expanded` and `aria-controls`.
- Search input must have an accessible label, either visible or screen-reader-only.
- Close control must retain `aria-label`.

## Data and Component Impact

### `src/features/navigation/components/navbar.tsx`

Changes expected:

- Rework the mobile links payload so it reflects only the main navigation zone.
- Remove `Ayuda` from the central mobile list and move it into the mobile footer.
- Keep category generation for the `Explorar` submenu.
- Keep desktop navigation behavior functionally unchanged.

### `src/features/navigation/components/mobile-menu.tsx`

Changes expected:

- Restructure markup into header, body, and footer blocks.
- Add search field UI.
- Improve type scale, weight, spacing, and row heights.
- Add footer utilities and WhatsApp contact.
- Add social media link area.
- Improve accordion semantics and state indicators.

### Supporting data

`WhatsApp` should reuse the same environment-driven source of truth already used by the floating WhatsApp button, avoiding duplicated configuration.

If no social URLs exist yet, the implementation should prefer one of these paths:

- Render non-clickable visual placeholders only if explicitly desired.
- Hide social icons until URLs are provided.

Default recommendation: hide icons that do not yet have valid destinations.

## Error Handling and Edge Cases

- If categories are empty, `Explorar` should still render as a top-level item linking to `/productos` without showing an empty expanded region.
- If WhatsApp is not configured, the footer should omit the WhatsApp link rather than render a broken target.
- If search submission is not wired at implementation time, the field must not create a misleading dead-end interaction.
- Long category names must wrap or truncate safely without shrinking the tap target.

## Testing Strategy

### Functional

- Open and close the menu via trigger, close button, overlay, `Escape`, and route change.
- Expand and collapse `Explorar`.
- Verify chevron rotation matches expanded state.
- Verify `Ayuda` and `WhatsApp` render in footer, not main navigation.

### Accessibility

- Verify `aria-expanded` updates correctly.
- Verify `aria-controls` references a real submenu container.
- Verify keyboard access to trigger, submenu items, close button, and search.
- Verify contrast is acceptable for submenu text.

### Responsive

- Verify the footer remains accessible on short mobile viewports.
- Verify the middle section alone scrolls when category count grows.
- Verify no clipped content under top offset boundaries.

## Implementation Notes

- Keep changes minimal and isolated to the mobile navigation path.
- Follow existing project tokens from `src/app/globals.css`; do not introduce hardcoded hex values in components.
- Preserve existing pathname-driven close behavior.
- Prefer extending the current component rather than replacing the entire navigation system.

## Open Inputs Needed Before Implementation

- Social media destinations, if they should be real links on first release.