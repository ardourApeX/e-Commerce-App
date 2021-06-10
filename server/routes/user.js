const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const { users } = require("../database/usersDB");
const { findUserInDb, passwordValidation } = require("../utilities");

const userRoute = express.Router();
userRoute.use(jsonParser);
userRoute.get("/", function (request, response) {
	setTimeout(() => {
		response.status(200).send({
			data: users,
		});
	}, 2000);
});

userRoute.post("/validate", function (request, response) {
	const data = request.body;
	if (!data.email && !data.username) {
		response
			.status(400)
			.send({ success: false, message: "Missing Parameters" });
	}
	const userData = findUserInDb(data);
	if (!userData) {
		response
			.status(404)
			.send({ success: false, message: "User does not exist!" });
	}
	response.status(200).send({ success: true, data: { id: userData.id } });
});
userRoute.get("/security-question/:id", function (request, response) {
	const id = parseInt(request.params.id);
	const userData = findUserInDb({ id });
	if (!userData) {
		response
			.status(404)
			.send({ success: false, message: "User does not exist!" });
	}
	response.status(200).send({
		success: true,
		data: {
			id: userData.id,
			name: userData.name,
			question: userData.question,
		},
	});
});

userRoute.post(
	"/security-answer-validation",
	async function (request, response) {
		const data = request.body;
		if (!data.answer || !data.id) {
			response
				.status(400)
				.send({ success: false, message: "Missing Parameters" });
		} else {
			const id = parseInt(data.id);
			const userData = findUserInDb({ id });
			if (!userData) {
				response
					.status(404)
					.send({ success: false, message: "User does not exist!" });
			} else {
				const isPasswordSame = await passwordValidation(
					data.answer,
					userData.answer
				);
				if (isPasswordSame.success) {
					response
						.status(isPasswordSame.result ? 200 : 401)
						.send({
							success: isPasswordSame.success,
							result: isPasswordSame.result,
						});
				} else {
					response
						.status(isPasswordSame.status)
						.send({
							success: isPasswordSame.success,
							message: isPasswordSame.message,
						});
				}
			}
		}
	}
);

exports.userRoute = userRoute;
