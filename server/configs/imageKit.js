import ImageKit from '@imagekit/nodejs';

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATEKEY,
});

export default imageKit;