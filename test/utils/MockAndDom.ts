
import { vi } from "vitest";
import type { Mock } from "vitest";

import { Calculator } from "../../src/calculator/Calculator";
import { TOKEN_KIND } from "../../src/token/KeyToken";

export type MockDisplay = {                        
    render: Mock;
    renderError: Mock;
    displayHistoryOne: Mock;
    displayHistoryOperator: Mock;
    displayHistoryTwo: Mock;
};

export function setupTestDOM(): void {
    // テスト用に DOM を再構築
    document.body.innerHTML = `
        <div id="result"></div>
        <div id="history-one"></div>
        <div id="history-operator"></div>
        <div id="history-two"></div>
    `;
}

export function createDisplayMock(): MockDisplay {
    return {
        // モックの作成(RenderDisplayの偽物)
        // モック は Calculator のロジックだけをテスト（単体テスト）
        // `vi`という名前空間: 手動定義
        render: vi.fn(),
        renderError: vi.fn(),
        displayHistoryOne: vi.fn(),
        displayHistoryOperator: vi.fn(),
        displayHistoryTwo: vi.fn(),
    };
}

// なぜ： ヘルパー関数を要して、`Calculator.ts`の`private`に対応するため
export function inputDigit(calculator: Calculator, digit: number): void {
    calculator.handle({ kind: TOKEN_KIND.DIGIT, value: digit });
}
