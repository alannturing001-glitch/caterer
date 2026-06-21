import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import usersRouter from "./users";
import ordersRouter from "./orders";
import adminRouter from "./admin";
import menuItemsRouter from "./menuItems";
import additionalServicesRouter from "./additionalServices";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(usersRouter);
router.use(ordersRouter);
router.use(adminRouter);
router.use(menuItemsRouter);
router.use(additionalServicesRouter);

export default router;
