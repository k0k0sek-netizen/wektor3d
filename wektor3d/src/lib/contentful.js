// Używamy importu nazwanego { createClient } zamiast defaultowego
import { createClient } from 'contentful';

export const contentfulClient = createClient({
    space: import.meta.env.CONTENTFUL_SPACE_ID,
    accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
});
