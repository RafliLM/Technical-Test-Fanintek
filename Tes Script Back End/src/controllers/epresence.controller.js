import { Router } from "express"
import { body, validationResult } from "express-validator"
import epresenceService from "../services/epresence.service.js"
import { BadRequestError } from "../errors/badrequest.error.js"

const epresenceController = Router()

epresenceController.get("/", async (req, res, next) => {
    try {
        return res.status(200).json({
            message: "Success get data",
            data: await epresenceService.getEpresence(req.store)
        })
    } catch (error) {
        next(error)
    }
})

// Melakukan absen
epresenceController.post("/", [
    body('type')
      .notEmpty().withMessage('Type is required')
      .isString().withMessage('Type must be a string')
      .isIn(['IN', 'OUT']).withMessage('Type must be either IN or OUT'),
    body('waktu')
      .notEmpty().withMessage('Waktu is required')
      .isISO8601().withMessage('Waktu must be a valid datetime in the format YYYY-MM-DD HH:mm:ss')
], async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            throw new BadRequestError("Bad Request Error", errors.array())
        return res.status(201).json({
            success: true,
            message: await epresenceService.epresence(req.body, req.store)
        })
    } catch (error) {
        next(error)
    }
})

// Approve absen
epresenceController.put("/:epresenceId", async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: await epresenceService.approveEpresence(parseInt(req.params.epresenceId), req.store)
        })
    } catch (error) {
        next(error)
    }
})

export default epresenceController