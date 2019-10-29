import { JWTService } from "../../src/services/JWTService";
import { expect } from "chai";
import { handler } from "../../src/handler";
import * as TypeMoq from "typemoq";
import AuthorizationError from "../../src/models/exceptions/AuthorizationError";

const jwtService = new JWTService();

describe("Lambda Authoriser", () => {
    describe("when authorisation header is not present", () => {
        const CONTEXT = {
            isFailed: false,
            failureReason: "",
            fail(failureString: any) {
                this.isFailed = true;
                this.failureReason = failureString;
            }
        };

        const event = {
            type: "TOKEN",
            authorizationToken: "",
            methodArn: "arn:aws:execute-api:eu-west-2:*:*/*/*/*"
        };

        it("should fail", () => {
            return handler(event, CONTEXT)
                .then(() => {
                    expect(CONTEXT.isFailed).to.equal(true);
                });
        });
    });

    describe("when authorisation method is not BEARER", () => {
        const CONTEXT = {
            isFailed: false,
            failureReason: "",
            fail(failureString: any) {
                this.isFailed = true;
                this.failureReason = failureString;
            }
        };

        const event = {
            type: "TOKEN",
            authorizationToken: "BASIC",
            methodArn: "arn:aws:execute-api:eu-west-2:*:*/*/*/*"
        };

        it("should fail", () => {
            return handler(event, CONTEXT)
                .then(() => {
                    expect(CONTEXT.isFailed).to.equal(true);
                });
        });
    });

    describe("when authorisation method is BEARER", () => {
        const CONTEXT = {
            isFailed: false,
            failureReason: "",
            fail(failureString: any) {
                this.isFailed = true;
                this.failureReason = failureString;
            }
        };

        const event = {
            type: "TOKEN",
            authorizationToken: "Bearer",
            methodArn: "arn:aws:execute-api:eu-west-2:*:*/*/*/*"
        };
        describe("and the token is not valid", () => {
            it("should fail", () => {
                const mock = TypeMoq.Mock.ofType(JWTService);
                mock.setup((m: any) => m.verify("this is an unauthorised token")).returns(() => Promise.resolve(1));
                return handler(event, CONTEXT)
                    .then((data: any) => {
                        expect(data.principalId).to.equal("Unauthorised");
                    });
            });
        });
    });
});


// describe("JWTService", () => {
//     describe("validateRole()", () => {
//         describe("when no role is one of the allowed ones", () => {
//             it("should return false", () => {
//                 const decodedToken: any = {
//                         header: { alg: "HS256", typ: "JWT" },
//                         payload: { oid: "1234567890",
//                             name: "John Doe",
//                             upn: "test@email.com",
//                             roles: [ "invalidRole" ]
//                         },
//                         signature: "Jt0R3NSJHYCWj9zLkLfQo-ZYdPBYrT638_6Hjr0CAtk"
//                     };
//                 expect(jwtService.isAtLeastOneRoleValid(decodedToken)).to.be.equal(false);
//             });
//         });

//         describe("when one role is one of the allowed ones", () => {
//             it("should return true", () => {
//                 const decodedToken: any = {
//                         header: { alg: "HS256", typ: "JWT" },
//                         payload: { oid: "1234567890",
//                             name: "John Doe",
//                             upn: "test@email.com",
//                             roles: [ "CVSAdrTester" ]
//                         },
//                         signature: "Jt0R3NSJHYCWj9zLkLfQo-ZYdPBYrT638_6Hjr0CAtk"
//                     };
//                 expect(jwtService.isAtLeastOneRoleValid(decodedToken)).to.be.equal(true);
//             });
//         });

//         describe("when two roles are ones of the allowed ones", () => {
//             it("should return true", () => {
//                 const decodedToken: any = {
//                         header: { alg: "HS256", typ: "JWT" },
//                         payload: { oid: "1234567890",
//                             name: "John Doe",
//                             upn: "test@email.com",
//                             roles: [ "CVSPsvTester", "CVSTirTester" ]
//                         },
//                         signature: "Jt0R3NSJHYCWj9zLkLfQo-ZYdPBYrT638_6Hjr0CAtk"
//                     };
//                 expect(jwtService.isAtLeastOneRoleValid(decodedToken)).to.be.equal(true);
//             });
//         });

//         describe("when one role is allowed and the another one is not", () => {
//             it("should return true", () => {
//                 const decodedToken: any = {
//                         header: { alg: "HS256", typ: "JWT" },
//                         payload: { oid: "1234567890",
//                             name: "John Doe",
//                             upn: "test@email.com",
//                             roles: [ "CVSPsvTester", "invalidRole" ]
//                         },
//                         signature: "Jt0R3NSJHYCWj9zLkLfQo-ZYdPBYrT638_6Hjr0CAtk"
//                     };
//                 expect(jwtService.isAtLeastOneRoleValid(decodedToken)).to.be.equal(true);
//             });
//         });
//     });
// });
