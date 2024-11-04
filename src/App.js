import * as MissionUtils from "@woowacourse/mission-utils";
import Lotto from "./Lotto.js";

class App {
  async run() {}

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
}

export default App;
