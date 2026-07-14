import { Router } from "express";
import { Contactmail } from "../../controllers/contact/contact.controller.js";

const contactRouter = Router();


contactRouter.post("/contact",Contactmail)


export default contactRouter