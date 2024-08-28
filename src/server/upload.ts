import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { geminiRun } from "../../gemini";
import { insertReading } from "../database"; // Import the function for database insertion
import { ErrorResponse, UploadRequestBody, UploadResponse } from "../types";

const EXISTING_READINGS = new Map<string, string>(); // Simulação de um banco de dados

export const uploadHandler = async (req: Request, res: Response) => {
  const { image, customer_code, measure_datetime, measure_type } =
    req.body as UploadRequestBody;

  // Params validation
  if (
    !image ||
    typeof image !== "string" ||
    !/^data:image\/[a-z]+;base64,/.test(image)
  ) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Invalid or missing base64 image.",
    } as ErrorResponse);
  }

  if (
    !customer_code ||
    typeof customer_code !== "string" ||
    !measure_datetime ||
    !measure_type
  ) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Invalid or missing parameters.",
    } as ErrorResponse);
  }

  // Month duplicate reading check
  const currentMonth = new Date(measure_datetime).toISOString().slice(0, 7); // "YYYY-MM"
  const readingKey = `${customer_code}-${measure_type}-${currentMonth}`;

  if (EXISTING_READINGS.has(readingKey)) {
    return res.status(409).json({
      error_code: "DOUBLE_REPORT",
      error_description: "Leitura do mês já realizada.",
    } as ErrorResponse);
  }

  let measureValue: number;
  try {
    const response = await geminiRun(
      image.split("data:image/")[1].split(",")[1]
    );
    measureValue = Number(response);
  } catch (error) {
    return res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "Failed to extract value from the image.",
    } as ErrorResponse);
  }

  // Reading storage
  EXISTING_READINGS.set(readingKey, uuidv4());

  const imageUrl = `https://temporary.image.storage/${uuidv4()}`; // Temp Link mock
  const measureUuid = uuidv4();

  // Insert the reading into the SQLite database
  try {
    await insertReading(
      measureUuid,
      imageUrl,
      customer_code,
      measure_datetime,
      measure_type,
      measureValue
    );
  } catch (error) {
    return res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "Failed to save reading to the database.",
    } as ErrorResponse);
  }

  const uploadResponse: UploadResponse = {
    image_url: imageUrl,
    measure_value: Number(measureValue),
    measure_uuid: measureUuid,
  };

  return res.status(200).json(uploadResponse);
};
