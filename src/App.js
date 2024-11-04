import * as MissionUtils from "@woowacourse/mission-utils";
import Lotto from "./Lotto.js";

class App {
  async run() {
    try {
      // 1. 로또 구입 금액 입력받기
      const amount = await this.getLottoBuyAmount();
      this.amount = amount;

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

      // 5. 당첨 내역 계산하기
      const results = this.calculateResults(
        tickets,
        winningNumbers.getNumbers(),
        bonusNumber
      );

      // 6. 당첨 내역 출력하기
      this.printResults(results);
    } catch (error) {
      MissionUtils.Console.print(error.message);
      //throw error;
    }
  }

  // 1. 로또 구입 금액 입력받기
  async getLottoBuyAmount() {
    const AMOUNT = await MissionUtils.Console.readLineAsync(
      "구입금액을 입력해 주세요.\n"
    );

    // 정규식 검사: 숫자로만 이루어졌는지, 그리고 1000 단위인지 확인
    if (!/^\d+$/.test(AMOUNT) || parseInt(AMOUNT, 10) % 1000 !== 0) {
      throw new Error("[ERROR] 구입 금액은 1,000원 단위의 숫자여야 합니다.");
    }

    return parseInt(AMOUNT, 10);
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

  // 5. 당첨 내역 계산하기
  calculateResults(tickets, winningNumbers, bonusNumber) {
    const RESULTS = { 3: 0, 4: 0, 5: 0, 5.5: 0, 6: 0 };
    tickets.forEach((ticket) => {
      const MATCH_NUMBERS = this.getMatchNumbers(
        ticket.getNumbers(),
        winningNumbers
      );

      if (MATCH_NUMBERS === 5 && ticket.getNumbers().includes(bonusNumber)) {
        RESULTS["5.5"]++;
      } else if (MATCH_NUMBERS >= 3) {
        RESULTS[MATCH_NUMBERS]++;
      }
    });
    return RESULTS;
  }

  getMatchNumbers(numbers, winningNumbers) {
    return numbers.filter((num) => winningNumbers.includes(num)).length;
  }

  // 6-1. 당첨 내역 출력하기
  printResults(results) {
    MissionUtils.Console.print("당첨 통계\n---");
    MissionUtils.Console.print(`3개 일치 (5,000원) - ${results[3]}개`);
    MissionUtils.Console.print(`4개 일치 (50,000원) - ${results[4]}개`);
    MissionUtils.Console.print(`5개 일치 (1,500,000원) - ${results[5]}개`);
    MissionUtils.Console.print(
      `5개 일치, 보너스 볼 일치 (30,000,000원) - ${results[5.5]}개`
    );
    MissionUtils.Console.print(`6개 일치 (2,000,000,000원) - ${results[6]}개`);

    const PROFIT_RATE = this.calculateProfitRate(results);
    MissionUtils.Console.print(`총 수익률은 ${PROFIT_RATE}%입니다.`);
  }

  // 6-2. 수익률 계산하기
  calculateProfitRate(results) {
    const REWARDS = {
      3: 5000,
      4: 50000,
      5: 1500000,
      5.5: 30000000,
      6: 2000000000,
    };
    const TOTAL_REWARDS = Object.entries(results).reduce(
      (sum, [rank, count]) => {
        return sum + count * REWARDS[rank];
      },
      0
    );

    const TOTAL_SPENT = this.amount;

    return ((TOTAL_REWARDS / TOTAL_SPENT) * 100).toFixed(1);
  }
}

export default App;
