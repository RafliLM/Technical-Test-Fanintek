import { Router } from "express"
import { body, validationResult } from "express-validator"
import { BadRequestError } from "../errors/badrequest.error.js"
import authService from "../services/auth.service.js"

const authController = Router()

// Sign Up
authController.post('/sign-up', [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isString().withMessage('Name must be a string'),
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Must be a valid email'),
    body('npp')
      .notEmpty().withMessage('NPP is required')
      .isInt().withMessage('NPP must be an integer'),
    body('npp_supervisor')
      .optional()
      .isInt().withMessage('NPP supervisor must be an integer if provided'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty())
          throw new BadRequestError("Bad Request Error", errors.array())
      return res.status(201).json({
          success: true,
          message: await authService.signUp(req.body)
      })
    } catch (error) {
      next(error)
    }
})

// Sign In
authController.post('/sign-in', [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty())
          throw new BadRequestError("Bad Request Error", errors.array())
      return res.status(200).json({
        success: true,
        message: "Berhasil melakukan signIn!",
        token: await authService.signIn(req.body)
      })
    } catch (error) {
      next(error)
    }
})

export default authController