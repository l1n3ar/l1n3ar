'use server'

import { apiFetch } from "@/lib/api-client"
import z from "zod"

const ipResponseSchema = z.object({
    regionName: z.string(),
    country: z.string()
})

export const getApproximateLocation = async (ip: string) => {
    const result = await apiFetch({
        url: `http://ip-api.com/json/${ip}`,
        method: 'GET',
        schema: ipResponseSchema,
    })

    console.log({result})

    return result
}