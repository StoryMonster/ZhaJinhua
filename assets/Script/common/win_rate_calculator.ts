
import {HandCardsLevel} from "./handcards_level"
import getCardsLevel from "./handcards_level"
import sortNumberFromSmallerToBigger from "./utils"

function C(bottom: number, top: number): number
{
    if (bottom < top) {
        console.log("bottom smaller than top");
        return 0;
    }
    if (top > bottom - top) { top = bottom - top; }
    let base: number = 1;
    let div: number = 1;
    for (; top >= 1; --top)
    {
        base *= (bottom-top+1);
        div *= top;
    }
    return base/div;
}

export default class WinRateCalculator
{
    private winRate: number = 0.0;
    private drawRate: number = 1.0;
    private failRate: number = 0.0;
    private playerCards: number[] = [];
    private unknownCards: number[] = [];
    private unknownCardsNum: number = 52;
    private level6PatternAmount: number = C(13, 1) * C(4, 3);
    private level5PatternAmount: number = C(4, 1) * C(11, 1);
    private level4PatternAmount: number = C(13, 3) * C(4, 1) - this.level5PatternAmount;
    private level3PatternAmount: number = C(11, 1) * C(4, 1) * C(4, 1) * C(4, 1) - this.level5PatternAmount;
    private level2PatternAmount: number = C(13, 1) * C(4, 2) * C(12, 1) * C(4, 1);
    private level1PatternAmount: number = C(52, 3) - this.level6PatternAmount - this.level5PatternAmount - this.level4PatternAmount - this.level3PatternAmount - this.level2PatternAmount;

    constructor()
    {
        for (let i: number = 0; i < 52; ++i)
        {
            this.unknownCards.push(1);
        }
    }

    setHandcards(playerCards: number[])
    {
        this.playerCards = playerCards;
        this.knowCards(playerCards);
    }

    knowCard(card: number)
    {
        this.level6PatternAmount -= this.getLevel6PatternReduceAmount(card);
        this.level5PatternAmount -= this.getLevel5PatternReduceAmount(card);
        this.level4PatternAmount -= this.getLevel4PatternReduceAmount(card);
        this.level3PatternAmount -= this.getLevel3PatternReduceAmount(card);
        this.level2PatternAmount -= this.getLevel2PatternReduceAmount(card);
        this.level1PatternAmount = C(this.unknownCardsNum-1, 3) - this.level6PatternAmount - this.level5PatternAmount - this.level4PatternAmount - this.level3PatternAmount - this.level2PatternAmount;
        this.unknownCards[card] = 0;
        --this.unknownCardsNum;
    }

    private getLevel6PatternReduceAmount(card: number) : number
    {
        let val: number = card % 13;
        let sameValCardsAmount = this.unknownCards[val] + this.unknownCards[val+13] + this.unknownCards[val+26] + this.unknownCards[val+39];
        if (sameValCardsAmount == 4) { return 3; }
        if (sameValCardsAmount == 3) { return 1; }
        return 0;
    }

    private getLevel5PatternReduceAmount(card: number) : number
    {
        let res: number = 0;
        let val: number = card % 13;
        if (val == 0)
        {
            if (this.unknownCards[card+1] == 1 && this.unknownCards[card+2] == 1) { ++res; }
        }
        else if (val == 12)
        {
            if (this.unknownCards[card-1] == 1 && this.unknownCards[card-2] == 1) { ++res; }
        }
        else
        {
            if (this.unknownCards[card+1] == 1 && this.unknownCards[card+2] == 1) { ++res; }
            if (this.unknownCards[card-1] == 1 && this.unknownCards[card-2] == 1) { ++res; }
            if (this.unknownCards[card-1] == 1 && this.unknownCards[card+1] == 1) { ++res; }
        }
        return res;
    }

    private getLevel4PatternReduceAmount(card: number) : number
    {
        let flower: number = Math.floor(card/13);
        let sameFlowerCardAmount: number = 0;
        let startIndex: number = flower * 13;
        let endIndex: number = startIndex + 13;
        for (let i: number = startIndex; i < endIndex; ++i)
        {
            sameFlowerCardAmount += this.unknownCards[i];
        }
        if (sameFlowerCardAmount < 3) { return 0; }
        let reducedLevel5PatternNum = this.getLevel5PatternReduceAmount(card);
        return C(sameFlowerCardAmount-1, 2) - reducedLevel5PatternNum;
    }

    private getLevel3PatternReduceAmount(card: number) : number
    {
        let res: number = 0;
        let val: number = card % 13;
        if (val == 0)
        {
            let val1Amount: number = this.unknownCards[val+1] + this.unknownCards[val+14] + this.unknownCards[val+27] + this.unknownCards[val+40];
            let val2Amount: number = this.unknownCards[val+2] + this.unknownCards[val+15] + this.unknownCards[val+28] + this.unknownCards[val+41];
            res = C(val1Amount, 1) * C(val2Amount, 1);
        }
        else if (val == 12)
        {
            let val11Amount: number = this.unknownCards[val-1] + this.unknownCards[val+12] + this.unknownCards[val+26] + this.unknownCards[val+38];
            let val10Amount: number = this.unknownCards[val-2] + this.unknownCards[val+11] + this.unknownCards[val+25] + this.unknownCards[val+37];
            res = C(val10Amount, 1) * C(val11Amount, 1);
        }
        else
        {
            let valMinus1Amount: number = this.unknownCards[val-1] + this.unknownCards[val+12] + this.unknownCards[val+26] + this.unknownCards[val+38];
            let valMinus2Amount: number = this.unknownCards[val-2] + this.unknownCards[val+11] + this.unknownCards[val+25] + this.unknownCards[val+37];
            let valAdd1Amount: number = this.unknownCards[val+1] + this.unknownCards[val+14] + this.unknownCards[val+27] + this.unknownCards[val+40];
            let valAdd2Amount: number = this.unknownCards[val+2] + this.unknownCards[val+15] + this.unknownCards[val+28] + this.unknownCards[val+41];
            res = C(valMinus1Amount, 1) * C(valMinus2Amount, 1) + C(valAdd1Amount, 1) * C(valAdd2Amount, 1) + C(valAdd1Amount, 1) * C(valMinus1Amount, 1);
        }
        return res - this.getLevel5PatternReduceAmount(card);
    }

    private getLevel2PatternReduceAmount(card: number) : number
    {
        let res: number = 0;
        // card在对子中
        let val: number = card % 13;
        let sameValCardAmount: number = this.unknownCards[val] + this.unknownCards[val+13] + this.unknownCards[val+26] + this.unknownCards[val+39];
        let otherValCardAmount: number = this.unknownCardsNum - sameValCardAmount;
        if (sameValCardAmount >= 2)
        {
            res += C(sameValCardAmount-1, 1) * C(otherValCardAmount, 1);
        }
        // card属于第三张
        for (let i: number = 0; i < 13; ++i)
        {
            if (i == val) { continue; }
            let sameValCardAmount: number = this.unknownCards[i] + this.unknownCards[i+13] + this.unknownCards[i+26] + this.unknownCards[i+39];
            res += C(sameValCardAmount, 2);
        }
        return res;
    }

    knowCards(cards: number[])
    {
        for (let card of cards)
        {
            this.knowCard(card);
        }
    }

    calculate()
    {
        
        let level: HandCardsLevel = getCardsLevel(this.playerCards);
        switch (level)
        {
            case HandCardsLevel.level6: this.calculateMatchRateInLevel6(); break;
            case HandCardsLevel.level5: this.calculateMatchRateInLevel5(); break;
            case HandCardsLevel.level4: this.calculateMatchRateInLevel4(); break;
            case HandCardsLevel.level3: this.calculateMatchRateInLevel3(); break;
            case HandCardsLevel.level2: this.calculateMatchRateInLevel2(); break;
            case HandCardsLevel.level1: this.calculateMatchRateInLevel1(); break;
        }
    }

    private calculateMatchRateInLevel6()
    {
        let nums: number[] = [this.playerCards[0] % 13, this.playerCards[1] % 13, this.playerCards[2] % 13];
        let biggerCombinationAmount = 0;
        for (let i: number = nums[0]+1; i <= 12; ++i)
        {
            let sameValCardsAmount = this.unknownCards[i] + this.unknownCards[i+13] + this.unknownCards[i+26] + this.unknownCards[i+39];
            if (sameValCardsAmount >= 3) { ++biggerCombinationAmount; }
        }
        let base: number = C(this.unknownCardsNum, 3);
        this.winRate = (base - biggerCombinationAmount)/base;
        this.failRate = 1 - this.winRate;
        this.drawRate = 0;
    }

    private calculateMatchRateInLevel5()
    {
        let nums: number[] = [this.playerCards[0] % 13, this.playerCards[1] % 13, this.playerCards[2] % 13].sort(sortNumberFromSmallerToBigger);
        let biggerCombinationAmount = 0;
        let similiarCombinationAmount = 0;
        let base: number = C(this.unknownCardsNum, 3);
        // 相同概率
        let minVal: number = nums[0];
        for (let i: number = 0; i < 4; ++i)
        {
            similiarCombinationAmount += (this.unknownCards[minVal + i*13] + this.unknownCards[minVal + i*13 + 1] + this.unknownCards[minVal + i*13 + 2]) == 3 ? 1 : 0;
        }
        this.drawRate = similiarCombinationAmount / base;
        // 更大概率
        for (let val: number = minVal + 1; val <= 10; ++val)
        {
            for (let i: number = 0; i < 4; ++i)
            {
                biggerCombinationAmount += (this.unknownCards[val + i*13] + this.unknownCards[val + i*13 + 1] + this.unknownCards[val + i*13 + 2]) == 3 ? 1 : 0;
            }
        }
        this.winRate = (base - this.level6PatternAmount - biggerCombinationAmount - similiarCombinationAmount)/base;
        this.failRate = 1 - this.winRate - this.drawRate;
    }

    private calculateMatchRateInLevel4()
    {
        let nums: number[] = [this.playerCards[0] % 13, this.playerCards[1] % 13, this.playerCards[2] % 13].sort(sortNumberFromSmallerToBigger);
        let biggerCombinationAmount: number = 0;
        // 比最大牌大
        let maxVal: number = nums[2];
        for (let flower: number = 0; flower < 4; ++flower)
        {
            let biggerThanMaxValAmount: number = 0;
            let sameFlowerCardsInAll: number = 0;
            for (let i: number = 0; i <= 12; ++i)
            {
                let card: number = i + 13*flower;
                if(this.unknownCards[card] == 1)
                {
                    if (i > maxVal) { ++biggerThanMaxValAmount; }
                    ++sameFlowerCardsInAll;
                }
            }
            biggerCombinationAmount += (C(biggerThanMaxValAmount, 1)*C(sameFlowerCardsInAll-biggerThanMaxValAmount, 2)
                                       +C(biggerThanMaxValAmount, 2)*C(sameFlowerCardsInAll-biggerThanMaxValAmount, 1)
                                        +C(biggerThanMaxValAmount, 3));
            for (let i: number = nums[2]; i <= 10; ++i)
            {
                if (this.unknownCards[i + flower*13] == 1 &&  this.unknownCards[i + flower*13 + 1] == 1 && this.unknownCards[i + flower*13 + 2] == 1)
                {
                        --biggerCombinationAmount;
                }
            }
            
        }
        // 比第二张牌大
        let secMaxVal: number = nums[1];
        for (let flower: number = 0; flower < 4; ++flower)
        {
            if (this.unknownCards[nums[2] + flower*13] == 0) {continue;}
            let biggerThanSecValAmount: number = 0;
            let sameFlowerCardsInAll: number = 0;
            for (let i: number = 0; i < nums[2]; ++i)
            {
                let card: number = i + 13*flower;
                if(this.unknownCards[card] == 1)
                {
                    if (i > secMaxVal) { ++biggerThanSecValAmount; }
                    ++sameFlowerCardsInAll;
                }
            }
            biggerCombinationAmount += (C(biggerThanSecValAmount, 1)*C(sameFlowerCardsInAll-biggerThanSecValAmount, 1) + C(biggerThanSecValAmount, 2));
        }
        // 比第三张牌大
        let minVal: number = nums[0];
        for (let flower: number = 0; flower < 4; ++flower)
        {
            if (this.unknownCards[nums[2] + flower*13] == 0 || this.unknownCards[nums[1] + flower*13] == 0) {continue;}
            let biggerThanMinValAmount: number = 0;
            for (let i: number = minVal+1; i < nums[1]; ++i)
            {
                let card: number = i + 13*flower;
                if(this.unknownCards[card] == 1) { ++biggerThanMinValAmount; }
            }
            biggerCombinationAmount += C(biggerThanMinValAmount, 1);
        }
        // 减去顺金情况
        for (let flower: number = 0; flower < 4; ++flower)
        {
            for (let i: number = nums[2]; i <= 12; ++i)
            {
                if (this.unknownCards[i + flower*13] == 1 &&  this.unknownCards[i + flower*13 - 1] == 1 && this.unknownCards[i + flower*13 - 2] == 1)
                {
                    --biggerCombinationAmount;
                }
            }
        }
        // 牌面值相同
        let similarCombinationAmount: number = 0;
        for (let flower: number = 0; flower < 4; ++flower)
        {
            if (this.unknownCards[nums[2] + flower*13] == 1 && 
                this.unknownCards[nums[1] + flower*13] == 1 &&
                this.unknownCards[nums[0] + flower*13] == 1)
            { ++similarCombinationAmount; }
        }

        let base: number = C(this.unknownCardsNum, 3);
        this.winRate = (base - this.level6PatternAmount - this.level5PatternAmount - biggerCombinationAmount) / base;
        this.drawRate = similarCombinationAmount / base;
        this.failRate = 1 - this.winRate - this.drawRate;
        
    }

    private calculateMatchRateInLevel3()
    {
        let nums: number[] = [this.playerCards[0] % 13, this.playerCards[1] % 13, this.playerCards[2] % 13].sort(sortNumberFromSmallerToBigger);
        // 更大的顺子
        let biggerCombinationAmount: number = 0;
        for (let val = nums[0]+1; val <= 10; ++val)
        {
            let flowers: number[] = [0, 0, 0, 0];
            let vals: number[] = [0, 0, 0];
            for (let flower: number = 0; flower < 4; ++flower)
            {
                flowers[flower] = this.unknownCards[val + flower*13] + this.unknownCards[val + 1 + flower*13] + this.unknownCards[val + 2 + flower*13];
                if (this.unknownCards[val + flower*13] == 1) { ++vals[0]; }
                if (this.unknownCards[val + flower*13 + 1] == 1) { ++vals[1]; }
                if (this.unknownCards[val + flower*13 + 2] == 1) { ++vals[2]; }
            }
            for (let flowersAmount of flowers)
            {
                // 减去可能的顺金情况
                if (flowersAmount == 3) { --biggerCombinationAmount; }
            }
            if (vals[0] == 0 || vals[1] == 0 || vals[2] == 0) { continue; }
            biggerCombinationAmount += (vals[0] * vals[1] * vals[2])
        }
        // 同样大的顺子
        let similarCombinationAmount: number = 0;
        {
            let flowers: number[] = [0, 0, 0, 0];
            let vals: number[] = [0, 0, 0];
            for (let flower: number = 0; flower < 4; ++flower)
            {
                flowers[flower] = this.unknownCards[nums[0] + flower*13] + this.unknownCards[nums[1] + flower*13] + this.unknownCards[nums[2] + flower*13];
                if (this.unknownCards[nums[0] + flower*13] == 1) { ++vals[0]; }
                if (this.unknownCards[nums[1] + flower*13] == 1) { ++vals[1]; }
                if (this.unknownCards[nums[2] + flower*13] == 1) { ++vals[2]; }
            }
            for (let flowersAmount of flowers)
            {
                // 减去可能的顺金情况
                if (flowersAmount == 3) { --similarCombinationAmount; }
            }
            if (vals[0] != 0 && vals[1] != 0 && vals[2] != 0)
            {
                similarCombinationAmount += (vals[0] * vals[1] * vals[2])
            }
        }
        let base: number = C(this.unknownCardsNum, 3);
        this.winRate = (base - this.level6PatternAmount - this.level5PatternAmount - this.level4PatternAmount - biggerCombinationAmount - similarCombinationAmount)/base;
        this.drawRate = similarCombinationAmount/base;
        this.failRate = 1 - this.winRate - this.drawRate;
    }

    private calculateMatchRateInLevel2()
    {
        let nums: number[] = [this.playerCards[0] % 13, this.playerCards[1] % 13, this.playerCards[2] % 13].sort(sortNumberFromSmallerToBigger);
        let doubleCardVal: number = nums[1];
        let singleCardVal: number = nums[0] == nums[1] ? nums[2] : nums[0];
        let biggerCombinationAmount: number = 0;
        // 对子比较大
        for (let num: number = doubleCardVal+1; num <= 12; ++num)
        {
            let sameValCardAmount: number = this.unknownCards[num] + this.unknownCards[num + 13] + this.unknownCards[num+26] + this.unknownCards[num+39];
            switch (sameValCardAmount)
            {
                case 4: biggerCombinationAmount += (C(4, 2) * (this.unknownCardsNum-4)); break;
                case 3: biggerCombinationAmount += (C(3, 2) * (this.unknownCardsNum-3)); break;
                case 2: biggerCombinationAmount += this.unknownCardsNum-2; break;
            }
        }
        // 单牌比较大
        for (let num: number = singleCardVal+1; num <= 12; ++num)
        {
            if (num == doubleCardVal) { continue; }
            biggerCombinationAmount += (this.unknownCards[num] + this.unknownCards[num + 13] + this.unknownCards[num+26] + this.unknownCards[num+39]);
        }
        // 一样大
        let similarCombinationAmount: number = 0;
        if (this.unknownCards[doubleCardVal] + this.unknownCards[doubleCardVal + 13] + this.unknownCards[doubleCardVal+26] + this.unknownCards[doubleCardVal+39] == 2)
        {
            similarCombinationAmount += C(this.unknownCards[singleCardVal] + this.unknownCards[singleCardVal + 13] + this.unknownCards[singleCardVal+26] + this.unknownCards[singleCardVal+39], 1);
        }
        let base: number = C(this.unknownCardsNum, 3);
        this.winRate = (base - this.level6PatternAmount - this.level5PatternAmount - this.level4PatternAmount - this.level3PatternAmount - biggerCombinationAmount - similarCombinationAmount)/base;
        this.drawRate = similarCombinationAmount/base;
        this.failRate = 1 - this.winRate - this.drawRate;
    }

    private calculateMatchRateInLevel1()
    {
        let nums: number[] = [this.playerCards[0] % 13, this.playerCards[1] % 13, this.playerCards[2] % 13].sort(sortNumberFromSmallerToBigger);
        let base: number = C(this.unknownCardsNum, 3);
        let val0: number = this.unknownCards[nums[0]] + this.unknownCards[nums[0] + 13] + this.unknownCards[nums[0] + 26] + this.unknownCards[nums[0] + 39];
        let val1: number = this.unknownCards[nums[1]] + this.unknownCards[nums[1] + 13] + this.unknownCards[nums[1] + 26] + this.unknownCards[nums[1] + 39];
        let val2: number = this.unknownCards[nums[2]] + this.unknownCards[nums[2] + 13] + this.unknownCards[nums[2] + 26] + this.unknownCards[nums[2] + 39];
        let similarCombinationAmount: number = val0 * val1 * val2;
        if (nums[2] == 3)
        {
            this.winRate = 0;
            this.drawRate = similarCombinationAmount / base;
            this.failRate = 1 - this.winRate - this.drawRate;
            return ;
        }
        this.winRate = this.level1PatternAmount / base;         // TODO: 重新计算散排胜率
        this.drawRate = similarCombinationAmount / base;
        this.failRate = 1 - this.winRate - this.drawRate;
        console.log(`base= ${base}`);
    }

    getWinRate() { return this.winRate; }
    getDrawRate() { return this.drawRate; }
    getFailRate() { return this.failRate; }
}
