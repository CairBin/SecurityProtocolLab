mkdir -p keys
openssl genrsa 4096 > keys/private.pem
openssl req -new -key keys/private.pem -out keys/csr.pem
openssl x509 -req -days 365 -in keys/csr.pem -signkey keys/private.pem -out keys/file.crt