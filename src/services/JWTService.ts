import * as JWT from "jsonwebtoken";
import * as http from "request-promise";
import {Configuration} from "../utils/Configuration";
import {resolve} from "path";
import AuthorizationError from "../models/exceptions/AuthorizationError";
import {ERRORMESSAGES} from "../assets/enum";
import AWS from "aws-sdk";
class JWTService {
    /**
     * Verify the token
     * @param token
     */
    public async verify(token: string): Promise<any> {

        const decodedToken: any = JWT.decode(token, { complete: true });
        console.log("decoded token payload is => ", decodedToken );

        const secretName = "${SECRET_NAME}";
        const client = new AWS.SecretsManager({region: "${REGION}"});
        let secret: any;

        return client.getSecretValue({SecretId: secretName}).promise().then((data) => {
            // const config: any = Configuration.getInstance(resolve(`${__dirname}/../config/config.yml`)).getConfig();
             // Decrypts secret using the associated KMS CMK.
             if ("SecretString" in data) {
                secret = data.SecretString;
                console.log("Config fetched!");
            } else {
             throw new AuthorizationError(ERRORMESSAGES.INVALID_SECRET_KEY);
             }

             const config = JSON.parse(secret);
            // Check if config is valid
             if (!config || !config.azure || !config.azure.tennant || !config.azure.appId || !config.azure.issuer || !config.azure.jwk_endpoint) {
                throw new AuthorizationError(ERRORMESSAGES.AZURE_CONFIGURATION_NOT_VALID);
            }

             const endpoint = config.azure.jwk_endpoint.replace(":tennant", config.azure.tennant);
             return this.fetchJWK(endpoint, decodedToken.header.kid)
                .then((x5c: string) => {
                    const issuer = config.azure.issuer.replace(":tennant", config.azure.tennant);
                    const certificate = `-----BEGIN CERTIFICATE-----\n${x5c}\n-----END CERTIFICATE-----`;

                    return JWT.verify(token, certificate, { audience: decodedToken.payload.aud, issuer, algorithms: ["RS256"] });
                });
        });
    }

    /**
     * Fetch the public key
     * @param endpoint
     * @param kid
     */
    public async fetchJWK(endpoint: string, kid: string): Promise<string> {
        return http.get(endpoint)
        .then((body: string) => {
            return JSON.parse(body);
        })
        .then((JWKs: any) => {
            const publicKey: any = JWKs.keys.find((key: any) => key.kid === kid);

            if (!publicKey) {
                throw new AuthorizationError(ERRORMESSAGES.NO_MATCHING_PUBLIC_KEY_FOUND);
            }

            return publicKey.x5c[0];
        });
    }

}

export { JWTService };
