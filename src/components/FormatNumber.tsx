import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import {
  formatBigBalance,
  formatPercent,
  formatCurrency,
  formatValue,
  convertMiniumNumber,
} from "../utils";
import numeral from "numeral";

export const FormatNumber = ({
  number,
  type = "value",
}: {
  number: number;
  type: "amount" | "balance" | "percent" | "value";
}) => {
  const [numberFormat, setNumberFormat] = useState<any>(0);
  const [numberSize, setNumberSize] = useState<any>("");

  useEffect(() => {
    const { number_format, number_size } = formatBigBalance(number);
    setNumberFormat(number_format);
    setNumberSize(number_size);
  }, [number]);

  const removeTrailingZeros = (value: string) => {
    const [integerPart, decimalPart] = value.split(".");
    if (decimalPart) {
      // If there's a decimal part, ensure it has at least 2 digits
      const formattedDecimal = decimalPart
        .padEnd(2, "0")
        .replace(/0+$/, "")
        .padEnd(2, "0");
      return `${integerPart}.${formattedDecimal}`;
    }
    // If there's no decimal part, add .00
    return `${integerPart}.00`;
  };

  return (
    <>
      {type === "percent" ? (
        <span className="w-max">
          {formatPercent(number) === "NaN" ? 0 : formatPercent(number)}
        </span>
      ) : (
        <span className="w-max">
          {(numberSize && numberSize !== "K") ||
          formatPercent(number) === "NaN" ? (
            <span className="flex items-center">
              <span className="flex items-center">
                {type === "value" ? "$" : ""}
                {numeral(numberFormat).format("0,0.00") === "NaN" ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        convertMiniumNumber(numberFormat),
                      ),
                    }}
                  ></div>
                ) : (
                  <>{numeral(numberFormat).format("0,0.00")}</>
                )}
              </span>
              <span>{numberSize}</span>
            </span>
          ) : (
            <span className="w-max">
              {type === "value" ? (
                <>
                  {number < 0 ? "-" : ""}$
                  {removeTrailingZeros(formatValue(Math.abs(number)))}
                </>
              ) : (
                <>{removeTrailingZeros(formatCurrency(number))}</>
              )}
            </span>
          )}
        </span>
      )}
    </>
  );
};
