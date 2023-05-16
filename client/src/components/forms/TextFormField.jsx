import { TextField } from '@mui/material';
import { getIn } from 'formik';

const TextFormField = ({ field, form, ...props }) => {
	const errorText =
		getIn(form.touched, field.name) && getIn(form.errors, field.name);

	return (
		<TextField
			fullWidth
			margin='normal'
			helperText={errorText}
			error={!!errorText}
			{...field}
			{...props}
		/>
	);
};
export default TextFormField;
