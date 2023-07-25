export const parseJson = <noteType>(data: string) => {
  let result: noteType | undefined = undefined;
  try {
    result = JSON.parse(data);
  } catch (err) {
    console.log("error", err);
  }
  return result;
};
