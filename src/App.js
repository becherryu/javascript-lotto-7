import * as MissionUtils from "@woowacourse/mission-utils";
import Lotto from "./Lotto.js";

class App {
  async run() {
    try {
      // 1. 로또 구입 금액 입력받기
      const amount = await this.getLottoBuyAmount();

      // 2-1. 로또 번호 발행하기
      const tickets = this.generateLottos(amount);
      // 2-2. 로또 번호 출력하기
      this.printLottos(tickets);

      // 3. 당첨 번호 입력받기
      const winningNumbers = await this.getWinningNumbers();

      // 4. 보너스 번호 입력받기
      const bonusNumber = await this.getBonusNumber(
        winningNumbers.getNumbers()
      );
    } catch (error) {
      MissionUtils.Console.print(error.message);
      throw error;
    }
  }

  // 1. 로또 구입 금액 입력받기
  async getLottoBuyAmount() {
    const AMOUNT = await MissionUtils.Console.readLineAsync(
      "구입금액을 입력해 주세요.\n"
    );
    const INT_AMOUNT = parseInt(AMOUNT, 10);

    if (
      INT_AMOUNT === "" ||
      isNaN(INT_AMOUNT) ||
      INT_AMOUNT < 1000 ||
      INT_AMOUNT % 1000 !== 0
    ) {
      throw new Error("[ERROR] 구입 금액은 1,000원 단위의 숫자여야 합니다.");
    }

    return INT_AMOUNT;
  }

  // 2-1. 로또 번호 발행하기
  generateLottos(amount) {
    const TICKET = Math.floor(amount / 1000);
    return Array.from({ length: TICKET }, () => this.generateEachLotto());
  }

  generateEachLotto() {
    const LOTTO_NUMBERS = MissionUtils.Random.pickUniqueNumbersInRange(
      1,
      45,
      6
    ).sort((a, b) => a - b);
    return new Lotto(LOTTO_NUMBERS);
  }

  // 2-2. 로또 번호 출력하기
  printLottos(tickets) {
    MissionUtils.Console.print(`\n${tickets.length}개를 구매했습니다.`);
    tickets.forEach((ticket) => {
      MissionUtils.Console.print(`[${ticket.getNumbers().join(", ")}]`);
    });
  }

  // 3. 당첨 번호 입력받기
  async getWinningNumbers() {
    const WINNING_NUMBERS = await MissionUtils.Console.readLineAsync(
      "\n당첨 번호를 입력해 주세요. (각 번호는 쉼표로 구분하여 주세요.)\n"
    );
    const NUMBERS = WINNING_NUMBERS.split(",").map(Number);

    // Lotto 클래스로 검증 및 객체 생성
    const WINNING_LOTTO = new Lotto(NUMBERS);
    return WINNING_LOTTO;
  }

  // 4. 보너스 번호 입력받기
  async getBonusNumber(winningNumbers) {
    const INPUT = await MissionUtils.Console.readLineAsync(
      "\n보너스 번호를 입력해 주세요. (한 개만 입력해주세요.)\n"
    );
    const BONUS_NUMBER = parseInt(INPUT, 10);

    if (
      BONUS_NUMBER === "" ||
      isNaN(BONUS_NUMBER) ||
      BONUS_NUMBER < 1 ||
      BONUS_NUMBER > 45
    ) {
      throw new Error(
        "[ERROR] 보너스 번호는 1에서 45 사이의 정수만 가능합니다."
      );
    }

    if (winningNumbers.includes(BONUS_NUMBER)) {
      throw new Error("[ERROR] 보너스 번호는 당첨 번호와 중복될 수 없습니다.");
    }
    return BONUS_NUMBER;
  }
}

export default App;
