const path = require('path');

const {
  pipeline,
  env
} = require('@xenova/transformers');

// TRANSFORMERS SETTINGS
env.allowLocalModels = false;
env.useBrowserCache = false;

let extractor = null;

// LOAD MODEL
const loadModel = async () => {

  try {

    if (!extractor) {

      console.log(
        '\n========== LOADING CLIP MODEL =========='
      );

      console.log(
        'Starting model initialization...'
      );

      const startTime = Date.now();

      extractor = await pipeline(
        'image-feature-extraction',
        'Xenova/clip-vit-base-patch32'
      );

      const endTime = Date.now();

      console.log(
        'CLIP model loaded successfully'
      );

      console.log(
        `Model load time: ${
          (endTime - startTime) / 1000
        } seconds`
      );

      console.log(
        '========================================\n'
      );
    }

    return extractor;

  } catch (error) {

    console.error(
      '\n========== MODEL LOAD ERROR =========='
    );

    console.error(error);

    console.error(
      'MESSAGE:',
      error.message
    );

    console.error(
      'STACK:',
      error.stack
    );

    console.error(
      '======================================\n'
    );

    throw error;
  }
};

// GENERATE EMBEDDING
const generateEmbedding = async (
  imageInput
) => {

  try {

    console.log(
      '\n========== GENERATE EMBEDDING =========='
    );

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

    console.log(
      'Starting embedding generation...'
    );

    const startTime = Date.now();

    const output =
      await extractor(
        imageSource,
        {
          pooling: 'mean',
          normalize: true
        }
      );

    const endTime = Date.now();

    console.log(
      'Embedding generated successfully'
    );

    console.log(
      `Embedding length: ${output.data.length}`
    );

    console.log(
      `Embedding generation time: ${
        (endTime - startTime) / 1000
      } seconds`
    );

    console.log(
      '========================================\n'
    );

    return Array.from(output.data);

  } catch (error) {

    console.error(
      '\n========== EMBEDDING ERROR =========='
    );

    console.error(error);

    console.error(
      'MESSAGE:',
      error.message
    );

    console.error(
      'STACK:',
      error.stack
    );

    console.error(
      '=====================================\n'
    );

    throw error;
  }
};

module.exports = {
  loadModel,
  generateEmbedding
};