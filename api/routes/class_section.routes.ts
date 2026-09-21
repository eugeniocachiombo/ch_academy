import { classSectionRepository } from "../repository/class_section.repository.js";
import { CrudRoutes } from "./base/crud.routes.js";

const routerInstance = new CrudRoutes(classSectionRepository, 'class-sections')?.router;
export const classSectionRoutes = routerInstance;