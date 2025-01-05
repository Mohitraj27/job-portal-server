import fs from 'fs';
import path from 'path';
import { Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dynamic API Documentation',
      version: '1.0.0',
      description: 'Swagger documentation generated dynamically from routes',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: [], // Not needed since we are generating dynamically
};

// Swagger spec initialization
const swaggerSpec = swaggerJSDoc(options);

// Dynamically generate paths from routes
const scanRoutesForSwagger = async (routesDirectory: string) => {
  const routeFiles = fs.readdirSync(routesDirectory);
  let swaggerPaths: Record<string, any> = {};

  // Loop through each route file
  for (const file of routeFiles) {
    const filePath = path.join(routesDirectory, file);
    if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
      try {
        // Dynamically import the route file
        const routeModule = await import(filePath);
        const routePath = filePath
          .replace(routesDirectory, '')
          .replace(/\.ts$/, '')
          .replace(/\.js$/, ''); // Adjust file extension if needed

        if (routeModule.router) {
          routeModule.router.stack.forEach((layer: any) => {
            if (layer.route) {
              const method = Object.keys(layer.route.methods)[0].toUpperCase();
              const path = layer.route.path;

              if (!swaggerPaths[path]) {
                swaggerPaths[path] = {};
              }

              // Generate Swagger definitions for each method (GET, POST, PUT, DELETE, etc.)
              if (method === 'GET') {
                swaggerPaths[path].get = {
                  summary: `GET ${path}`,
                  responses: {
                    200: {
                      description: 'Successful GET request',
                    },
                  },
                };
              } else if (method === 'POST') {
                swaggerPaths[path].post = {
                  summary: `POST ${path}`,
                  requestBody: {
                    required: true,
                    content: {
                      'application/json': {
                        schema: {
                          type: 'object',
                        },
                      },
                    },
                  },
                  responses: {
                    201: {
                      description: 'Resource created',
                    },
                  },
                };
              } else if (method === 'PUT') {
                swaggerPaths[path].put = {
                  summary: `PUT ${path}`,
                  requestBody: {
                    required: true,
                    content: {
                      'application/json': {
                        schema: {
                          type: 'object',
                        },
                      },
                    },
                  },
                  responses: {
                    200: {
                      description: 'Resource updated',
                    },
                  },
                };
              } else if (method === 'DELETE') {
                swaggerPaths[path].delete = {
                  summary: `DELETE ${path}`,
                  responses: {
                    204: {
                      description: 'Resource deleted',
                    },
                  },
                };
              }
            }
          });
        }
      } catch (error) {
        console.error(`Error importing route file: ${filePath}`, error);
      }
    }
  }

  return swaggerPaths;
};

// Update the swaggerSpec paths dynamically
const updateSwaggerPaths = async () => {
  const routesPath = path.join(__dirname, '..', 'routes');
  const paths = await scanRoutesForSwagger(routesPath);
//   @ts-ignore
  swaggerSpec.paths = paths;
};

// Setup Swagger UI with dynamic routes
export const setupSwagger = (app: Express) => {
  updateSwaggerPaths()
    .then(() => {
      app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    })
    .catch((error) => {
      console.error('Error setting up Swagger UI:', error);
    });
};
