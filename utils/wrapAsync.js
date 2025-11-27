//51(D). For wrapping async functions to catch errors and pass to next()
// function wrapAsync(fn){      //instead of this we can use export module
module.exports = function (fn) {      //exporting wrapAsync function module
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
};

//now in app.js we can require/import this wrapAsync module and use it to wrap async functions