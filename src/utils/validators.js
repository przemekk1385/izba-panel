function getSafe(fn, defaultValue) {
  try {
    return fn;
  } catch (e) {
    return defaultValue;
  }
}

function isFile(file) {
  return file && file instanceof File;
}

function isFileImage(file) {
  return isFile(file) && (() => getSafe(file.type.split("/")[0], ""))() === "image";
}

export { getSafe, isFile, isFileImage };
