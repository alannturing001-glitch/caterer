---
name: Caterer Dashboard Schema
description: Schema extensions for caterer dashboard — menu items and packages
---

menuItemsTable new columns: baseCost, sellingPrice, available (int 0/1), preparationTime, servingSize, minimumQuantity, dietary (jsonb array of strings), images (jsonb array of strings).

productsTable new columns: pricingModel (text: fixed/perGuest/dynamic), serviceFee, deliveryFee, packageSections (jsonb: [{key, label, selectedIds:[]}]), customizationRules (jsonb: {allowGuestCountChanges: bool, ...}), availableLocations, bookingNotice, maxEventsPerDay.

packageId on menuItemsTable is nullable — menu items exist independently; packageSections jsonb on productsTable links packages to menu item IDs.

**Why:** Original schema required packageId on menu items, preventing standalone item creation before packages exist. New architecture: create items first, then assemble into packages.

**How to apply:** After schema changes run `pnpm --filter @workspace/db run push`.
