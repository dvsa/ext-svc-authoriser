import {PolicyDocument} from "aws-lambda";

/**
 * Class that represents a Policy to be issued by the authoriser function
 */
class Policy {
    private readonly principalId: string;
    private readonly policyDocument: PolicyDocument;
    private readonly usageIdentifierKey?: string | undefined;
    private readonly context?: any;

    /**
     * Constructor for the Policy class
     * @param principalId - user identification associated with the token sent by the client. Usually is the token's subject
     * @param policyDocument - a PolicyDocument representing information about the Policy to be issued.
     * @param usageIdentifierKey - AWS usage plan's API key
     * @param context - an object containing any information to be sent to the lambda function being called.
     */
    constructor(principalId: string, policyDocument: PolicyDocument, usageIdentifierKey?: string, context?: any) {
        this.principalId = principalId;
        this.policyDocument = policyDocument;
        this.usageIdentifierKey = (usageIdentifierKey) ? usageIdentifierKey : undefined;
        this.context = (context) ? context : undefined;
    }
}

export default Policy;
