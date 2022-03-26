import React from "react";

// MUI
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";

const styles = makeStyles({
	root: {
		borderRadius: 50,
		fontFamily: '"Poppins", "Roboto", sans-serif',
		width: "fit-content !important",
		height: "fit-content",
		"&.MuiButton-outlined": {
			color: "var(--suse-jungle-green)",
			borderColor: "var(--suse-jungle-green)",
		},
		"&.MuiButton-contained": {
			backgroundColor: "var(--suse-jungle-green)",
		},
		"&.MuiButton-textPrimary": {
			color: "var(--suse-jungle-green)",
			textDecoration: "underline",
			width: "fit-content !important",
			borderRadius: 0,
			marginLeft: "0px !important",
		},
		// Custom button variants
		"&.MuiButton-editPrimary": {
			color: "white",
			backgroundColor: "var(--suse-waterhole-blue)",
		},
		"&.MuiButton-deletePrimary": {
			color: "white",
			backgroundColor: "var(--suse-persimmon)",
		},
		"&.MuiButton-editWithIconPrimary": {
			// 'Edit' variant with an ending icon
			color: "white",
			backgroundColor: "var(--suse-waterhole-blue)",
		},
		"&.MuiButton-deleteWithIconPrimary": {
			// 'Delete' variant with an ending icon
			color: "white",
			backgroundColor: "var(--suse-persimmon)",
		},
	},
});

export default function SUSEButton({ label, ...props }) {
	const classes = styles();

	return (
		<Button
			disableElevation
			className={`${classes.root} suse-button-custom`}
			{...props}
		>
			{label}
		</Button>
	);
}
