import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { formsRouter } from "./routes/forms/route";
import { publicFormsRouter } from "./routes/public-forms/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  forms: formsRouter,
  publicForms: publicFormsRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
