import { Response } from 'express';

export const sendResponse = (
  res: Response,
  statusCode = 200,
  data: any = null,
  message = 'Success',
  status = 'SUCCESS',
): void => {
  if (res.headersSent) {
    console.warn('Response was already sent');
    return;
  }
  const formattedMessage = message
    .toLowerCase()
    .replace(/_([a-z])/g, (match, group) => ' ' + group.toUpperCase()) 
    .replace(/^./, (match) => match.toUpperCase()); 

    
  try {
    res.status(statusCode).json({
      status,
      statusCode,
      message,
      formattedMessage,
      data,
      endpoint: res.locals.endpoint,
    });
  } catch (error) {
    console.error('Error sending response:', error);

    if (!res.headersSent) {
      res.status(500).json({
        statusCode: 500,
        status: 'ERROR',
        message: 'Internal Server Error',
        data: null,
      });
    }
  }
};
