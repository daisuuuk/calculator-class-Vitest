
import { describe, test, expect, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { Calculator } from "../../src/calculator/Calculator";
import { TOKEN_KIND } from "../../src/token/KeyToken";
import { Operation } from "../../src/constant/Operation";
import { setupTestDOM, createDisplayMock, inputDigit } from "../utils/MockAndDom";

describe("------------------------------DisplayHistory------------------------------", () => {
    let calculator: Calculator;
    let mockDisplay: {                        // Vitest: Mock 型にマッピング
        render: Mock;
        renderError: Mock;
        displayHistoryOne: Mock;
        displayHistoryOperator: Mock;
        displayHistoryTwo: Mock;
    };

    beforeEach(() => {
        // テスト用に DOM を再構築
        setupTestDOM();

        // モックの作成(RenderDisplayの偽物)
        // モック は Calculator のロジックだけをテスト（単体テスト）
        mockDisplay = createDisplayMock();

        // DOM を作成してから、インスタンス化する
        calculator = new Calculator(mockDisplay);
    });

    describe("--------------------handleDigit**数字入力**--------------------", () => {
        test("ケース: ディスプレイの履歴エリアに数字が履歴として反映されるか", () => {
            // calculator.handleDigit(1);
            inputDigit(calculator, 1);
            //「 toHaveBeenCalledWith() 」**モック関数が特定の引数で呼び出されたかどうかを検証するマッチャ** 種類、色々あり
            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith("1");
        });

        test("ケース: ディスプレイの履歴エリアに同じ数字を複数回押しても履歴として反映されるか", () => {
            inputDigit(calculator, 1);
            inputDigit(calculator, 1);
            inputDigit(calculator, 1);

            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith("111");
        });

        test("ケース: ディスプレイの履歴エリアに異なる数字を複数回押しても履歴として反映されるか", () => {
            inputDigit(calculator, 3);
            inputDigit(calculator, 7);
            inputDigit(calculator, 1);
            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith("371");
        });

        test("ケース: ディスプレイの履歴エリアに,計算結果表示後に数字を押下しても履歴として反映されるか", () => {
            inputDigit(calculator, 2);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            inputDigit(calculator, 3); 
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            inputDigit(calculator, 7);
            expect(mockDisplay.displayHistoryOne).toHaveBeenLastCalledWith('7');
        });

        test("ケース: ディスプレイの履歴エリアに「C」を選択し、その後の最初の計算で負の数を押下すると履歴として反映されるか", () => {
            inputDigit(calculator, 2);
            calculator.handle({ kind: TOKEN_KIND.CLEAR });
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Subtract });
            inputDigit(calculator, 7);

            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith('-7');
        });

        test("ケース: ディスプレイの履歴エリアに、0で割ったときに「エラー」と表示された後に、数字を押下しても履歴として反映されるか", () => {
            inputDigit(calculator, 5);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Divide });
            inputDigit(calculator, 0);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            inputDigit(calculator, 7);
            expect(mockDisplay.displayHistoryOne).toHaveBeenLastCalledWith('7');
        });

        test("ケース: ディスプレイの履歴エリアに、小数点(.)が履歴として反映されるか", () => {
            calculator.handle({ kind: TOKEN_KIND.DECIMAL });
            inputDigit(calculator, 2);
            expect(mockDisplay.displayHistoryOne).toHaveBeenLastCalledWith('0.2');
        });
    });


    describe("--------------------handleOperator**演算子入力**--------------------", () => {
        test("ケース: ディスプレイの履歴エリアに、演算子が連続で押下された時、最後に押下された演算子が履歴として反映されるか", () => {
            inputDigit(calculator, 7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Subtract });

            expect(mockDisplay.displayHistoryOperator).toHaveBeenLastCalledWith(Operation.Subtract);
        });

        test("ケース: ディスプレイの履歴エリアに、連続して異なる演算が行われた場合正しく履歴として反映されるか", () => {
            inputDigit(calculator, 7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Multiply });
            inputDigit(calculator, 7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });

            expect(mockDisplay.displayHistoryOperator).toHaveBeenLastCalledWith(Operation.Add);
        });

        test("ケース: ディスプレイの履歴エリアに、連続して同じ演算が行われた場合正しく履歴として反映されるか", () => {
            inputDigit(calculator, 7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            inputDigit(calculator, 7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            inputDigit(calculator, 7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });

            expect(mockDisplay.displayHistoryOperator).toHaveBeenLastCalledWith(Operation.Add);
        });
    });

    describe("--------------------handleEqual**計算実行**--------------------", () => {
        test("ケース: ディスプレイの履歴エリアに、通常計算「=」が正しく履歴として反映されるか", () => {
            inputDigit(calculator, 3);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            inputDigit(calculator, 2);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });
            expect(mockDisplay.displayHistoryOne).toHaveBeenLastCalledWith('5');
        });

        test("ケース: ディスプレイの履歴エリアに、連続して「=」が押下された時に正しく履歴として反映されるか", () => {
            inputDigit(calculator, 3);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            inputDigit(calculator, 2);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith('5');

            calculator.handle({ kind: TOKEN_KIND.EQUAL });
            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith('5');
            expect(mockDisplay.displayHistoryOperator).toHaveBeenCalledWith(Operation.Add);
            expect(mockDisplay.displayHistoryTwo).toHaveBeenCalledWith('2');
        });

        test("ケース: ディスプレイの履歴エリアに、入力された順番通りの演算子が履歴として反映されるか", () => {
            inputDigit(calculator, 2);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            inputDigit(calculator, 3);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Multiply });
            inputDigit(calculator, 4);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith('2');
            expect(mockDisplay.displayHistoryOperator).toHaveBeenCalledWith(Operation.Add);
            expect(mockDisplay.displayHistoryTwo).toHaveBeenCalledWith('3');
            expect(mockDisplay.displayHistoryOperator).toHaveBeenCalledWith(Operation.Multiply);
            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith('5');
            expect(mockDisplay.displayHistoryTwo).toHaveBeenCalledWith('4');
            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith('20');
        });

        test("ケース: ディスプレイの履歴エリアに、小数点が含まれる場合の処理を正しく履歴として反映されるか", () => {
            inputDigit(calculator, 9);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            inputDigit(calculator, 1);
            calculator.handle({ kind: TOKEN_KIND.DECIMAL });
            inputDigit(calculator, 5);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith('9');
            expect(mockDisplay.displayHistoryOperator).toHaveBeenCalledWith(Operation.Add);
            expect(mockDisplay.displayHistoryTwo).toHaveBeenCalledWith('1.5');
        });

        test("ケース: ディスプレイの履歴エリアに、計算結果が境界値であっても履歴として反映されるか", () => {
            inputDigit(calculator, 99999998);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            inputDigit(calculator, 1);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith('99999999');
        });

        test("ケース: ディスプレイの履歴エリアに、計算結果が境界値+1のときに期待結果通りに履歴としても反映されるか", () => {
            inputDigit(calculator, 99999999);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            inputDigit(calculator, 1);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith('1.0000000e+8');
        });

        test("ケース: ディスプレイの履歴エリアが、1つ目の数字と演算子だけで「=」を押下した時クリアされるか", () => {
            inputDigit(calculator, 7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith('');
            expect(mockDisplay.displayHistoryOperator).toHaveBeenCalledWith('');
            expect(mockDisplay.displayHistoryTwo).toHaveBeenCalledWith('');
        });
    });

    describe("--------------------handleError**エラー処理**--------------------", () => {
        test("ケース: ディスプレイの履歴エリアが、「0」で割った時にクリアされるか", () => {
            inputDigit(calculator, 7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Divide });
            inputDigit(calculator, 0);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith('');
            expect(mockDisplay.displayHistoryOperator).toHaveBeenCalledWith('');
            expect(mockDisplay.displayHistoryTwo).toHaveBeenCalledWith('');
        });
    });

    describe("--------------------handleCrear**クリア処理**--------------------", () => {
        test("ケース: ディスプレイの履歴エリアに、「C」を選択すると黒のディスプレイの履歴もクリアされるか", () => {
            inputDigit(calculator, 7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            inputDigit(calculator, 7);
            calculator.handle({ kind: TOKEN_KIND.CLEAR });

            expect(mockDisplay.displayHistoryOne).toHaveBeenCalledWith('');
            expect(mockDisplay.displayHistoryOperator).toHaveBeenCalledWith('');
            expect(mockDisplay.displayHistoryTwo).toHaveBeenCalledWith('');
        });
    });
});