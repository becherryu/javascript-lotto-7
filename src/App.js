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
}

export default App;
