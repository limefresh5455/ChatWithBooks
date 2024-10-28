

export const signUpValidation = (userDetails) => {
    let errors = {};
  
    const { name, email , password, confirmPassword } = userDetails;
  
    // Validate name field 
    if (!name) { 
      errors.name = '*Name is required.'; 
    }
  
    // Validate email field 
    if (!email) { 
      errors.email = '*Email is required.'; 
    } else if (!/\S+@\S+\.\S+/.test(email)) { 
      errors.email = '*Email is invalid.'; 
    }
  
    // Validate number field
    // if (!number) {
    //     errors.number = '*Mobile number is required.';
    //   }else if (!/^\d{10}$/.test(userDetails.number)) {
    //     errors.number = '*Mobile number is invalid. Please enter a 10-digit number.';
    //   }
  
    // Validate password field 
    if (!password) { 
      errors.password = '*Password is required.'; 
    } else if (password.length < 8) { 
      errors.password = '*Password must be at least 8 characters.'; 
    }
  
    // Validate confirmPassword password field 
    if (!confirmPassword) { 
      errors.confirmPassword = '*confirmPassword password is required.'; 
    } else if (confirmPassword !== password) { 
      errors.confirmPassword = '*Passwords do not match.'; 
    }
    return errors;
  };
  


  export const signInValidation = (userDetails) => {
    let errors = {};
  
    const {  email ,password } = userDetails;
  
    // Validate email field 
    if (!email) { 
      errors.email = '*Email is required.'; 
    } else if (!/\S+@\S+\.\S+/.test(email)) { 
      errors.email = '*Email is invalid.'; 
    }

    // Validate password field 
    if (!password) { 
      errors.password = '*Password is required.'; 
    } else if (password.length < 8) { 
      errors.password = '*Password must be at least 8 characters.'; 
    }
    return errors;
  };

  export const  LoginAsGuestValidation = (guestName,guestEmail) => {
    let errors = {};

    if (!guestName) { 
      errors.guestName = '*Name is required.'; 
    }

    if (!guestEmail) { 
      errors.guestEmail = '*Email is required.'; 
    } else if (!/\S+@\S+\.\S+/.test(guestEmail)) { 
      errors.guestEmail = '*Email is invalid.'; 
    }

    return errors;
  }

  export const  forgotPasswordValidation = (email) => {
    let errors = {};
    if (!email) { 
      errors.email = '*Email is required.'; 
    } else if (!/\S+@\S+\.\S+/.test(email)) { 
      errors.email = '*Email is invalid.'; 
    }
    return errors;
  }

  export const  resetPasswordValidation = (password,confirmPassword) => {
    let errors = {};
    
    if (!password) { 
      errors.password = '*Password is required.'; 
    } else if (password.length < 8) { 
      errors.password = '*Password must be at least 8 characters.'; 
    }
  
    if (!confirmPassword) { 
      errors.confirmPassword = '*confirmPassword password is required.'; 
    } else if (confirmPassword !== password) { 
      errors.confirmPassword = '*Passwords do not match.'; 
    }

    return errors;
  }



  export const shippingAddressValidation = (addressDetails) => {
    let errors = {};
  
    const { firstName, lastName, email, streetAddress, aptNumber, country, state, city, zipCode, mobileNumber } = addressDetails;
  
    // Validate first name field 
    if (!firstName) {
      errors.firstName = '*First name is required.';
    }
  
    // Validate last name field 
    if (!lastName) {
      errors.lastName = '*Last name is required.';
    }
  
    // Validate email field 
    if (!email) {
      errors.email = '*Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = '*Email is invalid.';
    }
  
    // Validate street address field
    if (!streetAddress) {
      errors.streetAddress = '*Street address is required.';
    }
  
    // Validate apartment number field (optional)
    if (!aptNumber) {
      errors.aptNumber = '*Apartment number is required.';
    }
  
    // Validate country field
    if (!country) {
      errors.country = '*Country is required.';
    }
  
    // Validate state field
    if (!state) {
      errors.state = '*State is required.';
    }
  
    // Validate city field
    if (!city) {
      errors.city = '*City is required.';
    }
  
    // Validate zip code field
    if (!zipCode) {
      errors.zipCode = '*Zip code is required.';
    }
  
    // Validate mobile number field
    if (!mobileNumber) {
      errors.mobileNumber = '*Mobile number is required.';
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      errors.mobileNumber = '*Mobile number is invalid. Please enter a 10-digit number.';
    }
  
    return errors;
  };
  