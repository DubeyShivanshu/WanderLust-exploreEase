//51(E). Add ExpressError for handling errors
class ExpressError extends Error {
    constructor(statusCode, message) {       //call the parent class(Error) constructor using super()
        super();
        this.statusCode = statusCode;        //setting the statusCode & message properties
        this.message = message;
    }
}

module.exports = ExpressError;             //exporting the ExpressError class for using in app.js