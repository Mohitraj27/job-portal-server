const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the module name: ', (moduleName) => {
  if (!moduleName) {
    console.log('Module name cannot be empty.');
    rl.close();
    return;
  }

  const mainDir = path.resolve(__dirname, '..');
  const srcPath = path.join(mainDir, 'src');
  const modulePath = path.join(srcPath, 'modules', moduleName);
  const capitalizedModuleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

  const files = {
    route: `${moduleName}.route.ts`,
    enum: `${moduleName}.enum.ts`,
    model: `${moduleName}.model.ts`,
    validation: `${moduleName}.validation.ts`,
    types: `${moduleName}.types.ts`,
    controller: `${moduleName}.controller.ts`,
    service: `${moduleName}.service.ts`,
  };

  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
    console.log(`Created folder: ${modulePath}`);
  } else {
    console.log(`Folder already exists: ${modulePath}`);
  }

  // File Contents

  const controllerContent = `
import { NextFunction, Request, Response } from 'express';
import { ${moduleName}Service } from './${moduleName}.service';
import httpStatus from '@utils/httpStatus';
import { ${moduleName.toUpperCase()}_MESSAGES } from './${moduleName}.enum';
import { throwError } from '@utils/throwError';

export const ${moduleName}Controller = {
  async create${capitalizedModuleName}(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ${moduleName}Service.create${capitalizedModuleName}(req.body);
      res.sendResponse(httpStatus.CREATED, data, ${moduleName.toUpperCase()}_MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  },

  async getAll${capitalizedModuleName}s(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ${moduleName}Service.getAll${capitalizedModuleName}s(req.query);
      res.sendResponse(httpStatus.OK, data, ${moduleName.toUpperCase()}_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async getSingle${capitalizedModuleName}(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ${moduleName}Service.getSingle${capitalizedModuleName}(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, ${moduleName.toUpperCase()}_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, ${moduleName.toUpperCase()}_MESSAGES.FETCHED);
    } catch (error) {
      next(error);
    }
  },

  async update${capitalizedModuleName}(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ${moduleName}Service.update${capitalizedModuleName}(req.params.id, req.body);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, ${moduleName.toUpperCase()}_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, ${moduleName.toUpperCase()}_MESSAGES.UPDATED);
    } catch (error) {
      next(error);
    }
  },

  async delete${capitalizedModuleName}(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ${moduleName}Service.delete${capitalizedModuleName}(req.params.id);
      if (!data) {
        return throwError(httpStatus.NOT_FOUND, ${moduleName.toUpperCase()}_MESSAGES.NOT_FOUND);
      }
      res.sendResponse(httpStatus.OK, data, ${moduleName.toUpperCase()}_MESSAGES.DELETED);
    } catch (error) {
      next(error);
    }
  }
};
  `;

  const serviceContent = `
import ${moduleName}Model from './${moduleName}.model';
import { I${capitalizedModuleName} } from './${moduleName}.types';

export const ${moduleName}Service = {
  async create${capitalizedModuleName}(data: I${capitalizedModuleName}) {
    return await ${moduleName}Model.create(data);
  },

  async getAll${capitalizedModuleName}s(query: any) {
    return await ${moduleName}Model.find(query);
  },

  async getSingle${capitalizedModuleName}(id: string) {
    return await ${moduleName}Model.findById(id);
  },

  async update${capitalizedModuleName}(id: string, data: Partial<I${capitalizedModuleName}>) {
    return await ${moduleName}Model.findByIdAndUpdate(id, data, { new: true });
  },

  async delete${capitalizedModuleName}(id: string) {
    return await ${moduleName}Model.findByIdAndDelete(id);
  }
};
  `;

  const enumContent = `
export const ${moduleName.toUpperCase()}_MESSAGES = {
  CREATED: '${capitalizedModuleName} created successfully.',
  UPDATED: '${capitalizedModuleName} updated successfully.',
  DELETED: '${capitalizedModuleName} deleted successfully.',
  FETCHED: '${capitalizedModuleName} fetched successfully.',
  NOT_FOUND: '${capitalizedModuleName} not found.',
};
  `;

  const validationContent = `
import { z } from 'zod';
import { validateSchema } from '@middlewares/validation.middleware';

const ${capitalizedModuleName}Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export const validate${capitalizedModuleName} = validateSchema(${capitalizedModuleName}Schema,'body');
  `;

  const typesContent = `
import mongoose, { Document } from 'mongoose';

export interface I${capitalizedModuleName} extends Document {
  name: string;
  description: string;
}
  `;

  const modelContent = `
import mongoose, { Schema } from 'mongoose';
import { I${capitalizedModuleName} } from './${moduleName}.types';

const ${capitalizedModuleName}Schema: Schema<I${capitalizedModuleName}> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<I${capitalizedModuleName}>('${capitalizedModuleName}', ${capitalizedModuleName}Schema);
  `;

  const routeContent = `
import { Router } from 'express';
import { ${moduleName}Controller } from './${moduleName}.controller';
import { validate${capitalizedModuleName} } from './${moduleName}.validation';
import { validateObjectId } from '@middlewares/validateobjectid.middleware';
import { responseMiddleware } from '@middlewares/responseMiddleware';

const ${moduleName}Router = Router();
${moduleName}Router.param('id', validateObjectId);
${moduleName}Router.use(responseMiddleware);
${moduleName}Router.post('/create-${moduleName}', validate${capitalizedModuleName}, ${moduleName}Controller.create${capitalizedModuleName});
${moduleName}Router.get('/${moduleName}-list', ${moduleName}Controller.getAll${capitalizedModuleName}s);
${moduleName}Router.get('/get-${moduleName}/:id', ${moduleName}Controller.getSingle${capitalizedModuleName});
${moduleName}Router.put('/update-${moduleName}/:id', validate${capitalizedModuleName}, ${moduleName}Controller.update${capitalizedModuleName});
${moduleName}Router.delete('/delete-${moduleName}/:id', ${moduleName}Controller.delete${capitalizedModuleName});

export default ${moduleName}Router;
  `;

  // Writing files
  const fileContents = {
    route: routeContent,
    enum: enumContent,
    model: modelContent,
    validation: validationContent,
    types: typesContent,
    controller: controllerContent,
    service: serviceContent,
  };

  Object.entries(files).forEach(([key, filename]) => {
    const filePath = path.join(modulePath, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, fileContents[key], 'utf8');
      console.log(`Created file: ${filePath}`);
    } else {
      console.log(`File already exists: ${filePath}`);
    }
  });

  console.log(`Module "${moduleName}" setup completed.`);
  rl.close();
});
