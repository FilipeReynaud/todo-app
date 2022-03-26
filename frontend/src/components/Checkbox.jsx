import React from "react";

// PropTypes
import PropTypes from "prop-types";

// MUI
import MUICheckbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

// Internal
import "./style.css";

const StyledCheckbox = styled(MUICheckbox)(({ checked, style }) => ({
	color: checked ? "var(--suse-jungle-green)" : "#0000001f",
	"&.Mui-checked": {
		color: "var(--suse-jungle-green)",
	},
	...style,
}));

export default function Checkbox({ className, ...props }) {
	return <StyledCheckbox {...props} className={`checkbox ${className}`} />;
}

Checkbox.prototype = {
	className: PropTypes.string,
};
