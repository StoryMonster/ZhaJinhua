

export default class CardsHeap
{
    private unusedCards: number[] = [];
    private usedCards: number[] = [];
    private inUsingCards: number[] = [];
    private cardsAmount: number = 52;

    constructor()
    {
        for (let i: number = 0; i < this.cardsAmount; ++i)
        {
            this.unusedCards.push(i);
        }
    }

    private setAllCardsUnused()
    {
        this.unusedCards = this.unusedCards.concat(this.usedCards, this.inUsingCards);
        this.usedCards = [];
        this.inUsingCards = [];
    }

    washCards()
    {
        this.setAllCardsUnused();
        let lastUncheckdCardIndex: number = this.cardsAmount - 1;
        while (lastUncheckdCardIndex != 1)
        {
            let index: number = Math.floor(Math.random() * (lastUncheckdCardIndex + 1));
            let temp: number = this.unusedCards[index];
            this.unusedCards[index] = this.unusedCards[lastUncheckdCardIndex];
            this.unusedCards[lastUncheckdCardIndex] = temp;
            --lastUncheckdCardIndex;
        }
    }

    getCard()
    {
        let card: number = this.unusedCards.pop();
        this.inUsingCards.push(card);
        return card;
    }

    throwCard(card: number)
    {
        let idx:number = this.inUsingCards.indexOf(card);
        if (idx >= 0)
        {
            this.inUsingCards.splice(idx, 1);
            this.usedCards.push(card);
        }
    }
}
