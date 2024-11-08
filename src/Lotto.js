class Lotto {
  #numbers;

  constructor(numbers) {
    this.#validate(numbers);
    this.#numbers = numbers;
  }

  #validate(numbers) {
    if (numbers.length !== 6) {
      throw new Error("[ERROR] 로또 번호는 6개여야 합니다.");
    }

    const duplicates = numbers.filter(
      (item, index) => numbers.indexOf(item) !== index
    );
    if (duplicates.length > 0) {
      throw new Error("[ERROR] 중복된 당첨 번호가 있습니다.");
    }

    if (
      numbers.some((num) => isNaN(num) || !Number.isInteger(num) || num === "")
    ) {
      throw new Error("[ERROR] 로또 번호는 숫자만 입력할 수 있습니다.");
    }

    if (numbers.some((num) => num < 1 || num > 45)) {
      throw new Error("[ERROR] 로또 번호는 1부터 45 사이의 숫자여야 합니다.");
    }
  }

  getNumbers() {
    return this.#numbers;
  }
}

export default Lotto;
