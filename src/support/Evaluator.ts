
import { Operation } from "../constant/Operation";
import { DivisionByZeroError } from "../error/DivisionByZeroError";

/********************************************************************************************************************************** 関数ヘッダ・JSDoc
 * @file typesc / calculator
 * @date　2025/05/24
 * @param PRE_NUMBER　   演算子を押した後の、前の数値
 * @param op           算子（+, -, *, /）
 * @param CURRENT_NUMBER 現在の入力（数字）
 * @return 戻り値 どういった戻り値なのか
 * @detail 選択された演算子に応じたswitch処理の関数
 *************************************************************************************************************************************************/
export class Evaluator {
    public operatorSwitch(PRE_NUMBER: number, operator: Operation, CURRENT_NUMBER: number): number {

        switch (operator) {
            case Operation.Add:
                return PRE_NUMBER + CURRENT_NUMBER;
            case Operation.Subtract:
                return PRE_NUMBER - CURRENT_NUMBER;
            case Operation.Multiply:
                return PRE_NUMBER * CURRENT_NUMBER;
            case Operation.Divide:
                if (CURRENT_NUMBER === 0) {
                    throw new DivisionByZeroError("Divide by zero");
                } else {
                    return PRE_NUMBER / CURRENT_NUMBER;
                }
        }
    }
}