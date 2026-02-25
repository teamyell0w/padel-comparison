/**
 * GraphQL queries for the Shopify Storefront API.
 *
 * NOTE: The metafield namespace and keys below are placeholders.
 * Update them to match the actual metafield definitions in your Shopify store.
 * You can find them in Shopify Admin > Settings > Metafields > Products.
 */

export const GET_ALL_PRODUCTS_WITH_METAFIELDS = `
  query getAllProducts($first: Int!) {
    products(first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          title
          handle
          vendor
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          weight: metafield(namespace: "custom", key: "weight") {
            value
            type
          }
          headShape: metafield(namespace: "custom", key: "head_shape") {
            value
            type
          }
          balance: metafield(namespace: "custom", key: "balance") {
            value
            type
          }
          surfaceMaterial: metafield(namespace: "custom", key: "surface_material") {
            value
            type
          }
          coreMaterial: metafield(namespace: "custom", key: "core_material") {
            value
            type
          }
          playType: metafield(namespace: "custom", key: "play_type") {
            value
            type
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      weight: metafield(namespace: "custom", key: "weight") {
        value
        type
      }
      headShape: metafield(namespace: "custom", key: "head_shape") {
        value
        type
      }
      balance: metafield(namespace: "custom", key: "balance") {
        value
        type
      }
      surfaceMaterial: metafield(namespace: "custom", key: "surface_material") {
        value
        type
      }
      coreMaterial: metafield(namespace: "custom", key: "core_material") {
        value
        type
      }
      playType: metafield(namespace: "custom", key: "play_type") {
        value
        type
      }
    }
  }
`;
