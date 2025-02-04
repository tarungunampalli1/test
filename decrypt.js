import {
  KmsKeyringNode,
  buildClient,
  CommitmentPolicy,
} from '@aws-crypto/client-node';
import fs from 'node:fs';

const { encrypt, decrypt } = buildClient(
  CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
);

const generatorKeyId =
  'arn:aws:kms:us-east-1:430118829593:key/941c7426-2a4a-43db-9a74-9ab3e9bb6048';

const myEncrypt = async (plaintextInput) => {
  // ENCRYPT
  const context = {
    stage: 'demo',
    purpose: 'simple demonstration app',
    origin: 'us-west-2',
  };

  const keyring = new KmsKeyringNode({ generatorKeyId, keysIds: [] });
  const { result: ciphertext } = await encrypt(keyring, plaintextInput, {
    encryptionContext: context,
  });

  console.log(ciphertext.toString());
  return ciphertext;
};

const plaintextInput = 'test text here';

const ciphertext = await myEncrypt(plaintextInput);

const myDecrypt = async (ciphertext) => {
  // DECRYPT
  const keyring = new KmsKeyringNode({
    keyIds: [
      'arn:aws:kms:us-east-1:430118829593:key/941c7426-2a4a-43db-9a74-9ab3e9bb6048',
    ],
  });
  const { plaintext, messageHeader } = await decrypt(keyring, ciphertext);
  console.log(plaintext.toString());
  return plaintext;
};

const plaintext = await myDecrypt(ciphertext);

console.log(plaintext.toString());
