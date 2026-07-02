import { useState } from "react";

export default function useForm(initialValues = {}) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const {name, value} = event.target;
        setValues({...values,[name]: value});
        setErrors({...errors, [name]: undefined}); // Clear error for the field
    }

    const setError = (name, error) => {
        setErrors({...errors, [name]: error});
    }

    const resetForm = (newValues = initialValues) => {
        setValues(newValues);
        setErrors({});
    }
    
    return {
        values,
        errors,
        setError,
        handleChange,
        resetForm
    }
}