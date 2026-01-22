function GetAuthToken() {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("hexToken="))
    ?.split("=")[1];

  return token;
}
export default GetAuthToken;
