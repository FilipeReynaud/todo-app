import React from "react";

// PropTypes
import PropTypes from "prop-types";

// ChartJS
import { Chart as ChartJS, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement);

export default function DoughnutChart({ className, dataset }) {
	const data = {
		datasets: [
			{
				data: dataset,
				backgroundColor: ["#30ba78", "#fe7c3f"],
				borderColor: ["#30ba78", "#fe7c3f"],
				borderWidth: 1,
			},
		],
	};

	return (
		<Doughnut
			data={data}
			className={className}
			options={{
				plugins: {
					tooltip: {
						enabled: false,
					},
				},
			}}
		/>
	);
}

DoughnutChart.propTypes = {
	className: PropTypes.string,
	dataset: PropTypes.arrayOf(PropTypes.number).isRequired,
};
