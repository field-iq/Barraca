# Component reference

Each entry: import · props · example · notes. All components accept `className` unless noted. Types are exported alongside components.

---
## Primitives (`components/ui`)

### Button
`import { Button } from '@/components/ui/button'`
Props: `variant?: 'raised'|'accent'|'ghost'|'danger'` (default raised) · `size?: 'sm'|'md'|'lg'` · `loading?` · `block?` · `leading?/trailing?: ReactNode` + all button attributes.
```tsx
<Button variant="accent" size="lg" trailing={<ArrowRight />}>Browse the collection</Button>
```
Notes: one `accent` button per view. Pressed state goes sunken (`active:shadow-soft-inset-sm`).

### IconButton
Props: `label` (required, becomes aria-label) · `size?` · `pressed?` (sunken + accent) · `accent?`.
```tsx
<IconButton label="Save" pressed={saved} onClick={toggle}><Heart /></IconButton>
```

### Toggle
Props: `checked` · `onChange(v)` · `label?` · `disabled?`. Sunken track, raised knob; knob turns accent when on. `role="switch"`.

### Checkbox
Props: `checked` · `onChange` · `label` · `description?`. Raised box that sinks when checked.

### RadioGroup
Props: `name` · `value` · `onChange` · `options: {value,label,hint?}[]`. Each option is a raised row that sinks when selected.

### Input / Textarea / Select
Sunken fields. `Input` accepts `leading?/trailing?` icons and `invalid?` (danger ring). `Select` takes `options: {value,label}[]` on a native `<select>`.

### FormField
Wrapper providing `label`, `htmlFor`, `hint?`, `error?`, `required?`. Error replaces hint and turns danger.

### Slider
Props: `value` · `onChange` · `min/max/step` · `format?(v)` · `label?`. Sunken track, accent fill, raised thumb. Native range under the hood.

### Badge
Props: `tone?: 'neutral'|'accent'|'success'|'warning'|'danger'` · `sunken?`. Uppercase micro-label.

### Chip
Props: `label` · `selected?` · `onClick?` · `onRemove?`. Filter chips (selected = sunken accent) or removable tags.

### Avatar
Props: `name` (initials fallback) · `src?` · `size?: 'sm'|'md'|'lg'|'xl'`.

### Tooltip
Props: `content` · `side?: 'top'|'bottom'`. CSS-only, shows on hover/focus-within.

### Divider
Props: `label?`. A sunken 4px groove, optionally with a centred label.

### Skeleton
Sunken shimmer placeholder. Size with `className` (e.g. `h-4 w-40`).

### Progress
Props: `value` 0–100 · `label?`. Sunken track, accent bar.

### Stepper
Props: `steps: string[]` · `current` (0-based). Done = accent disc, active = sunken accent, todo = raised muted.

### Tabs
Props: `tabs: {id,label,content}[]` · `defaultTab?`. Sunken segmented rail; active tab is a raised pill. Uncontrolled.

### Accordion
Props: `items: {id,title,content}[]` · `single?` (default true). Open panel sinks; the + rotates to ×.

### Breadcrumbs
Props: `items: {label, href?}[]`. Last item is `aria-current="page"`.

### Pagination
Props: `page` · `pages` · `onChange`. Collapses to first/last/±1 with ellipses.

### QuantityInput
Props: `value` · `onChange` · `min?=1` · `max?=99`. Sunken pill with two raised round buttons.

### RatingStars
Props: `value` (0–5) · `count?` · `size?: 'sm'|'md'`.

### PriceTag
Props: `amount` · `compareAt?` · `currency?='AUD'` · `size?` · `from?`. Locale `en-AU`, no cents.

---
## Navigation (`components/nav`)

### Navbar
Props: `links: {label,href}[]` · `cartCount?` · `onMenu?`. Sticky floating pill; includes theme toggle (needs `ThemeProvider`), cart badge, quote CTA, mobile menu trigger.

### MobileMenu
Props: `open` · `onClose` · `links`. Full-screen stack of raised tiles.

### SearchBar
Props: `value` · `onChange` · `placeholder?`. Sunken search well with clear button.

### Footer
Props: `columns: {title, links}[]` · `abn?`. Rounded-top raised slab; social icon buttons.

### ContactCard
Props: `address` · `phone` · `hours`.

---
## Marketing (`components/marketing`)

### Hero
Props: `eyebrow` · `title` (ReactNode — wrap a word in `<em className="text-nm-accent not-italic">` for emphasis) · `body` · `image` · `imageAlt`. Two-column, framed 4:5 photo.

### SplitHero
Props: `title` · `body` · `stats: {value,label}[]`. Raised slab with sunken stat wells.

### AnnouncementBar
Children only. Dismissible sunken strip; state is local — persist externally if needed.

### PromoBanner
Props: `kicker` · `title` · `cta` · `onCta?`. The one place the accent runs as a full field.

### CtaSection
Props: `title` · `body` · `primary` · `secondary?`. Centred copy in a large sunken well.

### FeatureGrid
Props: `items: {icon: LucideIcon, title, body}[]`. 3-up raised cards with sunken icon discs.

---
## Product (`components/product`)

### ProductCard
Props: `product: Product` (`slug,name,timber,price,compareAt?,image,badge?,leadTime?`) · `saved?` · `onSave?`.

### ProductGrid
Props: `products` · `columns?: 2|3|4`.

### CategoryTile
Props: `name` · `count` · `image` · `href`.

### WoodSwatchPicker
Props: `timbers: {id,name,hex,note?}[]` · `value` · `onChange`. Round timber swatches; selected sinks with a tick.

### DimensionSelector
Props: `options: {id,label,seats?,priceDelta?}[]` · `value` · `onChange` · `label?`.

### ProductDetail
Props: `name` · `price` · `images: string[]` · `timbers` · `sizes` · `description`. Composes gallery + swatches + sizes + quantity + add-to-order; owns its own state.

---
## Forms & booking (`components/forms`)

### QuoteRequestForm
Props: `onSubmit?(data)`. Piece-type chips, contact fields, timber select, budget slider, details.

### DatePicker
Props: `value?: Date` · `onChange` · `disabledDay?(d)`. Monday-first month grid, 320px wide.

### ConsultationBooking
Props: `onBook?(date, slot, mode)`. DatePicker + location radio + time chips + confirm button that echoes the choice.

### NewsletterForm
Props: `title?` · `body?`. Inline email pill; swaps to a success line on submit.

---
## Cart & checkout (`components/cart`)

### CartItem
Props: `line: CartLine` (`id,name,spec,price,qty,image`) · `onQty` · `onRemove`.

### OrderSummary
Props: `subtotal` · `delivery` (0 = "Quoted") · `deposit?=0.5` · `cta?` · `onCheckout?`. Highlights the deposit due today.

### CartDrawer
Props: `open` · `onClose` · `lines` · `onQty(id,q)` · `onRemove(id)`. Right-side sheet with backdrop; shows EmptyState when empty.

### CheckoutSteps
Props: `current`. Stepper for Details → Delivery → Deposit → Confirm inside a sunken rail.

### PaymentMethod
Props: `value` · `onChange`. Card / bank transfer / Afterpay tiles.

---
## Reviews (`components/reviews`)

### TestimonialCard
Props: `t: Testimonial` (`quote,name,location,piece,rating,avatar?`).

### ReviewList
Props: `reviews` · `average` · `distribution: number[5]` (5★ first).

---
## Gallery & media (`components/media`)

### GalleryGrid
Props: `images: {src,alt,span?:'wide'|'tall'}[]` · `onOpen?(i)`. Masonry-ish 4-col grid.

### Lightbox
Props: `images` · `index: number|null` · `onClose` · `onIndex`. Esc / ← → keyboard.

### BeforeAfter
Props: `before` · `after` · `alt`. Draggable comparison (raw slab → finished piece).

### VideoCard
Props: `poster` · `title` · `duration` · `onPlay?`.

---
## Events (`components/events`)

### EventCard
Props: `e: {date: Date, title, body, place, spots?}`.

### CalendarMonth
Props: `month: Date` · `events: {date, label}[]`. Days with events are raised, others sunken.

---
## Feedback (`components/feedback`)

### ToastProvider / useToast / Toast
`const toast = useToast(); toast({ title, body?, tone: 'success'|'warning'|'info' })`. Auto-dismiss 5s, bottom-right stack.

### Modal
Props: `open` · `onClose` · `title` · `footer?` · children. Esc closes; click-outside closes.

### ConfirmDialog
Props: `open` · `onClose` · `onConfirm` · `title` · `body` · `confirmLabel?` · `destructive?`.

### Alert
Props: `tone?: 'info'|'success'|'warning'|'danger'` · `title` · children. Sunken well with raised icon disc.

### EmptyState
Props: `title` · `body` · `action?` · `onAction?`.

---
## Data display (`components/data`)

### StatCard
Props: `label` · `value` · `delta?` · `icon?: LucideIcon`.

### DataTable
Generic: `columns: Column<T>[]` (`key, header, align?, render?`) · `rows: T[]` (need `id`) · `caption?`. Rows sink on hover.

### Timeline
Props: `steps: {title, body, date?, state:'done'|'active'|'todo'}[]`. Order-progress tracker.

### SpecList
Props: `items: [key, value][]` · `title?`.

---
## Journal (`components/blog`)

### ArticleCard
Props: `a: Article` (`slug,title,excerpt,category,date,readTime,image`) · `featured?`.

### AuthorByline
Props: `name` · `role` · `date` · `avatar?`.

### ArticleHeader
Props: `title` · `dek` · `category` · `author: {name, role}` · `date` · `image`.

### TableOfContents
Props: `items: {id,label}[]` · `active?` · `onSelect?`.

---
## Conventions

- **Client components** are marked `'use client'`; everything else renders on the server.
- **Icons**: lucide-react, 16px in controls (`size-4`), 20px in feature discs.
- **Images**: plain `<img>` for portability — swap for `next/image` once domains are configured.
- **State**: controlled where a parent needs the value (Toggle, Slider, pickers); uncontrolled convenience only in Tabs and Accordion.
