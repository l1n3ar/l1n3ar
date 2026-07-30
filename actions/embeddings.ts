'use server'

import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

export const generateEmbeddings = async () => {
    const result = await embedMany({
        model: openai.embedding('text-embedding-3-small'),
        values: ['Sunny day at the beach', 'Cloudy city skyline'],
    });

    return result;
};
