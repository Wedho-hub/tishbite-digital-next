import crypto from "crypto";
import https from "https";

const PAYFAST_VALID_IPS = [
  "41.74.179.194",
  "41.74.179.195",
  "41.74.179.196",
  "41.74.179.197",
  "127.0.0.1",
  "::1",
];

const isSandbox = process.env.PAYFAST_SANDBOX === "true";

export const PAYFAST_URL = isSandbox
  ? "https://sandbox.payfast.co.za/eng/process"
  : "https://www.payfast.co.za/eng/process";

const PAYFAST_VALIDATE_HOST = isSandbox
  ? "sandbox.payfast.co.za"
  : "www.payfast.co.za";

function buildParamString(data, passphrase = null) {
  const pairs = Object.entries(data)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v)).replace(/%20/g, "+")}`);

  let str = pairs.join("&");

  if (passphrase) {
    str += `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`;
  }

  return str;
}

export function generateSignature(data, passphrase = null) {
  const paramStr = buildParamString(data, passphrase);
  return crypto.createHash("md5").update(paramStr).digest("hex");
}

export function isValidPayFastIP(headers, fallbackIp) {
  const forwarded = headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : fallbackIp;
  return PAYFAST_VALID_IPS.includes(ip);
}

export function verifyItnWithPayFast(itnData) {
  return new Promise((resolve, reject) => {
    const body = buildParamString(itnData);

    const options = {
      hostname: PAYFAST_VALIDATE_HOST,
      port: 443,
      path: "/eng/query/validate",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve(data.trim() === "VALID"));
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}
