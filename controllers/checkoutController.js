const client = createStorefrontApiClient({
  storeDomain: process.env.storeDomain,
  apiVersion: '2023-10',
  publicAccessToken: process.env.publicAccessToken,
});

const shopQuery = `
query shop {
  shop {
    name
    id
    primaryDomain {
      url
      host
    }
  }
}
`;
const cartCreateMutation = `
mutation ($input: CartInput!, $country: CountryCode, $language: LanguageCode)
@inContext(country: $country, language: $language) {
  cartCreate(input: $input) {
    userErrors {
      message
      code
      field
    }
    cart {
      id
      checkoutUrl
    }
  }
}
`;

exports.createCart = async (req, res) => {
  const { data, errors, extensions } = await client.request(cartCreateMutation, {
    variables: {
      input: {
        lines: [{ merchandiseId: process.env.merchandiseId, quantity: 1 }],
        attributes: [{ key: 'custom', value: 'value' }],
      },
      country: 'US',
      language: 'EN',
    },
  });
  return { data, errors, extensions };
};
