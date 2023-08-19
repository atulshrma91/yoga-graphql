import { Yoga } from "./app";
const yoga = new Yoga();

/**
 * Main runner
 */
yoga
  .init()
  .then(async () => {
    try {
      await yoga.startRunner();
    } catch (e) {
      yoga.logger.error(e);
      yoga.captureException(e);
    }
  })
  .catch(console.error);
