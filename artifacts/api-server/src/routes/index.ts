import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";

// Import refactored feature-based routers
import { createPackagesRouter } from "@features/packages";
import { createEventTypesRouter } from "@features/event-types";
import { createMenuItemsRouter } from "@features/menu-items";
import { createAdditionalServicesRouter } from "@features/additional-services";
import { createUsersRouter } from "@features/users";
import { createQuotationsRouter } from "@features/quotations";

const router: IRouter = Router();

// Health check (keep as-is)
router.use(healthRouter);

// Admin dashboard
router.use(adminRouter);

// Feature-based routers
router.use(createPackagesRouter());
router.use(createEventTypesRouter());
router.use(createMenuItemsRouter());
router.use(createAdditionalServicesRouter());
router.use(createUsersRouter());
router.use(createQuotationsRouter());

export default router;
