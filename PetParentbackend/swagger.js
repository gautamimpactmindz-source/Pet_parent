import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "PetParentApi",
    description: "Pet Parent apis",
  },
  host: "localhost:4000",
  basePath: "/api",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter JWT token with Bearer prefix (Bearer <token>)"
    }
  },
   security: [
    {
      bearerAuth: []
    }
  ]
};

const outputFile = "./swagger-output.json";
const routes = ["./src/routes/user/auth.routes.js","./src/routes/pet/pet.basic.routes.js","./src/routes/admin/admin.manage.user.js","./src/routes/admin/admin.route.js","./src/routes/admin/pet.management.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
                  root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
