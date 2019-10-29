import {Action} from "./index";
import {Statement} from "aws-lambda";
import {Effect} from "./Effect";

/**
 * Builder class for building a Statement object
 */
class StatementBuilder {
    private Action: string | null = null;
    private Effect: string | null = null;
    private Resource: string = "arn:aws:execute-api:";

    constructor() {}

    /**
     * Setter for the Statement's Action
     * @param action - action for this statement
     * @returns StatementBuilder
     */
    public setAction(action: Action): StatementBuilder {
        this.Action = action;

        return this;
    }

    /**
     * Setter for the Statement's Effect
     * @param effect - the effect of this Statement
     * @returns StatementBuilder
     */
    public setEffect(effect: Effect): StatementBuilder {
        this.Effect = effect;

        return this;
    }

    /**
     * Setter for the Statement's resource region
     * @param region - the ARN's region
     * @returns StatementBuilder
     */
    public setResourceRegion(region: string): StatementBuilder {
        this.Resource += `${region}:`;

        return this;
    }

    /**
     * Setter for the Statement's resource account-id
     * @param accountId - the ARN's account-id
     * @returns StatementBuilder
     */
    public setResourceAccountId(accountId: string): StatementBuilder {
        this.Resource += `${accountId}:`;

        return this;
    }

    /**
     * Setter for the Statement's resource API id
     * @param apiId - the ARN's API id
     * @returns StatementBuilder
     */
    public setResourceApiId(apiId: string): StatementBuilder {
        this.Resource += `${apiId}/`;

        return this;
    }

    /**
     * Setter for the Statement's resource stage-name
     * @param stageName - the ARN's stage-name
     * @returns StatementBuilder
     */
    public setResourceStageName(stageName: string): StatementBuilder {
        this.Resource += `${stageName}/`;

        return this;
    }

    /**
     * Setter for the Statement's resource HTTP verb
     * @param httpVerb - the ARN's HTTP verb
     * @returns StatementBuilder
     */
    public setResourceHttpVerb(httpVerb: string): StatementBuilder {
        this.Resource += `${httpVerb}/`;

        return this;
    }

    /**
     * Setter for the Statement's resource path specifier
     * @param resourcePathSpecifier - the ARN's path specifier
     * @returns StatementBuilder
     */
    public setResourcePathSpecifier(resourcePathSpecifier: string): StatementBuilder {
        this.Resource += resourcePathSpecifier;

        return this;
    }

    /**
     * Builder method to return the built Statement
     * @returns the Statement that has been built
     */
    public build(): Statement {
        return {
            Action: <string> this.Action,
            Effect: <string> this.Effect,
            Resource: this.Resource
        }
    }
}

export default StatementBuilder;
