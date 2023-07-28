export const jsonParser = (input: string) => {
  input = input.replace(/\s/g, "");
  let i = 0;

  const checkColon = () => {
    if (input[i] !== ":") {
      throw new Error(`Expected ":" reveived ${input[i]}`);
    }
    i++;
  };
  const checkComma = () => {
    if (input[i] !== ",") {
      throw new Error(`Expected "," reveived ${input[i]}`);
    }
    i++;
  };
  const checkTrue = () => {
    if (input.slice(i, i + 4) === "true") {
      i += 4;
      return true;
    }
  };
  const checkFalse = () => {
    if (input.slice(i, i + 5) === "false") {
      i += 5;
      return false;
    }
  };
  const checkNull = () => {
    if (input.slice(i, i + 4) === "null") {
      i += 4;
      return null;
    }
  };
  const parseString = () => {
    if (input[i] === '"') {
      i++;
      let str = "";
      while (input[i] !== '"') {
        str += input[i];
        i++;
      }
      i++;
      return str;
    }
  };
  const parseNumber = () => {
    let length = i;
    if (input[i] === "-") i++;
    if (input[i] === "0") {
      i++;
    } else if (input[i] >= "1" && input[i] <= "9") {
      i++;
      while (input[i] >= "0" && input[i] <= "9") {
        i++;
      }
    }
    if (input[i] === ".") {
      i++;
      while (input[i] >= "0" && input[i] <= "9") {
        i++;
      }
    }
    if (i > length) {
      return Number(input.slice(length, i));
    }
  };
  const parseValue = () => {
    const value: any =
      parseObject() ||
      parseArray() ||
      parseString() ||
      parseNumber() ||
      checkTrue() ||
      checkFalse() ||
      checkNull();
    return value;
  };
  const parseObject = () => {
    if (input[i] === "{") {
      const result: Record<string, any> = {};
      i++;
      let firstPass = true;
      while (input[i] !== "}") {
        if (!firstPass) {
          checkComma();
        }
        const key = parseString();
        if (!key) {
          throw new Error("Invalid Key");
        }
        checkColon();
        const value = parseValue();
        result[key] = value;
        firstPass = false;
      }
      i++;
      return result;
    }
  };
  const parseArray = () => {
    if (input[i] === "[") {
      const result = [];
      i++;
      let firstPass = true;
      while (input[i] !== "]") {
        if (!firstPass) {
          checkComma();
        }
        const value = parseValue();
        result.push(value);
        firstPass = false;
      }
      i++;
      return result;
    }
  };
  return parseValue();
};
