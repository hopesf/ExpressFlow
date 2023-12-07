import Joi from 'joi';

interface ValidationError extends Error {
  details: Joi.ValidationErrorItem[];
}

const registerSchema = {
  apiName: Joi.string().required(),
  protocol: Joi.string().required(),
  host: Joi.string().required(),
  port: Joi.string().required(),
  enabled: Joi.boolean().required(),
};

const unRegisterSchema = {
  apiName: Joi.string().required(),
  url: Joi.string().required(),
};

const enableDisableSchema = {
  apiName: Joi.string().required(),
  enabled: Joi.boolean().required(),
  url: Joi.string().required(),
};

async function validateBodyData(schema: object, validateData: object) {
  try {
    await Joi.object(schema).validateAsync(validateData);
  } catch (error) {
    const validationError = error as ValidationError;
    if (validationError.details) {
      // Handle the validation error here, you can log it or perform other actions
      throw validationError;
    }
    throw new Error('Validation error occurred.');
  }
}
const jois = {
  register: registerSchema,
  unregister: unRegisterSchema,
  enableDisable: enableDisableSchema,
  validateFunc: validateBodyData,
};
export default jois;
