import CardPlaceHolder from "../common/card_placeholder";
import PlayerActions from "../common/player_actions";
import {HandCardsLevel} from "../common/handcards_level";
import getCardsLevel from "../common/handcards_level";

export default class Ai implements PlayerActions{
    private cardPlaceholders: CardPlaceHolder[] = [];
    private cardPlaceholderNum: number = 3;
    private node: cc.Node = null;
    private handcardsPatternNode: cc.Node = null;

    constructor (node: cc.Node) {
        this.node = node;
        this.cardPlaceholders.push(new CardPlaceHolder(node.getChildByName("card1")));
        this.cardPlaceholders.push(new CardPlaceHolder(node.getChildByName("card2")));
        this.cardPlaceholders.push(new CardPlaceHolder(node.getChildByName("card3")));
        this.handcardsPatternNode = this.node.getChildByName("card_pattern");
    }

    hideCards()
    {
        for (let i: number = 0; i < this.cardPlaceholderNum; ++i)
        {
            this.cardPlaceholders[i].showBack();
        }
        this.hideHandcardsPattern();
    }

    showCards()
    {
        for (let i: number = 0; i < this.cardPlaceholderNum; ++i)
        {
            this.cardPlaceholders[i].showFront();
        }
        this.showHandcardsPattern();
    }

    getHandCards()
    {
        return [this.cardPlaceholders[0].getCard(), this.cardPlaceholders[1].getCard(), this.cardPlaceholders[2].getCard()];
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
        this.handcardsPatternNode.getComponent(cc.Label).string = labelString;
        this.handcardsPatternNode.active = true;
    }

    hideHandcardsPattern()
    {
        this.handcardsPatternNode.active = false;
    }

    clearCards()
    {
        for (let i: number = 0; i < this.cardPlaceholderNum; ++i)
        {
            this.cardPlaceholders[i].clearCard();
        }
        this.hideHandcardsPattern();
    }
}
