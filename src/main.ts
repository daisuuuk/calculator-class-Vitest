
import { Calculator } from "./calculator/Calculator";
import { RenderDisplay } from "./display/DomDisplay";
import { KeyMapper } from "./input/KeyMapper";


const display = new RenderDisplay();
const calculator = new Calculator(display);
const mapper = new KeyMapper();

const ALL_BUTTONS = document.querySelectorAll("button");

/**
 * 各ボタンが押された時の条件分岐のイベントリスナー(forEachで)
 */
ALL_BUTTONS.forEach((button) => {
    button.addEventListener("click", e => {
        try {
            const token = mapper.resolve(e.target as HTMLElement);
            if(!token) {
                throw new Error("無効なボタンが押下されました！")
            }
        
            calculator.handle(token);
        } catch(error) {
            calculator.handleError(error);
        }
    });
});