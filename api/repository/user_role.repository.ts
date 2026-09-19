import { z } from 'zod';
import { Crud } from "./base/crud.repository.js";

export const createUserRoleSchema = z.object({
    user_id: z.number("O usuário é obrigatório"),
    role_id: z.number("A função é obrigatória")
});

export const updateUserRoleSchema = createUserRoleSchema.partial();

export type CreateUserRoleInput = z.infer<typeof createUserRoleSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

class UserRoleRepository extends Crud {
    constructor() {
        super("userRole", {
            create: createUserRoleSchema,
            update: updateUserRoleSchema
        });
    }
}

export const userRoleRepository = new UserRoleRepository();