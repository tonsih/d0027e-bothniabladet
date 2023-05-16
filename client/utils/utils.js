const getNowDateISOString = () => {
	const now = DateTime.now()
		.setZone('Europe/Stockholm')
		.toJSDate()
		.toLocaleString('en-US', { timeZone: 'Europe/Stockholm' });

	const isoOrderDate = new Date(now);
	isoOrderDate.setHours(isoOrderDate.getHours() + 2);
	return (isoString = isoOrderDate.toISOString());
};

const isRequiredString = requiredFieldName => {
	return `${requiredFieldName} is a required field`;
};

export { getNowDateISOString, isRequiredString };
