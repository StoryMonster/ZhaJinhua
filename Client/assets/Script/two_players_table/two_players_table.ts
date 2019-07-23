// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import CardPlaceHolder from "../common/card_placeholder"
import CardsHeap from "../common/cards_heap"
import HandCardsComparator from "../common/handcards_comparator"
import Player from "./player"
import Ai from "./ai"

const {ccclass, property} = cc._decorator;

enum GameResult {playerWin, draw, aiWin}

@ccclass
export default class TwoPlayersTable extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private cardsHeap: CardsHeap = null;
    private cardHealTopPlaceholder: CardPlaceHolder = null;
    private resulttip: cc.Node = null;
    private handcardsComparator: HandCardsComparator = null;
    private player: Player = null;
    private ai: Ai = null;

    start () {
        // initialize player
        this.player = new Player(this.node.getChildByName("player_area"));
        this.player.clearCards();
        // initialize ai
        this.ai = new Ai(this.node.getChildByName("ai_area"));
        this.ai.clearCards();
        // initial card heap
        this.cardsHeap = new CardsHeap();
        this.cardHealTopPlaceholder = new CardPlaceHolder(this.node.getChildByName("cardheap_top"));
        this.cardHealTopPlaceholder.showBack();

        // listen events
        this.node.getChildByName("givecard").on(cc.Node.EventType.TOUCH_END, this.onGiveCards, this);
        this.node.getChildByName("showcards").on(cc.Node.EventType.TOUCH_END, this.onShowCards, this);
    }

    onGiveCards(event: cc.Node.EventType)
    {
        this.hideGameResultTip();
        this.player.clearCards();
        this.ai.clearCards();
        this.cardsHeap.washCards();
        this.ai.dispatchCards([this.cardsHeap.getCard(), this.cardsHeap.getCard(), this.cardsHeap.getCard()]);
        this.player.dispatchCards([this.cardsHeap.getCard(), this.cardsHeap.getCard(), this.cardsHeap.getCard()]);
        this.ai.hideCards();
        this.player.showCards();
    }

    onShowCards(event: cc.Node.EventType)
    {
        this.ai.showCards();
        this.player.showCards();
        this.showGameResultTip(this.getGameResult());
    }

    getGameResult(): GameResult
    {
        if (this.handcardsComparator == null)
        {
            this.handcardsComparator = new HandCardsComparator();
        }
        let res: number = this.handcardsComparator.compare(this.player.getHandCards(), this.ai.getHandCards());
        if (res > 0) { return GameResult.playerWin; }
        if (res < 0) { return GameResult.aiWin; }
        return GameResult.draw;
    }

    showGameResultTip(gameResult: GameResult)
    {
        if (this.resulttip == null)
        {
            this.resulttip = new cc.Node();
            this.resulttip.addComponent(cc.Label);
            this.resulttip.setParent(this.node);
            this.resulttip.setScale(cc.v2(1, 1));
            this.resulttip.setAnchorPoint(cc.v2(0.5, 0.5));
            this.resulttip.getComponent(cc.Label).fontSize = 80;
            this.resulttip.getComponent(cc.Label).lineHeight = 80;
        }
        if (gameResult == GameResult.playerWin)
        {
            this.resulttip.getComponent(cc.Label).string = "You Win!";
            this.resulttip.color = cc.Color.GREEN;
        }
        else if (gameResult == GameResult.aiWin)
        {
            this.resulttip.getComponent(cc.Label).string = "You Fail!";
            this.resulttip.color = cc.Color.RED;
        }
        else
        {
            this.resulttip.getComponent(cc.Label).string = "DRAW!";
            this.resulttip.color = cc.Color.YELLOW;
        }
        this.resulttip.setPosition(0, 0);
        this.resulttip.active = true;
    }

    hideGameResultTip()
    {
        if (this.resulttip == null) { return; }
        this.resulttip.active = false;
    }
    // update (dt) {}
}
