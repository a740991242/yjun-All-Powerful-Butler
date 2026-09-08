// Production API: credentials stay in runtime secrets, never in the Vue bundle.
const encoder = new TextEncoder();
const ACCESS_AGE = 15 * 60;
const SESSION_AGE = 7 * 24 * 60 * 60;

function respond(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });
}

function success(data, headers) {
  return respond({ code: 0, data, error: null, message: 'ok' }, 200, headers);
}

function failure(request, status) {
  const chinese = !request.headers.get('Accept-Language')?.startsWith('en');
  const messages = {
    400: chinese
      ? '请输入有效的账号和密码'
      : 'Enter a valid username and password',
    401: chinese
      ? '登录已过期，请重新登录'
      : 'Your session expired. Please sign in again',
    403: chinese ? '账号或密码错误' : 'Incorrect username or password',
    404: chinese ? '接口不存在' : 'Endpoint not found',
    503: chinese ? '登录服务暂不可用' : 'Sign-in is temporarily unavailable',
  };
  const message = messages[status];
  return respond({ code: -1, data: null, error: message, message }, status);
}

function encode(bytes) {
  return btoa(String.fromCodePoint(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function decode(value) {
  return Uint8Array.from(
    atob(value.replaceAll('-', '+').replaceAll('_', '/')),
    (character) => character.codePointAt(0),
  );
}

async function signingKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function signToken(env, kind, age) {
  const payload = encode(
    encoder.encode(
      JSON.stringify({
        sub: env.ADMIN_USERNAME,
        kind,
        exp: Math.floor(Date.now() / 1000) + age,
        nonce: crypto.randomUUID(),
      }),
    ),
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    await signingKey(env.SESSION_SECRET),
    encoder.encode(payload),
  );
  return `${payload}.${encode(new Uint8Array(signature))}`;
}

async function validToken(token, env, kind) {
  if (typeof token !== 'string' || token.length > 2048) return false;
  try {
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return false;
    if (
      !(await crypto.subtle.verify(
        'HMAC',
        await signingKey(env.SESSION_SECRET),
        decode(signature),
        encoder.encode(payload),
      ))
    )
      return false;
    const data = JSON.parse(new TextDecoder().decode(decode(payload)));
    return (
      data.sub === env.ADMIN_USERNAME &&
      data.kind === kind &&
      Number.isFinite(data.exp) &&
      data.exp > Date.now() / 1000
    );
  } catch {
    return false;
  }
}

function sessionCookie(token, age = SESSION_AGE) {
  return `butler_session=${token}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
}

function readSession(request) {
  return request.headers
    .get('Cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('butler_session='))
    ?.slice('butler_session='.length);
}

async function sameSecret(actual, expected, secret) {
  const key = await signingKey(secret);
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(expected),
  );
  return crypto.subtle.verify('HMAC', key, signature, encoder.encode(actual));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }
    if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
      return failure(request, 503);
    }
    const route = `${request.method} ${url.pathname}`;
    if (request.method === 'POST') {
      const origin = request.headers.get('Origin');
      if (origin && origin !== url.origin) return failure(request, 403);
    }
    if (route === 'POST /api/auth/login') {
      let input;
      try {
        const body = await request.text();
        if (body.length > 4096) return failure(request, 400);
        input = JSON.parse(body);
      } catch {
        return failure(request, 400);
      }
      if (
        !input ||
        typeof input.username !== 'string' ||
        typeof input.password !== 'string'
      ) {
        return failure(request, 400);
      }
      if (
        input.username !== env.ADMIN_USERNAME ||
        !(await sameSecret(
          input.password,
          env.ADMIN_PASSWORD,
          env.SESSION_SECRET,
        ))
      ) {
        return failure(request, 403);
      }
      const accessToken = await signToken(env, 'access', ACCESS_AGE);
      const session = await signToken(env, 'session', SESSION_AGE);
      return success({ accessToken }, { 'Set-Cookie': sessionCookie(session) });
    }
    if (route === 'POST /api/auth/logout') {
      return success(null, { 'Set-Cookie': sessionCookie('', 0) });
    }
    if (!(await validToken(readSession(request), env, 'session'))) {
      return failure(request, 401);
    }
    if (route === 'POST /api/auth/refresh') {
      // The existing refresh client reads the raw response.data token.
      return respond(await signToken(env, 'access', ACCESS_AGE));
    }
    const accessToken = request.headers
      .get('Authorization')
      ?.replace(/^Bearer /, '');
    if (!(await validToken(accessToken, env, 'access')))
      return failure(request, 401);
    if (route === 'GET /api/user/info') {
      return success({
        userId: '0',
        id: 0,
        username: env.ADMIN_USERNAME,
        realName: env.ADMIN_USERNAME,
        roles: ['super'],
        homePath: '/life-tools/mortgage',
        avatar: '/brand/avatar.svg',
        desc: '',
      });
    }
    if (route === 'GET /api/auth/codes') {
      return success(['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010']);
    }
    if (route === 'GET /api/menu/all') return success([]);
    return failure(request, 404);
  },
};
