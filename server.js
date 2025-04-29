import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";

// APP ADMIN
import appAdminRoutes from "./src/routes/appAdmin.routes.js"

// USER ROUTES
import userRoutes from "./src/routes/user.routes.js"

// ADD USER ROUTES 
import addUserRoutes from "./src/routes/addUser.routes.js"

// PLAN ROUTES
import planRoutes from "./src/routes/plan.routes.js"

// TEST ROUTES 
import testRoutes from "./src/routes/test.routes.js"

// Article ROUTES
import articleRoutes from "./src/routes/article.routes.js"

// HELP & Support ROUTES
import helpRoutes from "./src/routes/help.routes.js"

// PrivacyPolicy
import PrivacyPolicy from "./src/routes/privacypolicy.routes.js";

// Terms & Condition
import TermsCondition from "./src/routes/termsCondition.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
// app.use('/plan', express.static('uploads/plans'));
app.use(express.urlencoded({ extended: true }));

app.use("/api/appAdmin", appAdminRoutes)
app.use("/api/user", userRoutes)
app.use("/api/adduser", addUserRoutes)
app.use("/api/plan", planRoutes)
app.use("/api/test", testRoutes)
app.use("/api/article", articleRoutes)
app.use('/api/help', helpRoutes)
app.use('/api/privacypolicy', PrivacyPolicy)
app.use('/api/termscondition', TermsCondition)

// IN case Fail Config db.js
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log("SERVER RUNNING ON PORT:", process.env.PORT);
        });
    })
    .catch((err) => {
        console.log("MONGODB CONNECTION FAILED: ", err);
    });

