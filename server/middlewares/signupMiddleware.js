const { findUserInDb } = require("../utilities");

function signupParamsCheck(request, response, next) {
	// This middleware is to check if the request contains all the required paramters for signup or not

	const { email, password, name, question, answer } = request.body;
	if (!!email && !!password && !!name && !!question && !!answer) {
		request.signupParams = {
			allParametersPresent: true,
		};
	} else {
		request.signupParams = {
			allParametersPresent: false,
		};
	}
	next();
}

function emailValidation(request, response, next) {
	// This middleware is to check whether the user is already there in the database or not

	const { allParametersPresent } = request.signupParams;
	if (allParametersPresent) {
		const { email } = request.body;
		const userInfo = findUserInDb({ email });
		request.isUserUnique = {
			success: true,
			result: userInfo === undefined ? true : false,
		};
	} else {
		request.isUserUnique = {
			success: false,
			status: 400,
			message: "Missing Parameters",
		};
	}
	next();
}

exports.signupParamsCheck = signupParamsCheck;
exports.emailValidation = emailValidation;