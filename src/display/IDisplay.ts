
export interface IDisplay {
    render(text: string): void;
    renderError(message: string): void;

    displayHistoryOne(historyone: string): void;
    displayHistoryOperator(historyoperator: string): void;
    displayHistoryTwo(historytwo: string): void;
}