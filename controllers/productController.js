const { createStorefrontApiClient } = require('@shopify/storefront-api-client');
const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();

const client = createStorefrontApiClient({
  storeDomain: process.env.storeDomain,
  apiVersion: '2023-10',
  publicAccessToken: process.env.publicAccessToken,
});

const productQuery = `query getProduct($gid: ID!){
  product(id: $gid) {
    title
    colors:metafield(key: "colors", namespace: "custom") {
      values: value
    }

    templates:metafield(key: "templates", namespace: "custom") {
      references(first: 100){
        nodes {
          ... on MediaImage {
            alt
            image {
              url
            }
          }
        }
      }
    }

    template_previews:metafield(key: "template_previews", namespace: "custom") {
      references(first: 100){
        nodes {
          ... on MediaImage {
            alt
            id
            image {
              url
            }
          }
        }
      }
    }
  }
}`;

const productVariables = {
  gid: process.env.productID,
};

exports.getProductData = async (req, res) => {
  const { data, errors, extensions } = await client
    .request(productQuery, { variables: { gid: process.env.productID } })
    .catch((error) => {
      return { error: 'Error getting Product:  ' + error };
    });

  if (errors) return res.json({ message: 'Error Fetching Product Data', errors });

  const templates = data.product.templates.references.nodes.map((template, index) => {
    return {
      id: template.id,
      name: template.alt,
      path: template.image.url,
      image: data.product.template_previews.references.nodes[index]?.image.url,
    };
  });

  const cleanedData = {
    title: data.product.title,
    colors: data.product.colors.values,
    templates: templates,
  };

  return res.json({ message: 'Product Data Fetched', data: cleanedData, extensions });
};
