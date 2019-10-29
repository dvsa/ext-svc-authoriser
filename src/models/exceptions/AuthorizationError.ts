class AuthorizationError extends Error {

    constructor(message: string) {
        super(message);
    }
}

export default AuthorizationError
