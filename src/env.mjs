import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    KINBOX_API_SECRET: z.string(),
    KINBOX_API_TOKEN: z.string(),
    KINBOX_API_TOKEN_V3: z.string(),
  },
  client: {},
  runtimeEnv: {
    KINBOX_API_SECRET: process.env.KINBOX_API_SECRET,
    KINBOX_API_TOKEN: process.env.KINBOX_API_TOKEN,
    KINBOX_API_TOKEN_V3: process.env.KINBOX_API_TOKEN_V3,
  },
}) 