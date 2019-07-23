
import HandCardsComparator from "./handcards_comparator"
import PossibleComposesContainer from "./possible_composes"

export default class WinRateCalculator
{
    private winRate: number = 0.0;
    private drawRate: number = 1.0;
    private failRate: number = 0.0;
    private playerCards: number[] = [];
    private unknownCards: number[] = [];
    private unknownCardsNum: number = 52;
    private knownCards: number[] = [];
    private composesContainer: PossibleComposesContainer = new PossibleComposesContainer;

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
        this.unknownCards[card] = 0;
        --this.unknownCardsNum;
        this.knownCards.push(card);
    }

    knowCards(cards: number[])
    {
        for (let card of cards)
        {
            this.knowCard(card);
        }
    }

    hasCardsConflict(compose1 :number[], compose2 :number[]) : boolean
    {
        for (let num1 of compose1)
        {
            for (let num2 of compose2)
            {
                if (num1 == num2) { return true; }
            }
        }
        return false;
    }

    calculate()
    {
        let comparedTimes :number = 0;
        let winTimes :number = 0;
        let failTimes :number = 0;
        let comparator :HandCardsComparator = new HandCardsComparator();
        let composes: Array<Array<number>> = this.composesContainer.getComposes();
        for (let compose of composes)
        {
            if (this.hasCardsConflict(compose, this.knownCards)) { continue; }
            let res :number = comparator.compare(this.playerCards, compose);
            ++comparedTimes;
            if (res > 0) { ++winTimes; }
            else if (res < 0) { ++failTimes; }
        }
        if (comparedTimes == 0) { return; }
        this.winRate = winTimes / comparedTimes;
        this.failRate = failTimes / comparedTimes;
        this.drawRate = 1 - this.winRate - this.failRate;
    }

    getWinRate() { return this.winRate; }
    getDrawRate() { return this.drawRate; }
    getFailRate() { return this.failRate; }
}
