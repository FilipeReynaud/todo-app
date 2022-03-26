import React from "react";

// MUI
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";

const styles = makeStyles({
	root: {
		width: "100%",
		minWidth: 70,
		"& .MuiInputLabel-root": {
			color: "var(--suse-grey-dark)",
			fontFamily: '"Poppins", "Roboto", sans-serif',
		},
		"& .MuiFilledInput-root": {
			backgroundColor: "var(--suse-mint-3)",
			// change here color of user input
		},
		"&:hover:not(.Mui-disabled) .MuiFilledInput-root::before": {
			borderBottom: "1px solid var(--suse-jungle-green)",
		},
		"&:hover:not(.Mui-disabled) .MuiFilledInput-root::after": {
			borderBottom: "1px solid var(--suse-jungle-green)",
		},
		"& .MuiFilledInput-root::after": {
			borderBottom: "2px solid var(--suse-jungle-green)", // change here default blue bottom border
		},
		"&:hover .MuiOutlinedInput-input": {
			color: "red",
		},
		"&:hover .MuiInputLabel-root": {
			color: "var(--suse-jungle-green)", // change here label's color onHover
		},
	},
});

export default function SUSETextfield(props) {
	const classes = styles();

	return (
		<TextField
			fullWidth
			className={`${classes.root} suse-textfields-custom`}
			{...props}
		/>
	);
}
