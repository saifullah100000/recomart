const path = require('path');

const {
  pipeline,
  env
} = require('@xenova/transformers');

env.allowLocalModels = false;

let extractor = null;

// LOAD MODEL
const loadModel = async () => {

  if (!extractor) {

    console.log('Loading CLIP model...');

    extractor = await pipeline(
      'image-feature-extraction',
      'Xenova/clip-vit-base-patch32'
    );

    console.log(
      'CLIP model loaded successfully'
    );
  }

  return extractor;
};

// GENERATE EMBEDDING
const generateEmbedding = async (
  imageInput
) => {

  try {

    const extractor =
      await loadModel();

    let imageSource;

    // URL
    if (
      typeof imageInput === 'string' &&
      imageInput.startsWith('http')
    ) {

      imageSource = imageInput;
    }

    // LOCAL FILE PATH
    else if (
      typeof imageInput === 'string'
    ) {

      imageSource = path.resolve(
        imageInput
      );
    }

    else {

      throw new Error(
        'Unsupported image input type'
      );
    }

    console.log(
      'Using image source:',
      imageSource
    );

    const output =
      await extractor(
        imageSource,
        {
          pooling: 'mean',
          normalize: true
        }
      );

    return Array.from(output.data);

  } catch (error) {

    console.error(
      'Embedding generation error:',
      error
    );

    throw error;
  }
};

module.exports = {
  loadModel,
  generateEmbedding
};