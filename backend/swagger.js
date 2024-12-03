import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';

// Get the current file path and directory name
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sports News Service API",
      description:
        "API endpoints for a Sports News services documented on swagger",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000/",
        description: "Local server",
      },
    ],
  },
  // looks for configuration in specified directories
  apis: ["./src/routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app, port) {
//   // Serve the custom CSS file
//   app.use(
//     "/swagger-custom.css",
//     express.static(path.join(__dirname, "swagger-custom.css"))
//   );

  // Swagger Page with custom CSS
//   app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
//     customCssUrl: '/swagger-custom.css'
//   }));

  // Swagger Page with custom CSS
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
export default swaggerDocs;
