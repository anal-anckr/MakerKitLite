import { NextResponse } from 'next/server';

interface IErrorStack {
  name: string;
  message: string;
  status: number;
}

export async function successResponse(
  data: object | unknown | string = 'success',
  statusCode = 200,
) {
  const formattedData = typeof data === 'string' ? data.toLowerCase() : data;

  return createResponse(
    { data: formattedData, message: 'SUCCESS', status: statusCode },
    statusCode,
  );
}

export async function failResponse(
  data: object | string | unknown = null,
  statusCode = 500,
) {
  const errorResponse = determineErrorResponse(
    data || 'an unexpected error occurred',
    statusCode,
  );
  return createResponse(errorResponse.body, errorResponse.status);
}

// Helper function to create a NextResponse
function createResponse(body: object, status: number) {
  return NextResponse.json(body, { status });
}

// Helper function to determine the error response structure
function determineErrorResponse(
  data: object | string | unknown,
  statusCode: number,
) {
  if (isIErrorStack(data)) {
    return {
      body: {
        error: data.message.toLowerCase(),
        message: 'FAIL',
        status: data.status || 500,
      },
      status: data.status || 500,
    };
  }

  if (typeof data === 'string') {
    return {
      body: {
        error: data.toLowerCase(),
        message: 'FAIL',
        status: statusCode,
      },
      status: statusCode,
    };
  }

  return {
    body: {
      error: 'An unexpected error occurred',
      message: 'FAIL',
      status: 500,
    },
    status: 500,
  };
}

// Helper function to check if the input matches IErrorStack
function isIErrorStack(error: any): error is IErrorStack {
  return (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    'status' in error &&
    'name' in error
  );
}
