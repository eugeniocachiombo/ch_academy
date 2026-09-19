import { classRepository } from "../repository/class.repository.js";
import { CrudRoutes } from "./base/crud.routes.js";

const routerInstance = new CrudRoutes(classRepository, 'classes')?.router;
export const classRoutes = routerInstance;