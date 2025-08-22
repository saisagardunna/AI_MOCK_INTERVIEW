const fs = require('fs');
const selfsigned = require('selfsigned');

const attrs = [{ name: 'commonName', value: 'localhost' }];
const opts = {
  days: 365,
  keySize: 2048,
  algorithm: 'sha256',
};

selfsigned.generate(attrs, opts, (err, pems) => {
  if (err) {
    console.error('Error generating certificate:', err.message);
    return;
  }
  fs.writeFileSync('localhost-key.pem', pems.private);
  fs.writeFileSync('localhost-cert.pem', pems.cert);
  console.log('Generated localhost-key.pem and localhost-cert.pem');
});