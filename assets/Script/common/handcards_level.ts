import sortNumberFromSmallerToBigger from "./utils"

export enum HandCardsLevel {
    level1=1,      // 散牌
    level2,        // 对子
    level3,        // 顺子
    level4,        // 金花
    level5,        // 顺金
    level6         // 豹子
}

export default function getCardsLevel(cards: Array<number>): HandCardsLevel
{
    let nums: number[] = [cards[0]%13, cards[1]%13, cards[2]%13].sort(sortNumberFromSmallerToBigger);
    let flowers: number[] = [Math.floor(cards[0]/13), Math.floor(cards[1]/13), Math.floor(cards[2]/13)];
    if (nums[0] == nums[2]) { return HandCardsLevel.level6; }
    if (flowers[0] == flowers[1] && flowers[1] == flowers[2])
    {
        return (nums[0]+2 == nums[2]) ? HandCardsLevel.level5 : HandCardsLevel.level4;
    }
    if (nums[0]+1== nums[1] && nums[1]+1 == nums[2]) { return HandCardsLevel.level3; }
    if (nums[1] == nums[0] || nums[1] == nums[2]) { return HandCardsLevel.level2; }
    return HandCardsLevel.level1;
}
