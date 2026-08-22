import type React from "react";

type DateProfileFormatterProps = {
	date?: Date | null;
};

export const DateProfileFormatter: React.FC<DateProfileFormatterProps> = ({
	date,
}) => {
	if (!date) return <em>—</em>;
	const d = new Date(date);
	const pad = (num: number) => String(num).padStart(2, "0");
	const day = d.getDate();
	const month = d.toLocaleString("es-ES", { month: "short" });
	const year = d.getFullYear();
	const hours = pad(d.getHours());
	const minutes = pad(d.getMinutes());
	return (
		<span>
			{day} {month} {year} {hours}:{minutes}
		</span>
	);
};

type DateFormatterProps = {
	date?: Date | null;
};

export const DateFormatter: React.FC<DateFormatterProps> = ({ date }) => {
	if (!date) return <em>—</em>;

	const d = new Date(date);
	const pad = (num: number) => String(num).padStart(2, "0");
	const hours = pad(d.getHours());
	const minutes = pad(d.getMinutes());
	const seconds = pad(d.getSeconds());
	const day = pad(d.getDate());
	const month = pad(d.getMonth() + 1);
	const year = String(d.getFullYear()).slice(-2);

	return (
		<span>
			{hours}:{minutes}:{seconds} - {day}-{month}-{year}
		</span>
	);
};
