const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const errorHandler = (error) => {
  console.log(error);
};

const uploadImageUtil = async (data, filename) => {
  /*------------------------
Libraries

  /*------------------------
  Download the file.
  Good article on how to download a file and send with form data - https://maximorlov.com/send-a-file-with-axios-in-nodejs/
  ------------------------*/
  // const file = await new Promise((resolve, error) => {
  //   fs.readFile('./public/images/foreground.svg', (err, data) => {
  //     resolve(data);
  //   });
  // }); // This can be named whatever you'd like. You'll end up specifying the name when you upload the file to a staged target.
  // const fileSize = fs.statSync('../public/images/foreground.svg').size; // Important to get the file size for future steps.

  /*------------------------
  Create staged upload.
  ---
  Shopify sets up temporary file targets in aws s3 buckets so we can host file data (images, videos, etc).
  If you already have a public url for your image file then you can skip this step and pass the url directly to the create file endpoint.
  But in many cases you'll want to first stage the upload on s3. Cases include generating a specific name for your image, uploading the image from a private server, etc.
  ------------------------*/
  // Query
  const stagedUploadsQuery = `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
  stagedUploadsCreate(input: $input) {
    stagedTargets {
      resourceUrl
      url
      parameters {
        name
        value
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

  // Variables
  const stagedUploadsVariables = {
    input: {
      resource: 'FILE', // Important to set this as FILE and not IMAGE. Or else when you try and create the file via Shopify's api there will be an error.
      filename: `${filename}.svg`,
      mimeType: 'image/svg+xml',
      httpMethod: 'PUT',
    },
  };

  // return;
  // Result
  const stagedUploadsQueryResult = await axios
    .post(
      `${process.env.adminURL}/graphql.json`,
      {
        query: stagedUploadsQuery,
        variables: stagedUploadsVariables,
      },
      {
        headers: {
          'X-Shopify-Access-Token': `${process.env.adminAccessToken}`,
        },
      }
    )
    .catch((error) => {
      return { error: 'Error uploading image' + error };
    });

  if (!stagedUploadsQueryResult.data) return { error: 'Error uploading image' };
  // Save the target info.
  const target = stagedUploadsQueryResult.data.data.stagedUploadsCreate.stagedTargets[0];
  const params = target.parameters; // Parameters contain all the sensitive info we'll need to interact with the aws bucket.
  const url = target.url; // This is the url you'll use to post data to aws. It's a generic s3 url that when combined with the params sends your data to the right place.
  const resourceUrl = target.resourceUrl; // This is the specific url that will contain your image data after you've uploaded the file to the aws staged target.

  /*------------------------
  Post to temp target.
  ---
  A temp target is a url hosted on Shopify's AWS servers.
  ------------------------*/

  // Post the file data to shopify's aws s3 bucket. After posting, we'll be able to use the resource url to create the file in Shopify.
  await axios.put(url, data).catch(errorHandler);

  /*------------------------
  Create the file.
  Now that the file is prepared and accessible on the staged target, use the resource url from aws to create the file.
  ------------------------*/
  // Query
  const createFileQuery = `mutation fileCreate($files: [FileCreateInput!]!) {
  fileCreate(files: $files) {
    files {
      alt
    }
    userErrors {
      field
      message
    }
  }
}`;

  // Variables
  const createFileVariables = {
    files: {
      alt: 'alt-tag',
      contentType: 'IMAGE',
      originalSource: resourceUrl, // Pass the resource url we generated above as the original source. Shopify will do the work of parsing that url and adding it to files.
    },
  };

  // Finally post the file to shopify. It should appear in Settings > Files.
  const createFileQueryResult = await axios
    .post(
      `${process.env.adminURL}/graphql.json`,
      {
        query: createFileQuery,
        variables: createFileVariables,
      },
      {
        headers: {
          'X-Shopify-Access-Token': `${process.env.adminAccessToken}`,
        },
      }
    )
    .catch(errorHandler);

  return { message: 'Image uploaded', url: resourceUrl };
};

module.exports = { uploadImageUtil };
