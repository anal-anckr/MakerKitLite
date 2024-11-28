import configuration from '~/configuration';
import isBrowser from '~/core/generic/is-browser';
import getLogger from '~/core/logger';
const logger = getLogger();
export async function initializeNodeSentry() {
  const dsn = configuration.sentry.dsn;

  if (!dsn) {
    warnSentryNotConfigured();
  }

  if (isBrowser()) {
    warnNotNodeEnvironment();

    return;
  }

  const Sentry = await import('@sentry/node');

  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    environment: configuration.environment,
  });
}

function warnSentryNotConfigured() {
  logger.error(
    `Sentry DSN not provided. Please add a SENTRY_DSN environment variable to enable error tracking.`,
  );
}

function warnNotNodeEnvironment() {
  logger.error(
    `This Sentry instance is being initialized in a browser environment, but it's for Node. Please use 'initializeBrowserSentry' instead.`,
  );
}
