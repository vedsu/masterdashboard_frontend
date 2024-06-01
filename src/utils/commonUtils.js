export const getEnvVariableValues = (key) => {
  if (!key) throw new Error("Please pass the env key to get value");
  if (window?.env && window?.env?.[key]) return window?.env?.[key];
  return import.meta.env[key];
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
