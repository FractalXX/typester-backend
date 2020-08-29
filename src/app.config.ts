export default (): any => {
  const {
    PORT,
    DATABASE_HOST,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    AUTH_TOKEN_EXPIRATION_SECONDS,
    ACTIVATION_TOKEN_EXPIRATION_DAYS,
    PASSWORD_SALT_ROUNDS,
    JWT_SECRET_KEY,
    MAIL_DOMAIN,
    MAIL_USER,
    MAIL_PASSWORD,
    MAIL_FROM,
    FRONTEND_URL,
    ACTIVATION_ROUTE,
  } = process.env;

  // TODO frontend should be able to get some of the configuration values
  return {
    port: parseInt(PORT, 10) || 3000,
    database: {
      host: DATABASE_HOST,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      name: DATABASE_NAME,
    },
    auth: {
      tokenExpirationSeconds: AUTH_TOKEN_EXPIRATION_SECONDS,
      activationTokenExpiration: parseInt(ACTIVATION_TOKEN_EXPIRATION_DAYS),
      passwordSaltRounds: parseInt(PASSWORD_SALT_ROUNDS, 10),
      jwtSecretKey: JWT_SECRET_KEY,
    },
    mailer: {
      domain: MAIL_DOMAIN,
      user: MAIL_USER,
      password: MAIL_PASSWORD,
      from: MAIL_FROM,
    },
    frontend: {
      url: FRONTEND_URL,
      activationRoute: ACTIVATION_ROUTE,
    }
  };
};
