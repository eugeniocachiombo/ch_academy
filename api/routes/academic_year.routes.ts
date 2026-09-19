import { academicYearRepository } from "../repository/academic_year.repository.js";
import { CrudRoutes } from "./base/crud.routes.js";
import { Request, Response } from "express";

const academicRouter = new CrudRoutes(academicYearRepository, 'academic-years')?.router;
export const academicYearRoutes = academicRouter;