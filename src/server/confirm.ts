import { Request, Response } from "express";
import { validate } from "uuid"; // or a different method of UUID validation
import { getMeasureByUUID, Measure, updateMeasureValue } from "../database"; // Replace with your database functions

interface ConfirmRequestBody {
  measure_uuid: string;
  confirmed_value: number;
}

export const confirmHandler = async (req: Request, res: Response) => {
  const { measure_uuid, confirmed_value }: ConfirmRequestBody = req.body;

  // Validate input data
  if (
    typeof measure_uuid !== "string" ||
    typeof confirmed_value !== "number" ||
    !validate(measure_uuid)
  ) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Invalid data provided",
    });
  }

  try {
    // Check if the measure exists
    const measure: Measure | null = await getMeasureByUUID(measure_uuid);

    if (!measure) {
      return res.status(404).json({
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Reading not found",
      });
    }

    // Check if the measure is already confirmed
    if (measure.has_confirmed) {
      return res.status(409).json({
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Reading already confirmed",
      });
    }

    // Update the measure value in the database
    await updateMeasureValue(measure_uuid, confirmed_value);

    // Respond with success
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({
      error_code: "INTERNAL_SERVER_ERROR",
      error_description: "An unexpected error occurred",
    });
  }
};
