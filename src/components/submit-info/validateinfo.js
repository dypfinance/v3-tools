export default function validateInfo(values) {
  let errors = {};
  if (!values.email) {
    errors.email = "This field is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Email Address is Invalid";
  }
  
  if (!values.project_name) {
    errors.project_name = "This field is required";
  } else if (!/^[A-Za-z ][A-Za-z0-9_ ]{3,29}$/i.test(values.project_name)) {
    errors.project_name = "Project Name is Invalid";
  }

  // if(!values.logo_link) {
  //   errors.logo_link = "This field is required";
  // } else if(!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(values.logo_link)) {
  //   errors.logo_link = "URL is invalid";
  // }

  if (!values.ticker.trim()) {
    errors.ticker = "This field is required";
  }

  if (!values.project_logo.trim()) {
    errors.project_logo = "Logo is required";
  }

  if (!values.contract_address.trim()) {
    errors.contract_address = "This field is required";
  } else if(!/^0x[a-fA-F0-9]{40}$/i.test(values.contract_address)) {
    errors.contract_address = "Contract address is invalid"
  }


  if (!values.about.trim()) {
    errors.about = "This field is required";
  }

  if (!values.audit_info.trim()) {
    errors.audit_info = "This field is required";
  }
  if (!values.audit_link.trim()) {
    errors.audit_link = "This field is required";
  } else if(!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(values.audit_link)) {
    errors.audit_link = "URL is invalid";
  }

  if (!values.website_link.trim()) {
    errors.website_link = "This field is required";
  } else if(!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(values.website_link)) {
    errors.website_link = "URL is invalid";
  }
  if (!values.twitter.trim()) {
    errors.twitter = "This field is required";
  } else if(!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(values.twitter)) {
    errors.twitter = "URL is invalid";
  }



  if (!values.coinmarket.trim()) {
    errors.coinmarket = "This field is required";
  } else if(!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(values.coinmarket)) {
    errors.coinmarket = "URL is invalid";
  }
  if (!values.telegram.trim()) {
    errors.telegram = "This field is required";
  } else if(!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(values.telegram)) {
    errors.telegram = "URL is invalid";
  }
  if (!values.telegram_channel.trim()) {
    errors.telegram_channel = "This field is required";
  } else if(!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(values.telegram_channel)) {
    errors.telegram_channel = "URL is invalid";
  }

  if (!values.coingecko.trim()) {
    errors.coingecko = "This field is required";
  } else if(!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(values.coingecko)) {
    errors.coingecko = "URL is invalid";
  }

  return errors;
}
