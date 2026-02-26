/**
 * Storefront API Queries fuer padel-point.de
 *
 * Metafield-Keys sind Platzhalter — muessen an die echten
 * Metafield-Definitionen im Shopify Admin angepasst werden,
 * sobald der Token da ist.
 */

export const GET_COLLECTION_PRODUCTS = `
  query getCollectionProducts($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      title
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            vendor
            productType
            tags
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
            }
            headShape: metafield(namespace: "custom", key: "head_shape") {
              value
            }
            balanceRaw: metafield(namespace: "custom", key: "balance_mm") {
              value
            }
            balance: metafield(namespace: "custom", key: "balance") {
              value
            }
            surfaceMaterial: metafield(namespace: "custom", key: "surface_material") {
              value
            }
            surfaceHardness: metafield(namespace: "custom", key: "surface_hardness") {
              value
            }
            coreMaterial: metafield(namespace: "custom", key: "core_material") {
              value
            }
            coreHardness: metafield(namespace: "custom", key: "core_hardness") {
              value
            }
            playType: metafield(namespace: "custom", key: "play_type") {
              value
            }
            playerLevel: metafield(namespace: "custom", key: "player_level") {
              value
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const GET_ALL_PRODUCTS = `
  query getAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: TITLE) {
      edges {
        node {
          id
          title
          handle
          vendor
          productType
          tags
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
          }
          headShape: metafield(namespace: "custom", key: "head_shape") {
            value
          }
          balanceRaw: metafield(namespace: "custom", key: "balance_mm") {
            value
          }
          balance: metafield(namespace: "custom", key: "balance") {
            value
          }
          surfaceMaterial: metafield(namespace: "custom", key: "surface_material") {
            value
          }
          surfaceHardness: metafield(namespace: "custom", key: "surface_hardness") {
            value
          }
          coreMaterial: metafield(namespace: "custom", key: "core_material") {
            value
          }
          coreHardness: metafield(namespace: "custom", key: "core_hardness") {
            value
          }
          playType: metafield(namespace: "custom", key: "play_type") {
            value
          }
          playerLevel: metafield(namespace: "custom", key: "player_level") {
            value
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
