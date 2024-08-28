import { Request, Response } from "express";
import { getMeasuresByCustomerCode, Measure } from "../database"; // Replace with your actual database functions

interface ListResponse {
  customer_code: string;
  measures: Measure[];
}

export const listHandler = async (req: Request, res: Response) => {
  const customerCode: string = req.params["customer_code"];
  const measureType: string | undefined = req.query.measure_type
    ?.toString()
    .toUpperCase();

  // Validate measure type if provided
  if (measureType && !["WATER", "GAS"].includes(measureType)) {
    return res.status(400).json({
      error_code: "INVALID_TYPE",
      error_description: "Measurement type not allowed",
    });
  }

  try {
    // Get measures from database
    const measures: Measure[] = await getMeasuresByCustomerCode(
      customerCode,
      measureType
    );

    if (measures.length === 0) {
      return res.status(404).json({
        error_code: "MEASURES_NOT_FOUND",
        error_description: "No reading found",
      });
    }

    // Respond with the measures
    return res.status(200).json({
      customer_code: customerCode,
      measures,
    });
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({
      error_code: "INTERNAL_SERVER_ERROR",
      error_description: "An unexpected error occurred",
    });
  }
};
