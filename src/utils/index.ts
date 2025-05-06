import numeral from "numeral";
import { nimbus } from "../lib/network";

export const wait = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const shorterAddress = (string: string) => {
  return string ? string.slice(0, 6) + "..." + string.substr(-4) : string;
};

const formatNumberSmall = (scientificNotation: any) => {
  const num = parseFloat(scientificNotation);
  const eIndex = num.toString().indexOf("e");
  const exponent = parseInt(num.toString().slice(eIndex + 2), 10);
  const significand = parseFloat(
    num
      .toString()
      .slice(0, eIndex)
      .slice(0, 4)
      .split("")
      .filter((e) => {
        return e !== ".";
      })
      .join(""),
  );

  if (isNaN(num)) {
    return "NaN";
  }

  let formatarr = ["0", "."];
  for (let i = 0; i < exponent - 1; i++) {
    formatarr.push("0");
  }
  const formatString = formatarr.join("").toString();
  const formattedNum = formatString + significand;
  return formattedNum;
};

export const exponentialToDecimal = (exponential: number) => {
  let decimal = exponential.toString().toLowerCase();
  if (decimal.includes("e+")) {
    const exponentialSplitted = decimal.split("e+");
    let postfix = "";
    for (
      let i = 0;
      i <
      +exponentialSplitted[1] -
        (exponentialSplitted[0].includes(".")
          ? exponentialSplitted[0].split(".")[1].length
          : 0);
      i++
    ) {
      postfix += "0";
    }
    const addCommas = (text: any) => {
      let j = 3;
      let textLength = text.length;
      while (j < textLength) {
        text = `${text.slice(0, textLength - j)},${text.slice(
          textLength - j,
          textLength,
        )}`;
        textLength++;
        j += 3 + 1;
      }
      return text;
    };
    decimal = addCommas(exponentialSplitted[0].replace(".", "") + postfix);
  }
  if (decimal.toLowerCase().includes("e-")) {
    const exponentialSplitted = decimal.split("e-");
    let prefix = "0.";
    for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
      prefix += "0";
    }
    decimal = prefix + exponentialSplitted[0].replace(".", "");
  }
  return decimal;
};

export const formatSupperSmallNumber = (number: number) => {
  if (!number.toString().includes("e-")) {
    return number;
  }
  const firstValueChar = exponentialToDecimal(number).indexOf(
    number.toString().slice(0, 1),
  );
  const zeroReplace = exponentialToDecimal(number).slice(2, firstValueChar);
  const formatNumber = exponentialToDecimal(number).replace(
    zeroReplace,
    "0...",
  );
  return formatNumber;
};

export const convertMiniumNumber = (number: any) => {
  if (number.toString().includes("e-")) {
    const numStr = number.toString();
    const eIndex = numStr.indexOf("e");
    if (eIndex !== -1) {
      const exponent = parseInt(numStr.slice(eIndex + 2), 10);
      const significand = parseFloat(
        numStr
          .slice(0, 4)
          .split("")
          .filter((e: any) => e != ".")
          .join(""),
      );

      return `0.0<sub>${exponent - 1}</sub>${significand}`;
    }
  } else {
    return number;
  }
};

export const formatValue = (input: number) => {
  return numeral(input).format("0,0.00") === "NaN"
    ? formatNumberSmall(input)
    : input !== 0 && input > 0 && input < 0.01
      ? numeral(input).format("0,0.000000")
      : numeral(input).format("0,0.00");
};

export const formatCurrency = (input: number) => {
  return numeral(input).format("0,0.000000") === "NaN"
    ? formatNumberSmall(input)
    : input !== 0 && input > 0 && input < 0.01
      ? numeral(input).format("0,0.000000")
      : numeral(input).format("0,0.0000");
};

export const formatBalance = (input: number) => {
  return numeral(input).format("0,0.00") === "NaN"
    ? formatSmallBalance(input)
    : numeral(input).format("0,0.00");
};

export const formatPercent = (input: number) => {
  return numeral(input).format("0,0.00");
};

export const formatSmallBalance = (input: number) => {
  return numeral(input).format("0.000e+0");
};

export const formatBigBalance = (input: number) => {
  if (formatPercent(input) === "NaN") {
    return {
      number_format: formatSmallBalance(input),
      number_size: "",
    };
  } else {
    const regExp = /[a-zA-Z]/g;
    const numberFormat = numeral(input).format("0.00a");
    if (regExp.test(numberFormat)) {
      return {
        number_format: Number(numberFormat.slice(0, -1)),
        number_size: numberFormat.slice(-1).toUpperCase(),
      };
    } else {
      return {
        number_format: Number(numberFormat),
        number_size: "",
      };
    }
  }
};

export const sendDiscordWebhook = async (data: {
  title: string;
  description: string;
  fields: {
    name: string;
    value: string;
  }[];
}) => {
  try {
    await nimbus.post("/v3/swap/webhook", data);
  } catch (error) {
    console.error("Error when send discord webhook:", error);
  }
};
