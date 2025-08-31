"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateContactForm = void 0;
const joi_1 = __importDefault(require("joi"));
const contactFormSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required().messages({
        "string.min": "Name must be at least 2 characters long",
        "string.max": "Name must be less than 100 characters",
        "any.required": "Name is required",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    phone: joi_1.default.string()
        .pattern(/^[\+]?[1-9][\d]{0,15}$/)
        .optional()
        .allow("")
        .messages({
        "string.pattern.base": "Please provide a valid phone number",
    }),
    subject: joi_1.default.string().min(5).max(200).optional().allow("").messages({
        "string.min": "Subject must be at least 5 characters long",
        "string.max": "Subject must be less than 200 characters",
    }),
    message: joi_1.default.string().min(10).max(2000).required().messages({
        "string.min": "Message must be at least 10 characters long",
        "string.max": "Message must be less than 2000 characters",
        "any.required": "Message is required",
    }),
    projectType: joi_1.default.string()
        .valid("residential", "commercial", "infrastructure", "smart-city", "other")
        .optional()
        .allow("")
        .messages({
        "any.only": "Please select a valid project type",
    }),
    budget: joi_1.default.string()
        .valid("under-100k", "100k-500k", "500k-1m", "1m-5m", "5m-plus", "not-specified")
        .optional()
        .allow("")
        .messages({
        "any.only": "Please select a valid budget range",
    }),
});
const validateContactForm = (req, res, next) => {
    const { error, value } = contactFormSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });
    if (error) {
        const validationErrors = error.details.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message,
        }));
        res.status(400).json({
            success: false,
            error: "Validation failed",
            details: validationErrors,
        });
        return;
    }
    req.body = value;
    next();
};
exports.validateContactForm = validateContactForm;
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const validationErrors = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
            }));
            res.status(400).json({
                success: false,
                error: "Validation failed",
                details: validationErrors,
            });
            return;
        }
        req.body = value;
        next();
    };
};
exports.validate = validate;
//# sourceMappingURL=validation.js.map