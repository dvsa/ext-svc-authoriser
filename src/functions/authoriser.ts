import { Context, Handler, PolicyDocument, Statement } from "aws-lambda";
import StatementBuilder from "../models/IAM/StatementBuilder";
import Policy from "../models/IAM/Policy";
import { JWTService } from "../services/JWTService";
import { Effect } from "../models/IAM/Effect";
import { StatusCodeError } from "request-promise/errors";
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import AuthorizationError from "../models/exceptions/AuthorizationError";

/**
 * Lambda custom authoriser function to verify whether a JWT has been provided
 * and to verify its integrity and validity.
 * @param event - AWS Lambda event object
 * @param context - AWS Lambda Context object
 * @returns - Promise<Policy | undefined>
 */
const authoriser: any = async (event: any, context: Context): Promise<Policy | undefined> => {

    console.log("authoriser Context received as =>", context);
    if (!event.authorizationToken) {
        context.fail(`No authorization methods provided.\nEvent dump:\n${event}\nContext dump:\n${context}`);
        return undefined;
    }

    const [authorization, token] = event.authorizationToken.split(" ");

    if (authorization !== "Bearer") {
        context.fail(`Authorization methods accepted: Bearer.\nEvent dump:\n${event}\nContext dump:\n${context}`);
        return undefined;
    }

    return new JWTService().verify(token)
        .then((result: any) => {
            const statements: Statement[] = [
                new StatementBuilder()
                    .setAction("execute-api:Invoke")
                    .setEffect(Effect.Allow)
                    .setResourceRegion("eu-west-1")
                    .setResourceAccountId("*")
                    .setResourceApiId("*")
                    .setResourceStageName("*")
                    .setResourceHttpVerb("*")
                    .setResourcePathSpecifier("*")
                    .build()
            ];
            const policyDocument: PolicyDocument = { Version: "2012-10-17", Statement: statements };

            return new Policy(result.sub, policyDocument);
        })
        .catch((error: StatusCodeError | AuthorizationError | JsonWebTokenError | NotBeforeError | TokenExpiredError) => {
            if (error instanceof StatusCodeError) {
                context.fail(`A ${error.statusCode} error has occured:\n${JSON.stringify(error.error)}`);
                console.log(`A ${error.statusCode} error has occured:\n${JSON.stringify(error.error)}`);
                return undefined;
            }

            if (error instanceof AuthorizationError) {
                context.fail(error.message);
                console.log(error.message);
                return undefined;
            }

            const statements: Statement[] = [
                new StatementBuilder()
                    .setAction("execute-api:Invoke")
                    .setEffect(Effect.Deny)
                    .setResourceRegion("eu-west-1")
                    .setResourceAccountId("*")
                    .setResourceApiId("*")
                    .setResourceStageName("*")
                    .setResourceHttpVerb("*")
                    .setResourcePathSpecifier("*")
                    .build()
            ];
            const policyDocument: PolicyDocument = { Version: "2012-10-17", Statement: statements };

            return new Policy("Unauthorised", policyDocument);
        });

};

export { authoriser };
