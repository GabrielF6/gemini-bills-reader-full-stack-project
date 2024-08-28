export interface UploadRequestBody {
    image: string;
    customer_code: string;
    measure_datetime: string;
    measure_type: "WATER" | "GAS";
  }
  
  export interface UploadResponse {
    image_url: string;
    measure_value: number;
    measure_uuid: string;
  }
  
  export interface ErrorResponse {
    error_code: string;
    error_description: string;
  }
  