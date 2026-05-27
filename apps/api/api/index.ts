// Vercel serverless function entry point
// Uses the tsup-compiled bundle which has all @repo/* packages inlined
import "../src/preload-env";

import { app } from "../dist/server";

export default app;
