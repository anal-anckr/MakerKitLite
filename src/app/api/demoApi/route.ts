import { NextRequest } from 'next/server';
import getLogger from '~/core/logger';
import {
  failResponse,
  successResponse,
} from '../helperFunction/responseHandler';

export async function GET(req: NextRequest) {
  try {
    const logger = getLogger();
    // throw new Error('Specific Error Message: ');
    logger.warn('data ');
    return successResponse('Success Data');
  } catch (error) {
    return failResponse(
      error instanceof Error ? error.message : 'An unexpected error occurred',
    );
  }
}
