
export class DivisionByZeroError extends Error {
    constructor(message: string = "Division by zero") {
        // Errorクラスを継承する場合、superが必要。出ないとmassageが使用できない
        super(message);
        // Errorクラスのnameのデフォルトは"Error"なので、何のエラーか分かりづらいため
        this.name = "DivisionByZeroError";
    }
}