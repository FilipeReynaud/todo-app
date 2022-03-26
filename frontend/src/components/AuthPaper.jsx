import React, { useState, useEffect } from "react";

// Routing
import { useNavigate } from "react-router-dom";

// Store
import { useSelector, useDispatch } from "react-redux";
import { setLoggedIn, setUser } from "../globalSlice";

// PropTypes
import PropTypes from "prop-types";

// MUI
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

// Internal
import SUSETextField from "./TextField";
import SUSEButton from "./Button";
import { fetchUser, createUser } from "../APICalls";
import { INCORRECT_ENTRY_ERROR } from "../data/constants";
import "./style.css";

// Inline styles
const authPaperGridContainer = {
	height: "100%",
	width: "100%",
	margin: 0,
};
const authPaperGridItem = { paddingLeft: 0 };
const stackAlignment = { alignItems: "center" };

export default function AuthPaper({ authType }) {
	const [localState, setLocalState] = useState({
		login: {
			usernameField: "",
			usernameFieldError: false,
		},
		signUp: {
			emailField: "",
			emailFieldError: false,
			usernameField: "",
			usernameFieldError: false,
		},
		errorMsg: INCORRECT_ENTRY_ERROR,
	});
	const [callingAPI, setCallingAPI] = useState(false);
	const [loginSuccess, setLogginSuccess] = useState(false);
	const loggedIn = useSelector((state) => state.app.loggedIn);
	const user = useSelector((state) => state.app.user);
	const dispatch = useDispatch();
	let navigate = useNavigate();

	const onChangeHandler = (e) => {
		setLocalState((prevState) => ({
			...prevState,
			[authType]: {
				...prevState[authType],
				[e.target.id]: e.target.value,
				[e.target.id + "Error"]: false,
			},
			errorMsg: INCORRECT_ENTRY_ERROR, // Reset error message
		}));
	};

	useEffect(() => {
		if (loggedIn && user !== null) {
			navigate("/dashboard");
		}
	}, []);

	useEffect(() => {
		if (loginSuccess) {
			navigate("/dashboard");
		}
	}, [loginSuccess]);

	const updateErrorFields = (field, msg) => {
		setLocalState((prevState) => ({
			...prevState,
			[authType]: {
				...prevState[authType],
				[field + "Error"]: true,
			},
			errorMsg: msg ? msg : INCORRECT_ENTRY_ERROR,
		}));
	};

	const validateFields = () => {
		let errors = false;
		for (let key in localState[authType]) {
			if (!key.toLowerCase().includes("error")) {
				if (!localState[authType][key]) {
					errors = true;
					setLocalState((prevState) => ({
						...prevState,
						[authType]: {
							...prevState[authType],
							[key + "Error"]: true,
						},
					}));
				}
			}
		}

		return !errors;
	};

	const onLogin = () => {
		let isValid = validateFields();
		if (isValid) {
			setCallingAPI(true);
			fetchUser(localState[authType].usernameField)
				.then((response) => {
					if (response && response[0] === 200) {
						if (response[1].length !== 0) {
							let user = response[1][0];
							dispatch(
								setUser({
									id: user.id,
									username: user.name,
									email: user.email,
								})
							);
							dispatch(setLoggedIn(true));
							setLogginSuccess(true);
						} else {
							updateErrorFields(
								"usernameField",
								"This user does not exist"
							);
						}
					} else {
						updateErrorFields(
							"usernameField",
							"There was an error. Contact support."
						);
					}
					setCallingAPI(false);
				})
				.catch((error) => {
					setCallingAPI(false);
					updateErrorFields(
						"usernameField",
						"There was an error. Contact support."
					);
				});
		}
	};

	const onSignUp = () => {
		let isValid = validateFields();
		if (isValid) {
			setCallingAPI(true);
			const body = {
				user_name: localState.signUp.usernameField,
				email: localState.signUp.emailField,
			};
			createUser(body)
				.then((response) => {
					if (response && response[0] === 201) {
						if (response[1].length !== 0) {
							dispatch(
								setUser({
									id: response[1],
									username: localState.signUp.usernameField,
									email: localState.signUp.emailField,
								})
							);
							dispatch(setLoggedIn(true));
							setLogginSuccess(true);
						} else {
							updateErrorFields(
								"usernameField",
								"This user does not exist"
							);
						}
					} else {
						updateErrorFields(
							"usernameField",
							response[1]
								? response[1]
								: "There was an error. Contact support."
						);
					}
					setCallingAPI(false);
				})
				.catch((error) => {
					setCallingAPI(false);
					updateErrorFields("usernameField", error);
				});
		}
	};

	return (
		<Paper className="auth-paper" elevation={3}>
			<Grid
				container
				rowSpacing={2}
				columnSpacing={{ xs: 1, sm: 2, md: 3 }}
				style={authPaperGridContainer}
			>
				<Grid item xs={12} style={authPaperGridItem}>
					<Stack spacing={2} style={stackAlignment}>
						<span className="application-entry-title">
							Todo App
						</span>
					</Stack>
				</Grid>
				<Grid item xs={12} style={authPaperGridItem}>
					<Stack spacing={2} style={stackAlignment}>
						{authType === "signUp" && (
							<SUSETextField
								id="emailField"
								label="Email"
								variant="filled"
								style={{ maxWidth: "60%" }}
								onChange={onChangeHandler}
								error={localState[authType].emailFieldError}
								helperText={
									localState[authType].emailFieldError &&
									localState.errorMsg
								}
							/>
						)}
						<SUSETextField
							id="usernameField"
							label="Username"
							variant="filled"
							style={{ maxWidth: "60%" }}
							onChange={onChangeHandler}
							error={localState[authType].usernameFieldError}
							helperText={
								localState[authType].usernameFieldError &&
								localState.errorMsg
							}
						/>
						<SUSEButton
							label={authType === "login" ? "Login" : "Sign Up"}
							variant="contained"
							size="large"
							style={{ width: "30%" }}
							onClick={() => {
								authType === "login" ? onLogin() : onSignUp();
							}}
							disabled={callingAPI}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} style={authPaperGridItem}>
					<Stack spacing={2} style={stackAlignment}>
						<div className="divider-container ">
							<hr className="divider" />
							<span style={{ color: "var(--suse-grey-dark)" }}>
								or
							</span>
							<hr className="divider" />
						</div>

						<Stack spacing={2} direction="row">
							<span className="account-message">
								{authType === "login"
									? "Don't have an account?"
									: "Already have an account?"}
							</span>
							<SUSEButton
								label={
									authType === "login" ? "Sign Up" : "Login"
								}
								disableFocusRipple
								disableRipple
								disableTouchRipple
								onClick={() => {
									navigate(
										authType === "login"
											? "/signUp"
											: "/login"
									);
								}}
								style={{ marginLeft: "0px !important" }}
							/>
						</Stack>
					</Stack>
				</Grid>
			</Grid>
		</Paper>
	);
}

AuthPaper.propTypes = {
	authType: PropTypes.oneOf(["login", "signUp"]),
};
