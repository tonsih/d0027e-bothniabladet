const { DateTime } = require('luxon');

const getNowDateISOString = () => {
	const now = DateTime.now()
		.setZone('Europe/Stockholm')
		.toJSDate()
		.toLocaleString('en-US', { timeZone: 'Europe/Stockholm' });

	const isoOrderDate = new Date(now);
	isoOrderDate.setHours(isoOrderDate.getHours() + 2);
	return (isoString = isoOrderDate.toISOString());
};

module.exports = { getNowDateISOString };
