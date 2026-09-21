import { classRoomRepository } from "../repository/class_room.repository.js";
import { CrudRoutes } from "./base/crud.routes.js";

const routerInstance = new CrudRoutes(classRoomRepository, 'class-rooms')?.router;
export const classRoomRoutes = routerInstance;