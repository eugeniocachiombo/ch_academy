import express from "express";
import cors from "cors";
import { userRoutes } from "./routes/user.routes.js";
import { academicYearRoutes } from "./routes/academic_year.routes.js";
import { courseRoutes } from "./routes/course.routes.js";
import { classRoutes } from "./routes/class.routes.js";
import { subjectRoutes } from "./routes/subject.routes.js";
import { roleRoutes } from "./routes/role.routes.js";
import { permitionRoutes } from "./routes/permition.routes.js";
import { userRoleRoutes } from "./routes/user_role.routes.js";
import { rolePermitionRoutes } from "./routes/role_permition.routes.js";
import { classRoomRoutes } from "./routes/class_room.routes.js";
const app = express();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", academicYearRoutes);
app.use("/api", courseRoutes);
app.use("/api", classRoutes);
app.use("/api", subjectRoutes);
app.use("/api", roleRoutes);
app.use("/api", permitionRoutes);
app.use("/api", userRoleRoutes);
app.use("/api", rolePermitionRoutes);
app.use("/api", classRoomRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API rodando!",
    environment: process.env.NODE_ENV,
  });
});


if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Servidor a rodar na porta 3000");
  });
}

export default app;