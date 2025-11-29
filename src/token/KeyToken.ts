
import { Operation } from "../constant/Operation";

// なぜ： メリット ①スペルミス防止 ②保守性 ③一貫性
export const TOKEN_KIND = {
    DIGIT: "digit",
    DECIMAL: "decimal",
    OP: "op",
    EQUAL: "equal",
    CLEAR: "clear",
} as const;

export type KeyToken =
    | { kind: typeof TOKEN_KIND.DIGIT; value: number }
    | { kind: typeof TOKEN_KIND.DECIMAL }
    | { kind: typeof TOKEN_KIND.OP; value: Operation }
    | { kind: typeof TOKEN_KIND.EQUAL }
    | { kind: typeof TOKEN_KIND.CLEAR };

// type / interface / namespace は const と違い同じ空間にいるイメージなので「型情報」と「関数呼び出し」が
// 同じ KeyToken で行える仕様みたいな
// export namespace KeyToken {
//     export const digit = (value: number): KeyToken => ({ kind: "digit", value });
//     export const decimal = (): KeyToken => ({ kind: "decimal" });
//     export const op = (value: Operation): KeyToken => ({ kind: "op", value });
//     export const equal = (): KeyToken => ({ kind: "equal" });
//     export const clear = (): KeyToken => ({ kind: "clear" });
// }