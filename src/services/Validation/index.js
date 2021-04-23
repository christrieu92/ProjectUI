export const ValidateName = (name) => {
  var nameValidate = true;

  if (name.length < 5) {
    nameValidate = false;
  }

  return nameValidate;
};

export const ValidateEmail = (email) => {
  const regEx = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

  var emailValidate = true;

  if (!regEx.test(email)) {
    emailValidate = false;
  }

  return emailValidate;
};

export const ValidatePassword = (password) => {
  var passwordValidate = true;

  if (password.length < 8) {
    passwordValidate = false;
  }

  return passwordValidate;
};
