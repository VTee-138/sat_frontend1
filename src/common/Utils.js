export const generateRandomNumber = () => {
  // Tạo một số ngẫu nhiên từ 1000000000 đến 9999999999 (10 chữ số)
  const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
  return randomNum.toString(); // Chuyển số thành chuỗi
};

export const isNumeric = (numericValue) => {
  if (numericValue === 0 || numericValue === "0") return true;
  if (!numericValue) return false;
  if (typeof numericValue === "string" && numericValue.includes(",")) {
    numericValue = numericValue.replace(",", ".");
  }
  if (numericValue.endsWith(".")) return false;
  return !isNaN(numericValue) && !isNaN(parseFloat(numericValue));
};
