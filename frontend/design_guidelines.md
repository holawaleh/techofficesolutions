# Design Guidelines: Multi-Sector Management Platform

## Design Approach

**Selected Framework:** Design System Approach - Material Design 3 inspired with professional refinement  
**Justification:** Enterprise management system requiring consistent, scalable patterns across multiple sectors, role-based interfaces, and data-heavy dashboards. Prioritizes clarity, efficiency, and learnability over visual novelty.

**Core Principles:**
- Sector differentiation through subtle color coding
- Clear visual hierarchy for role-based permissions
- Consistent patterns across all six sectors
- Professional, trustworthy aesthetic for business users
- Accessible, readable interfaces for extended use

---

## Color Palette

### Light Mode
- **Primary Brand:** 217 91% 60% (Professional Blue)
- **Surface:** 0 0% 100% (White)
- **Surface Variant:** 217 20% 97% (Light Gray-Blue)
- **On Surface:** 217 20% 15% (Charcoal)
- **Border:** 217 15% 88% (Soft Gray)

### Dark Mode  
- **Primary Brand:** 217 91% 65% (Brighter Blue)
- **Surface:** 217 15% 12% (Deep Charcoal)
- **Surface Variant:** 217 12% 18% (Dark Gray)
- **On Surface:** 0 0% 95% (Off-White)
- **Border:** 217 10% 25% (Subtle Gray)

### Sector Accent Colors (Light Mode)
- **Hospitality:** 340 75% 55% (Warm Coral)
- **Commerce:** 142 70% 45% (Professional Green)
- **Tourism:** 200 85% 50% (Sky Blue)
- **Health:** 155 65% 48% (Medical Teal)
- **Agriculture:** 85 60% 50% (Earth Green)
- **Others:** 270 50% 55% (Neutral Purple)

### Status Colors
- **Success:** 142 70% 45%
- **Warning:** 38 90% 50%
- **Error:** 0 72% 55%
- **Info:** 217 91% 60%

---

## Typography

**Font Stack:** Inter (Primary), system-ui (Fallback)  
**CDN:** Google Fonts - Inter (weights: 400, 500, 600, 700)

### Hierarchy
- **Hero/Display:** text-5xl md:text-6xl, font-bold, tracking-tight
- **H1 Dashboard:** text-3xl, font-bold, leading-tight
- **H2 Section:** text-2xl, font-semibold
- **H3 Card Title:** text-xl, font-semibold
- **Body Large:** text-base, font-normal
- **Body:** text-sm, font-normal
- **Caption/Label:** text-xs, font-medium, uppercase, tracking-wide

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 8, 12, 16, 24 (p-2, p-4, gap-8, space-y-12, etc.)

### Grid Structure
- **Landing Page:** max-w-7xl mx-auto, px-4 sm:px-6 lg:px-8
- **Dashboard:** Sidebar (w-64) + Main Content (flex-1 min-w-0)
- **Cards Grid:** grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- **Responsive Breakpoints:** sm:640px, md:768px, lg:1024px, xl:1280px

### Vertical Rhythm
- **Section Padding:** py-12 md:py-20 (landing), py-8 (dashboard)
- **Component Spacing:** space-y-6 (major), space-y-4 (moderate), space-y-2 (tight)
- **Card Padding:** p-6

---

## Component Library

### Landing Page Components

**Hero Section (80vh minimum):**
- Large hero image (professional team or multi-sector collage)
- Centered content with max-w-3xl
- Headline: text-5xl md:text-6xl font-bold
- Subheadline: text-xl md:text-2xl text-gray-600 dark:text-gray-300
- Dual CTA buttons (primary + outline with backdrop-blur-sm on image)
- Trust indicators below CTAs (e.g., "Trusted by 500+ Organizations")

**Features Grid:**
- 3-column layout (lg:grid-cols-3)
- Sector icons using Heroicons (via CDN)
- Icon background circles with sector accent colors at 10% opacity
- Title + 2-3 line description per feature
- Subtle hover transform (hover:scale-105 transition)

**Value Proposition Section:**
- 2-column split: Text (60%) + Supporting image (40%)
- Bullet points with checkmark icons
- "Why Choose Us" narrative

**Social Proof:**
- Stats counter row (4 columns: Users, Sectors, Countries, Uptime)
- Large numbers with descriptive labels
- Subtle separator lines between stats

**CTA Section:**
- Full-width bg-gradient-to-r from-primary to-primary/80
- Centered headline + description + primary button
- Generous padding (py-20)

**Footer:**
- 4-column grid: About, Sectors, Resources, Contact
- Newsletter signup form
- Social media icons (LinkedIn, Twitter)
- Copyright and legal links

### Dashboard Components

**Navigation:**
- **Top Bar:** Fixed, bg-surface border-b, contains logo, search, notifications, user menu
- **Sidebar:** Sector navigation with icons, active state with accent color + bg-surface-variant
- Collapsible on mobile (hamburger menu)

**Dashboard Cards:**
- Rounded corners (rounded-lg)
- Shadow (shadow-sm hover:shadow-md transition)
- Sector accent color top border (border-t-4)
- Header with icon + title + action menu
- Content area with appropriate data visualization

**Data Tables:**
- Striped rows (even:bg-surface-variant)
- Sticky header
- Sortable columns with arrow indicators
- Row hover state (hover:bg-surface-variant/50)
- Action buttons in final column

**Staff Management Panel:**
- User card grid with avatars
- Role badges (px-2 py-1 rounded-full text-xs with role-specific colors)
- Permission toggles (switch components)
- Add Staff modal with form fields

**Interest Selection (Onboarding):**
- 6-card grid (2 rows × 3 columns on desktop)
- Large sector icons centered
- Checkbox selection with accent color fill
- Selected state: border-2 border-accent bg-accent/5
- Progress indicator at top

**Form Elements:**
- Input fields: border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary
- Labels: text-sm font-medium mb-1.5
- Helper text: text-xs text-gray-500
- Error states: border-red-500 text-red-600

**Buttons:**
- **Primary:** bg-primary text-white px-6 py-2.5 rounded-lg font-medium
- **Outline:** border-2 border-primary text-primary bg-transparent
- **Ghost:** text-primary hover:bg-primary/10
- Size variants: sm (px-4 py-2 text-sm), default, lg (px-8 py-3)

**Modals/Dialogs:**
- Backdrop: bg-black/50 backdrop-blur-sm
- Content: max-w-2xl rounded-xl shadow-2xl
- Header with close button
- Footer with action buttons (right-aligned)

---

## Images

**Hero Image:** Professional photograph showing diverse team collaboration or multi-sector business environment (hospitality, healthcare, agriculture elements subtly present). Modern office setting with warm lighting. Image should be high-quality, 1920×1080 minimum.

**Value Proposition Image:** Dashboard mockup or sector-specific imagery (e.g., hotel reception, farm, clinic) showing technology integration.

**Sector Icons:** Use Heroicons via CDN - BuildingOfficeIcon, ShoppingBagIcon, GlobeAltIcon, HeartIcon, BeakerIcon, EllipsisHorizontalCircleIcon for the six sectors.

**Avatar Placeholders:** Use generic initials-based avatars with sector accent colors as backgrounds.

---

## Animations

**Minimal and Purposeful:**
- Hover transforms: scale-105 on cards (transition-transform duration-200)
- Page transitions: fade-in for route changes
- Loading states: Subtle pulse on skeleton screens
- NO scroll-triggered animations, parallax, or complex interactions

---

## Accessibility

- WCAG AA contrast ratios maintained across all color combinations
- Focus indicators: ring-2 ring-primary ring-offset-2
- Keyboard navigation fully supported
- ARIA labels on icon-only buttons
- Form field labels properly associated
- Dark mode toggle accessible and persistent