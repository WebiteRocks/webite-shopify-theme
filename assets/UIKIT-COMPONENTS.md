# UIkit Components Selection Guide

Review this list and mark which components you want to KEEP. I'll then create a custom build.

## Current File Sizes
- `uikit.min.css`: 264.9 KB
- `uikit.min.js`: 149.2 KB
- `uikit.css` (unminified): 377.4 KB
- `uikit.js` (unminified): 317.4 KB

---

## CSS COMPONENTS

Mark with [x] to KEEP, [ ] to REMOVE:

### Core / Required
- [x] **Base** - HTML resets, typography defaults (REQUIRED)
- [x] **Container** - Max-width containers
- [x] **Grid** - Flexbox grid system
- [x] **Width** - Width utilities (1-1, 1-2, 1-3, etc.)
- [x] **Flex** - Flexbox utilities
- [x] **Margin** - Margin utilities
- [x] **Padding** - Padding utilities
- [x] **Position** - Position utilities (relative, absolute, fixed)
- [x] **Visibility** - Show/hide utilities
- [x] **Utility** - Misc utilities (clearfix, etc.)

### Typography & Text
- [x] **Text** - Text utilities (alignment, transform, etc.)
- [x] **Heading** - Heading styles
- [x] **Link** - Link styles
- [ ] **Article** - Article/blog post styling
- [ ] **Comment** - Comment thread styling
- [ ] **Description** - Description list styling
- [ ] **Leader** - Dot leaders for pricing tables

### Buttons & Forms
- [x] **Button** - Button styles
- [x] **Form** - Form element styles
- [ ] **Search** - Search input styling

### Navigation
- [x] **Nav** - Vertical navigation
- [x] **Navbar** - Horizontal navigation bar
- [ ] **Subnav** - Sub-navigation
- [ ] **Breadcrumb** - Breadcrumb navigation
- [x] **Pagination** - Pagination styling
- [ ] **Tab** - Tab navigation
- [ ] **Dotnav** - Dot navigation (for sliders)
- [ ] **Slidenav** - Slider navigation arrows
- [ ] **Iconnav** - Icon navigation
- [ ] **Thumbnav** - Thumbnail navigation

### Components
- [x] **Accordion** - Accordion/collapse
- [x] **Card** - Card component
- [x] **Modal** - Modal dialogs
- [x] **Offcanvas** - Off-canvas panels (side cart, mobile nav)
- [x] **Dropdown** - Dropdown menus
- [ ] **Drop** - Drop component (advanced dropdown)
- [ ] **Dropbar** - Dropdown bar
- [ ] **Dropnav** - Dropdown navigation
- [x] **Alert** - Alert messages
- [ ] **Notification** - Toast notifications
- [x] **Badge** - Badges
- [x] **Label** - Labels
- [ ] **Tooltip** - Tooltips
- [ ] **Progress** - Progress bars
- [ ] **Spinner** - Loading spinner
- [ ] **Lightbox** - Image lightbox
- [x] **Close** - Close button/icon
- [ ] **Marker** - Map markers
- [ ] **Totop** - Scroll to top button
- [ ] **Placeholder** - Placeholder boxes
- [ ] **Countdown** - Countdown timer

### Tables & Lists
- [x] **Table** - Table styling
- [x] **List** - List styling

### Media & Images
- [ ] **Cover** - Cover images/videos
- [x] **Overlay** - Image overlays
- [x] **Section** - Section styling with backgrounds
- [x] **Tile** - Tile backgrounds
- [x] **Background** - Background utilities
- [x] **Icon** - Icon styling
- [ ] **SVG** - SVG utilities

### Sliders & Animation
- [ ] **Slider** - Content slider
- [ ] **Slideshow** - Slideshow component
- [ ] **Switcher** - Content switcher
- [x] **Transition** - Transition utilities
- [x] **Animation** - Animation utilities
- [ ] **Parallax** - Parallax effects
- [ ] **Sortable** - Drag and drop sorting

### Layout
- [x] **Align** - Float/alignment utilities
- [ ] **Column** - CSS columns
- [x] **Divider** - Horizontal dividers
- [ ] **Height** - Height utilities
- [ ] **Inverse** - Inverse color mode (light on dark)
- [ ] **Print** - Print styles
- [ ] **Sticky** - Sticky positioning

---

## JAVASCRIPT COMPONENTS

Mark with [x] to KEEP, [ ] to REMOVE:

### Core (Always Required)
- [x] **Core/API** - UIkit core functionality (REQUIRED)

### Components
- [x] **Accordion** - Accordion toggle
- [x] **Alert** - Dismissible alerts
- [x] **Drop/Dropdown** - Dropdown behavior
- [x] **Modal** - Modal dialogs
- [x] **Offcanvas** - Off-canvas panels
- [x] **Nav** - Collapsible navigation
- [x] **Navbar** - Navbar dropdowns
- [x] **Toggle** - Toggle visibility
- [x] **Scroll** - Smooth scroll
- [ ] **Scrollspy** - Scroll spy
- [ ] **ScrollspyNav** - Scroll spy navigation
- [ ] **Sticky** - Sticky elements
- [x] **Switcher** - Content switcher
- [ ] **Tab** - Tab component
- [ ] **Grid/Masonry** - Masonry grid layout
- [x] **HeightMatch** - Match element heights
- [ ] **HeightViewport** - Viewport height
- [ ] **Cover** - Cover video/image
- [ ] **Video** - Video autoplay control
- [ ] **Countdown** - Countdown timer
- [ ] **Filter** - Filtering functionality
- [ ] **Lightbox** - Image lightbox
- [ ] **Notification** - Toast notifications
- [ ] **Parallax** - Parallax scrolling
- [ ] **Slider** - Content slider
- [ ] **Slideshow** - Image slideshow
- [ ] **Sortable** - Drag & drop
- [ ] **Tooltip** - Tooltips
- [ ] **Upload** - File upload
- [ ] **Svg** - SVG injection
- [ ] **Img** - Lazy loading images
- [x] **Icon** - Icon component
- [ ] **Leader** - Dot leaders
- [ ] **FormCustom** - Custom form elements
- [ ] **Responsive** - Responsive iframe
- [ ] **Inverse** - Inverse color detection
- [ ] **OverflowAuto** - Auto overflow handling

---

## YOUR THEME USAGE ANALYSIS

Based on your theme files, you're using these components:

### Definitely Used:
- Grid, Width, Flex, Container
- Navbar, Nav, Offcanvas
- Card, Button, Form
- Accordion (filters)
- Modal (quick view)
- Dropdown
- Icon, Badge, Label
- Pagination
- Table, List
- Toggle, Scroll, HeightMatch
- Margin, Padding, Text, Position, Visibility
- Section, Tile, Background, Overlay
- Transition, Animation

### Probably NOT Used:
- Slider, Slideshow (you use Swiper instead)
- Lightbox
- Countdown
- Parallax
- Sortable
- Upload
- Tooltip
- Notification
- Sticky (not sure)
- Tab, Subnav
- Comment, Article
- Breadcrumb
- Search
- Cover
- Leader
- Marker

---

## NEXT STEPS

1. Edit this file and mark your selections
2. Tell me your choices
3. I'll create custom `uikit-custom.css` and `uikit-custom.js` files

**Estimated savings**: 30-50% reduction in file size (could get down to ~150KB CSS and ~80KB JS)
