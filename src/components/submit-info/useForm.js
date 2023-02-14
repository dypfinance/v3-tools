import { useEffect, useState } from "react";

const useForm = (validate) => {
    const [values, setValues] = useState({
       
        project_name: "",
        email: "",
        logo_link: "",
        ticker: "",
        contract_address: "",
        about: "",
        audit_info: "",
        audit_link: "",
        website_link: "",
        twitter: "",
        coinmarket: "",
        telegram: "",
        coingecko: "",
    })
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleChange = (e) =>{
        const {name, value} = e.target
        setValues({
            ...values,
            [name]: value
        });
    };

    const handleSubmit = (e) =>{
        e.preventDefault();


        console.log(e);
        // console.log(isSubmitting);
        setErrors(validate(values));
        setIsSubmitting(true);
    };

    return{handleChange, values, handleSubmit, errors}
};

export default useForm;