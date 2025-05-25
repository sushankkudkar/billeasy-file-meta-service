import { v4 as uuidv4 } from 'uuid';
import { FastifyRequest, FastifyReply } from 'fastify';

export function requestIdMiddleware(
  req: FastifyRequest,
  res: FastifyReply | any, // Middie wraps res as raw Node response, so 'any' is safer
  done: () => void,
) {
  const requestId = req.headers['x-request-id'] || uuidv4();
  (req as any).requestId = requestId;

  // Use setHeader for raw Node response object (middie)
  res.setHeader('x-request-id', requestId);

  done();
}
