export const parseJson = <noteType>(data: string) => {
  let result: noteType | undefined;
  try {
    result = JSON.parse(data);
  } catch (err) {
    console.log("error", err);
  }
  return result;
};
