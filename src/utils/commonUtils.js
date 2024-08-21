export const getEnvVariableValues = (key) => {
  if (!key) throw new Error("Please pass the env key to get value");
  if (window?.env && window?.env?.[key]) return window?.env?.[key];
  return import.meta.env[key];
};

export const getInitialLetterUpperCase = (test) => {
  if (test) {
    const wordArr = test.split(" ");
    const modifiedWordArr = [];
    for (const word of wordArr) {
      modifiedWordArr.push(
        word?.charAt(0)?.toUpperCase() + word.slice(1).toLowerCase()
      );
    }
    return modifiedWordArr?.join(" ");
  } else {
    return test;
  }
};

export const ddmmyy = (date) => {
  if (date) {
    date = new Date(date);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }

    return dt + "/" + month + "/" + year;
  } else {
    return date;
  }
};

export const validateGetRequest = (res) => {
  if (res?.status === 200) return true;
  else return false;
};
export const validatePostRequest = (res) => {
  if (res?.status === 201 || res?.status === 200) return true;
  else return false;
};
export const validatePutRequest = (res) => {
  if (res?.status === 200) return true;
  else return false;
};
export const validatePatchRequest = (res) => {
  if (res?.status === 200) return true;
  else return false;
};
export const validateDeleteRequest = (res) => {
  if (res?.status === 202) return true;
  else return false;
};
