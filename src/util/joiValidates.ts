import Joi from "joi";

const registerSchema = {
  apiName: Joi.string().required(),
  protocol: Joi.string().required(),
  host: Joi.string().required(),
  port: Joi.string().required(),
};

async function validateBodyData(schema: object, validateData: object) {
  try {
    await Joi.object(schema).validateAsync(validateData);
  } catch (error: any) {
    // Doğrulama hatası olursa hata mesajını yakala ve fırlat
    throw new Error(error);
  }
}

export const jois = {
  register: registerSchema,
  validateFunc: validateBodyData,
};
