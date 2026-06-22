# Developer Quick Reference: Adopted Components

## 📋 At a Glance

| Component | Import | Use Case | Key Methods |
|-----------|--------|----------|------------|
| **Validation** | `lib/validation` | Form validation & type safety | `schemas.createEvent.parse()` |
| **Sanitization** | `lib/sanitize` | Prevent XSS | `sanitize()`, `sanitizeFormData()` |
| **Notifications API** | `lib/notification-api` | CRUD notifications | `notificationApi.createNotification()` |
| **Notification Helpers** | `lib/notification-helpers` | Create catering events | `createQuotationReceivedNotification()` |
| **Notifications Hook** | `hooks/useNotifications` | Display notifications in UI | `const {notifications, unreadCount} = useNotifications()` |
| **Session Timeout** | `hooks/useSessionTimeout` | Auto-logout | `useSessionTimeout()` - just call it |
| **Auth Utils** | `lib/auth-utils` | Server-side RBAC | `await requireAdmin()` |
| **API Client** | `lib/api` | HTTP requests | `apiClient.post('/api/events', data)` |
| **Catering Store** | `store/cateringStore` | Event & quote state | `const {eventPackageBuilder} = useCateringStore()` |

---

## ⚡ Common Patterns

### 1. Validate & Submit Form
```typescript
import { schemas } from '@/lib/validation';
import { sanitizeFormData } from '@/lib/form-sanitize';
import { apiClient } from '@/lib/api';

const validated = schemas.createEvent.parse(formData);
const clean = sanitizeFormData(validated);
const res = await apiClient.post('/api/events', clean);
```

### 2. Create Notification
```typescript
import { createQuotationReceivedNotification } from '@/lib/notification-helpers';

await createQuotationReceivedNotification(
  customerId, caterName, eventName, quotationId
);
```

### 3. Display Notifications
```typescript
'use client';
import { useNotifications } from '@/hooks/useNotifications';

const { notifications, unreadCount, markAsRead } = useNotifications();

return (
  <div>
    {notifications.map(n => (
      <div key={n.id} onClick={() => markAsRead(n.id)}>
        {n.title}: {n.message}
      </div>
    ))}
  </div>
);
```

### 4. Protect Server Action
```typescript
'use server';
import { requireAdmin } from '@/lib/auth-utils';

export async function deleteUser(id: string) {
  await requireAdmin(); // Throws if not admin
  // Delete logic here
}
```

### 5. Manage Event & Quotes
```typescript
'use client';
import { useCateringStore } from '@/store/cateringStore';

const { eventPackageBuilder, addMenuItemToPackage, calculatePackageTotals } = useCateringStore();

eventPackageBuilder?.items.forEach(item => {
  // Render item with price * guestCount
});

addMenuItemToPackage(menuItem);
calculatePackageTotals();
```

---

## 🔑 Key Types

### Validation Schemas
```typescript
schemas.createEvent
schemas.caterProfile
schemas.createQuotation
schemas.createMenuItem
schemas.signup
schemas.login
```

### Notifications
```typescript
NotificationType.QUOTATION_RECEIVED
NotificationType.QUOTATION_REQUESTED
NotificationType.BOOKING_CONFIRMED
NotificationType.PAYMENT_DUE
NotificationType.EVENT_REMINDER
```

### Store Types
```typescript
EventPackageBuilder, Quotation, QuotationLineItem, MenuItem
```

---

## 🛠 Setup Checklist

- [ ] Install: `pnpm add zod dompurify next-auth react-hot-toast zustand`
- [ ] Set env: `NEXT_PUBLIC_API_BASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- [ ] Add hook to layout: `useSessionTimeout()` in root
- [ ] Create API endpoints for notifications
- [ ] Test with quick-start examples

---

## 🚫 Common Mistakes

| ❌ Don't | ✅ Do |
|---------|------|
| Skip validation | Use `schemas.parse()` before submit |
| Send raw user input | Call `sanitizeFormData()` first |
| Check role in UI | Use `requireAdmin()` in server actions |
| Forget auth headers | `apiClient` handles them automatically |
| Dispatch mutations | Use store actions: `addMenuItemToPackage()` |
| Forget to calculate totals | Call `calculatePackageTotals()` after state changes |

---

## 📚 File Paths (Relative to `artifacts/shop/src`)

```
lib/validation.ts                 → Zod schemas
lib/sanitize.ts                   → XSS prevention
lib/form-sanitize.ts              → Form field sanitization
lib/notification-api.ts           → Notification CRUD
lib/notification-helpers.ts       → Helper functions
lib/auth-utils.ts                 → Server-side auth
lib/api.ts                        → HTTP client

hooks/useNotifications.ts         → Notifications in UI
hooks/useSessionTimeout.ts        → Auto-logout

types/notification.ts             → Notification types

store/cateringStore.ts            → Event & quote state
```

---

## 🔍 Debugging Tips

**Validation error?** 
- Check `error.errors[0].message` for Zod error
- Use `.safeParse()` instead of `.parse()` to catch errors

**Auth failing?**
- Verify `NEXTAUTH_SECRET` is set
- Check token in `localStorage` under key `auth-token`

**Notifications not loading?**
- Verify session is authenticated (`useSession()`)
- Check browser console for API errors
- Ensure `/api/notifications/*` endpoints exist

**Store not persisting?**
- Check browser DevTools → Application → LocalStorage
- Should see `catering-store` key

**Form not sanitizing?**
- Ensure `sanitizeFormData()` is called before API call
- Check browser DevTools → Network to see request body

---

## 📖 Quick Links

- [Zod Documentation](https://zod.dev)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [NextAuth Documentation](https://next-auth.js.org)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

## 💬 Examples by Task

### Task: Allow customer to create an event
1. Create form component
2. Use `schemas.createEvent` for validation
3. Call `sanitizeFormData()` before submit
4. POST to `/api/events` via `apiClient`
5. Store event in `useCateringStore` via `initEventPackage()`
6. Redirect to quote browser

### Task: Show notification when quote received
1. In server action (when quote saved):
   ```typescript
   import { createQuotationReceivedNotification } from '@/lib/notification-helpers';
   await createQuotationReceivedNotification(customerId, caterName, eventName, quoteId);
   ```
2. In UI component:
   ```typescript
   const { notifications } = useNotifications();
   // Render notifications array
   ```
3. Hook polls every 30 seconds automatically

### Task: Protect admin-only endpoint
1. In server action:
   ```typescript
   'use server';
   import { requireAdmin } from '@/lib/auth-utils';
   export async function deleteUser(id: string) {
     await requireAdmin(); // Throws if not admin
   }
   ```
2. Call from client: automatically rejected if not admin

### Task: Submit quotation with items
1. Build state in `useCateringStore`
2. Validate with `schemas.createQuotation.parse()`
3. Sanitize with `sanitizeFormData()`
4. POST via `apiClient.post()`
5. Send notification with `createNotification()`

---

## 📞 Support

See full docs in:
- `COMPONENT_ADOPTION_GUIDE.md` - Detailed component reference
- `IMPLEMENTATION_ROADMAP.md` - Phased rollout plan
- Inline JSDoc in each component file

Happy coding! 🚀
