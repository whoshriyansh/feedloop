/**
 * @desc    This file contain Success and Error response for sending to client / user
 * @author  Shriyansh Lohia
 * @since   2025
 *
 */

import { NextResponse } from "next/server";

/**
 * @desc Send any success response
 *
 * @param {Object} data
 * @param {String} message
 * @param {Number} status
 */

export const successResponse = (statusCode, message, data) => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: statusCode }
  );
};

/**
 * @desc Send any error response
 *
 * @param {Object} data
 * @param {String} message
 * @param {Number} statusCode
 * @param {Object} errors
 */
export const errorResponse = (statusCode, message, errors) => {
  const codes = [200, 201, 400, 401, 404, 403, 422, 500];

  // get matched code
  const findCode = codes.find((code) => code == statusCode);

  //In case of NO status Code
  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status: statusCode }
  );
};

/**
 * @desc Send any Validation error response
 *
 * @param {Object | Array} errors
 */

export const validationResponse = (errors) => {
  return NextResponse.json(
    {
      success: false,
      message: "Validation Error",
      errors,
    },
    { status: 422 }
  );
};
