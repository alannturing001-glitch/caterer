import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import ordersRouter from "./orders";

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

// Legacy routes — kept for frontend compatibility
router.use(productsRouter);
router.use(categoriesRouter);
router.use(ordersRouter);

// Feature-based routers
router.use(createPackagesRouter());
router.use(createEventTypesRouter());
router.use(createMenuItemsRouter());
router.use(createAdditionalServicesRouter());
router.use(createUsersRouter());
router.use(createQuotationsRouter());

export default router;
