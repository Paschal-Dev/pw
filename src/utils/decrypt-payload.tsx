// Function to decode Base64Url
const base64UrlDecode = (input: string) => {
    let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if necessary
    while (base64.length % 4 !== 0) {
        base64 += "=";
    }
    return atob(base64);
};
// Function to decode JWT
const decodeJWT = (token: string) => {
    const [header, payload] = token.split(".");
    const decodedHeader = JSON.parse(base64UrlDecode(header));
    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    return { header: decodedHeader, payload: decodedPayload };
};

export default decodeJWT;