import {body, validationResult} from "express-validator";

function validateRequest(req, res, next){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next()
}

//validate create product
export const createProductValidator = [
    body("title")
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),

    body("description")
        .notEmpty().withMessage("Description is required")
        .isLength({ min: 10 }).withMessage("Description must be at least 10 characters long"),    

    body("price")
        .notEmpty().withMessage("Price is required")
        .isFloat({ gt: 0 }).withMessage("Price must be a positive number"),    

    validateRequest
]