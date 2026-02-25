const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error(
      "Missing Shopify configuration. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN."
    );
  }

  const response = await fetch(SHOPIFY_STORE_DOMAIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 }, // Cache for 1 hour (ISR)
  });

  const data = await response.json();

  if (data.errors) {
    throw new Error(`Shopify GraphQL error: ${data.errors[0].message}`);
  }

  return data.data;
}
