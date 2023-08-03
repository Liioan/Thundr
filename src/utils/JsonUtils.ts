export const parseJson = <noteType>(data: string) => {
  let result: noteType | undefined;
  try {
    result = JSON.parse(data);
  } catch (err) {
    console.log("error", err);
  }
  return result;
};

export const stringify = <noteType>(data: noteType) => {
  let result: string | undefined;
  try {
    result = JSON.stringify(data);
  } catch (err) {
    console.log("error", err);
  }
  return result;
};
