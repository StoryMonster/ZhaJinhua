

export default interface PlayerActions{
    dispatchCards(cards: number[]);  // 往自己手中摸牌
    showCards();     // 明牌
    hideCards();     // 把牌扣起来
    clearCards();    // 清牌
    getHandCards();  // 获取手牌
}