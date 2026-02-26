/**
 * Storefront API Queries fuer padel-point.de
 *
 * Metafield-Keys basieren auf den echten Shopify-Definitionen.
 * Siehe METAFIELDS.md fuer das vollstaendige Mapping.
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
            weight: metafield(namespace: "global", key: "weight_3619") {
              value
            }
            headShape: metafield(namespace: "rackets", key: "head-shape_3734") {
              value
            }
            headSize: metafield(namespace: "rackets", key: "head-size_3553") {
              value
            }
            balance: metafield(namespace: "rackets", key: "balance_3537") {
              value
            }
            surfaceMaterial: metafield(namespace: "rackets", key: "structure-surface_3866") {
              value
            }
            surfaceHardness: metafield(namespace: "custom", key: "surface_hardness") {
              value
            }
            coreMaterial: metafield(namespace: "rackets", key: "core-material_3867") {
              value
            }
            coreHardness: metafield(namespace: "custom", key: "core_hardness") {
              value
            }
            playType: metafield(namespace: "rackets", key: "players-type_3788") {
              value
            }
            playingStyle: metafield(namespace: "rackets", key: "playing-style_3845") {
              value
            }
            playerLevel: metafield(namespace: "rackets", key: "level-of-play_3786") {
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
          weight: metafield(namespace: "global", key: "weight_3619") {
            value
          }
          headShape: metafield(namespace: "rackets", key: "head-shape_3734") {
            value
          }
          headSize: metafield(namespace: "rackets", key: "head-size_3553") {
            value
          }
          balance: metafield(namespace: "rackets", key: "balance_3537") {
            value
          }
          surfaceMaterial: metafield(namespace: "rackets", key: "structure-surface_3866") {
            value
          }
          surfaceHardness: metafield(namespace: "custom", key: "surface_hardness") {
            value
          }
          coreMaterial: metafield(namespace: "rackets", key: "core-material_3867") {
            value
          }
          coreHardness: metafield(namespace: "custom", key: "core_hardness") {
            value
          }
          playType: metafield(namespace: "rackets", key: "players-type_3788") {
            value
          }
          playingStyle: metafield(namespace: "rackets", key: "playing-style_3845") {
            value
          }
          playerLevel: metafield(namespace: "rackets", key: "level-of-play_3786") {
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
