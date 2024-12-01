import configuration from '~/configuration';
import isBrowser from '~/core/generic/is-browser';
import getLogger from '~/core/logger';
const logger = getLogger();
let initialized = false;

/**
 * @description Loads and initializes Sentry for tracking runtime errors
 */
async function initializeBrowserSentry() {
  const dsn = configuration.sentry.dsn;

  if (!isBrowser() || initialized) {
    return;
  }

  if (!dsn) {
    if (!configuration.production) {
      warnSentryNotConfigured();
    }

    return;
  }

  const { BrowserTracing } = await import('@sentry/browser');
  const Sentry = await import('@sentry/react');

  Sentry.init({
    dsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: configuration.environment,
  });

  initialized = true;
}

function warnSentryNotConfigured() {
  logger.error(
    `Sentry DSN was not provided. Please add a SENTRY_DSN environment variable to enable error tracking.`,
  );
}

export default initializeBrowserSentry;
