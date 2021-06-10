import "./CSS/forgot-password.css";
import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	queryStringToObject,
	isItUsernameOrEmail,
	checkUserId,
} from "../utilities";
import { Error404 } from "./";
import axios from "axios";

const containerVariants = {
	initial: {
		x: "50%",
		opacity: 0,
		transition: { ease: "easeInOut" },
	},

	animate: {
		x: 0,
		opacity: 1,
		transition: {
			ease: "easeInOut",
			duration: 0.5,
			type: "spring",
			stiffness: 100,
		},
	},

	exit: {
		x: "-50%",
		opacity: 0,
		transition: { ease: "easeInOut" },
	},
};
function FindYourAccount() {
	const navigate = useNavigate();
	const [userInput, setUserInput] = useState(null);
	async function findUserInDb() {
		const userInputType = isItUsernameOrEmail(userInput);
		if (userInputType.success) {
			try {
				const { data: userData } = await axios.post(
					"https://database-1.joygupta1.repl.co/user/validate",
					{
						[userInputType.type]: userInput,
					}
				);
				navigate(`/forgot-password?userId=${userData.data.id}`);
			} catch (error) {
				console.log("Error ", error.response.data.message);
			}
		} else {
			console.log("Please enter a valid email/username");
		}
	}
	return (
		<div className="recovery-tile">
			<div className="recovery-details">
				<h1>Recover Your Account</h1>
				<div className="hr-div"></div>
				<h2>
					Please enter your username or registered email address to search your
					account
				</h2>
				<input
					onChange={(event) => setUserInput(event.target.value)}
					placeholder="Username or Email"
					type="text"
				/>
			</div>
			<div className="hr-div"></div>
			<div className="recovery-navigator">
				<button className="primary-button" onClick={findUserInDb}>
					Search
				</button>
				<button className="secondary-button">Cancel</button>
			</div>
		</div>
	);
}
function VerifyYourIdentity() {
	const [userData, setUserData] = useState({});
	const [userInput, setUserInput] = useState(null);
	const navigate = useNavigate();
	const { search } = useLocation();
	const searchObj = queryStringToObject(search);
	useEffect(() => {
		if (
			Object.keys(searchObj).length === 1 &&
			!!searchObj.userId &&
			checkUserId(searchObj.userId)
		) {
			const getDataFromServer = async () => {
				try {
					const dataFromServer = await axios.get(
						`https://database-1.joygupta1.repl.co/user/security-question/${searchObj.userId}`
					);
					setUserData(dataFromServer.data.data);
				} catch ({ response }) {
					console.log(response.data.message);
				}
			};
			getDataFromServer();
		}
	}, []);

	async function validateUser() {
		try {
			const serverResponse = await axios.post(
				"https://database-1.joygupta1.repl.co/user/security-answer-validation",
				{
					id: searchObj.userId,
					answer: userInput,
				}
			);
			console.log(serverResponse);
			if (serverResponse.data.success) {
				localStorage.setItem("isUserValid", JSON.stringify(true));
				navigate(`/forgot-password?userId=${searchObj.userId}&reset=true`);
			} else {
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="recovery-tile">
			<div className="recovery-details">
				<h1>
					Please Verify Its You!
					<span>{userData.name}</span>
				</h1>
				<div className="hr-div"></div>
				<h2>Enter answer to the security question</h2>
				<div className="recovery-qna">
					<h3 className="recovery-question">{userData.question}</h3>
					<input
						onChange={(event) => setUserInput(event.target.value)}
						placeholder="Answer"
						type="text"
					/>
				</div>
			</div>
			<div className="hr-div"></div>
			<div className="recovery-navigator">
				<button onClick={validateUser} className="primary-button">
					Verify
				</button>
				<button className="secondary-button">Cancel</button>
			</div>
		</div>
	);
}
function RecoverYourAccount() {
	return (
		<div className="recovery-tile">
			<div className="recovery-details">
				<h1>
					We Got You
					<span style={{ color: "#ff6994" }}>Joy ✨</span>
				</h1>
				<div className="hr-div"></div>
				<h2>You are just one step away to recover your account</h2>
				<input
					onChange={(event) => console.log(event.target.value)}
					placeholder="New Password"
					type="text"
				/>
				<input
					onChange={(event) => console.log(event.target.value)}
					placeholder="Confirm New Password"
					type="text"
				/>
			</div>
			<div className="hr-div"></div>
			<div className="recovery-navigator">
				<Link className="primary-button" to={{ pathname: "/forgot-password" }}>
					Change
				</Link>
				<button className="secondary-button">Cancel</button>
			</div>
		</div>
	);
}
const pages = {
	findYourAccount: FindYourAccount,
	verifyYourAccount: VerifyYourIdentity,
	recoverYourAccount: RecoverYourAccount,
	error: Error404,
};

export default function ForgotPassword() {
	const [recoveryTile, setRecoveryTile] = useState("findYourAccount");
	const { search, pathname } = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const urlObject = queryStringToObject(search);
		if (pathname === "/forgot-password" && search === "") {
			setRecoveryTile("findYourAccount");
		} else if (checkUserId(urlObject.userId) && urlObject.reset === "true") {
			setRecoveryTile("recoverYourAccount");
		} else if (checkUserId(urlObject.userId)) {
			setRecoveryTile("verifyYourAccount");
		} else {
			setRecoveryTile("error");
		}
	}, [pathname, search]);
	const Component = pages[recoveryTile];

	return (
		<div className="recovery-parent">
			<AnimatePresence exitBeforeEnter>
				<motion.div
					key={recoveryTile}
					variants={containerVariants}
					initial="initial"
					animate="animate"
					exit="exit"
				>
					<Component />
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
