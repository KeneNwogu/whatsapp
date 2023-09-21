import { number, object, string, array, z } from "zod";

export const SocialProviderSchema = object({
    provider: z.enum(["google"], { required_error: "A provider is required" }),
}).strict(); 