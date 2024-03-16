import { csrfHandler } from "../middlewares/csrf.ts";
import { swaggerUiHandler } from "../middlewares/hono_swagger_ui.ts";

export const handler = [swaggerUiHandler, csrfHandler];
