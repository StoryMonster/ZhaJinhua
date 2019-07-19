import CardPlaceHolder from "../common/card_placeholder";
import PlayerActions from "../common/player_actions";
import {HandCardsLevel} from "../common/handcards_level";
import getCardsLevel from "../common/handcards_level";
import WinRateCalculator from "../common/win_rate_calculator";

export default class Player implements PlayerActions{
    private cardPlaceholders: CardPlaceHolder[] = [];
    private cardPlaceholderNum: number = 3;
    private node: cc.Node = null;
    private resultPossibilityNode: cc.Node = null;
    private cardPatternNode: cc.Node = null;

    constructor (node: cc.Node) {
        this.node = node;
        this.cardPlaceholders.push(new CardPlaceHolder(node.getChildByName("card1")));
        this.cardPlaceholders.push(new CardPlaceHolder(node.getChildByName("card2")));
        this.cardPlaceholders.push(new CardPlaceHolder(node.getChildByName("card3")));
        this.resultPossibilityNode = this.node.getChildByName("result_possibility");
        this.cardPatternNode = this.node.getChildByName("card_pattern");
        this.hideResultPossibliityNode();
    }

    hideCards()
    {
        for (let i: number = 0; i < this.cardPlaceholderNum; ++i)
        {
            this.cardPlaceholders[i].showBack();
        }
        this.hideResultPossibliityNode();
        
    }

    showCards()
    {
        for (let i: number = 0; i < this.cardPlaceholderNum; ++i)
        {
            this.cardPlaceholders[i].showFront();
        }
        this.showHandcardsPattern();
        this.showResultPossibliityNode();
    }

    dispatchCards(cards: number[])
    {
        for (let i: number = 0; i < this.cardPlaceholderNum; ++i)
        {
            this.cardPlaceholders[i].setCard(cards[i]);
        }
    }

    showHandcardsPattern()
    {
        let level: HandCardsLevel = getCardsLevel([this.cardPlaceholders[0].getCard(), this.cardPlaceholders[1].getCard(), this.cardPlaceholders[2].getCard()]);
        let labelString: string = "";
        switch (level)
        {
            case HandCardsLevel.level1: labelString = "散牌"; break;
            case HandCardsLevel.level2: labelString = "对子"; break;
            case HandCardsLevel.level3: labelString = "顺子"; break;
            case HandCardsLevel.level4: labelString = "金花"; break;
            case HandCardsLevel.level5: labelString = "顺金"; break;
            case HandCardsLevel.level6: labelString = "豹子"; break;
        }
        this.cardPatternNode.getComponent(cc.Label).string= labelString;
        this.cardPatternNode.active = true;
    }

    hideHandcardsPattern()
    {
        this.cardPatternNode.active = false;
    }

    clearCards()
    {
        for (let i: number = 0; i < this.cardPlaceholderNum; ++i)
        {
            this.cardPlaceholders[i].clearCard();
        }
        this.hideHandcardsPattern();
        this.hideResultPossibliityNode();
    }

    getHandCards()
    {
        return [this.cardPlaceholders[0].getCard(), this.cardPlaceholders[1].getCard(), this.cardPlaceholders[2].getCard()];
    }

    showResultPossibliityNode()
    {
        let rateCalculator: WinRateCalculator = new WinRateCalculator();
        rateCalculator.setHandcards(this.getHandCards());
        rateCalculator.calculate();
        let winRate: number = rateCalculator.getWinRate() * 100;
        let drawRate: number = rateCalculator.getDrawRate() * 100;
        let failRate: number = rateCalculator.getFailRate() * 100;
        this.resultPossibilityNode.getComponent(cc.Label).string = `胜: ${winRate.toFixed(2)}\%  平: ${drawRate.toFixed(2)}\%  负: ${failRate.toFixed(2)}\%`;
        this.resultPossibilityNode.active = true;
    }

    hideResultPossibliityNode()
    {
        this.resultPossibilityNode.active = false;
    }
}
