
enum CardDisplayStatus{
    showingFront,
    showingBack,
    empty
}

export default class CardPlaceHolder{
    private val: number = 0;
    private txt: string = "A";
    private flower: string = "club";
    private frontNode: cc.Node = null;
    private backNode: cc.Node = null;
    private displayStatus: CardDisplayStatus = CardDisplayStatus.empty;

    constructor(node: cc.Node)
    {
        this.frontNode = node.getChildByName("front");
        this.backNode = node.getChildByName("back");
        this.frontNode.active = false;
        this.backNode.active = false;
    }

    setCard(value: number)
    {
        this.val = value;
        // (0 -12 草花 2-A), (13-25 方块 2-A), (26-38 红心 2-A), (39-51 黑桃 2-A)
        let txts: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        let flowers: string[] = ["club", "diamond", "heart", "spade"];
        this.flower = flowers[Math.floor(value/13)];
        this.txt = txts[value % 13];
        if (this.isShowingFront())
        {
            this.showBack();
            this.showFront();
        }
    }

    getCard(): number
    {
        return this.val;
    }

    showBack()
    {
        if (this.isShowingBack()) { return; }
        this.backNode.active = true;
        this.frontNode.active = false;
    }

    showFront()
    {
        if (this.isShowingFront()) { return; }
        this.backNode.active = false;
        this.frontNode.getChildByName("val").getComponentInChildren(cc.Label).string = this.txt;
        let flowers = ["club", "diamond", "heart", "spade"];
        let flowerNode = this.frontNode.getChildByName("flower");
        for (let flower of flowers)
        {
            flowerNode.getChildByName(flower).active = flower == this.flower;
        }
        this.frontNode.active = true;
    }

    isShowingFront()
    {
        return this.displayStatus == CardDisplayStatus.showingFront;
    }

    isShowingBack()
    {
        return this.displayStatus == CardDisplayStatus.showingBack;
    }

    clearCard()
    {
        this.frontNode.active = false;
        this.backNode.active = false;
        this.displayStatus == CardDisplayStatus.empty;
    }
}