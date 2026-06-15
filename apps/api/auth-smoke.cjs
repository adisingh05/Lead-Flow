const { ClerkAuthGuard } = require('./dist/auth/clerk-auth.guard');
const { ValidationPipe } = require('@nestjs/common');
const { CreateContactDto } = require('./dist/crm/dto/crm.dto');

function createContext(headers = {}) {
  const request = { headers };
  return {
    request,
    context: { switchToHttp: () => ({ getRequest: () => request }) },
  };
}

const user = {
  id: 'u1',
  clerkId: 'mock-user',
  email: 'dev@example.com',
  organizationId: 'o1',
  role: 'OWNER',
  organization: {},
};
const prisma = { user: { findUnique: async () => user } };

(async () => {
  process.env.NODE_ENV = 'production';
  delete process.env.ALLOW_MOCK_AUTH;
  const anonymous = createContext();
  try {
    await new ClerkAuthGuard(prisma).canActivate(anonymous.context);
    throw new Error('production accepted anonymous request');
  } catch (error) {
    if (error.message.includes('accepted')) throw error;
    console.log('PASS production rejects anonymous');
  }

  process.env.NODE_ENV = 'development';
  process.env.ALLOW_MOCK_AUTH = 'true';
  const mock = createContext({
    'x-mock-clerk-id': 'mock-user',
    'x-mock-email': 'dev@example.com',
  });
  await new ClerkAuthGuard(prisma).canActivate(mock.context);
  if (mock.request.user.id !== 'u1') throw new Error('mock user not attached');
  console.log('PASS explicit local mock auth');

  delete process.env.CLERK_JWKS_URL;
  const bearer = createContext({ authorization: 'Bearer a.b.c' });
  try {
    await new ClerkAuthGuard(prisma).canActivate(bearer.context);
    throw new Error('token accepted without JWKS');
  } catch (error) {
    if (error.message.includes('accepted')) throw error;
    console.log('PASS bearer rejected without JWKS');
  }

  const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });
  try {
    await validationPipe.transform(
      { firstName: 'Ada', email: 'not-an-email', unexpected: true },
      { type: 'body', metatype: CreateContactDto },
    );
    throw new Error('invalid DTO accepted');
  } catch (error) {
    if (error.message.includes('accepted')) throw error;
    console.log('PASS invalid DTO rejected');
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
