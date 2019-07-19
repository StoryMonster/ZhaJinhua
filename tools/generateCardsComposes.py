import random

class CardCompose(object):
    def __init__(self, nums):
        self.cards = nums
        self.cards.sort()

    def __hash__(self):
        strCard0 = str(self.cards[0]) if self.cards[0] >= 10 else "0" + str(self.cards[0])
        strCard1 = str(self.cards[1]) if self.cards[1] >= 10 else "0" + str(self.cards[1])
        strCard2 = str(self.cards[2]) if self.cards[2] >= 10 else "0" + str(self.cards[2])
        return hash(strCard0 + strCard1 + strCard2)

    def __eq__(self, other):
        return self.cards[0] == other.cards[0] and self.cards[1] == other.cards[1] and self.cards[2] == other.cards[2]

cardComposes = set()
for i in range(300000):
    nums = [-1, -1, -1]
    for j in range(3):
        while True:
            temp = random.randint(0, 52)
            if temp not in nums:
                nums[j] = temp
                break
    cardComposes.add(CardCompose(nums))

code_part1 = """
export default class PossibleComposesContainer
{
    private length :number = %d;
    private composes: Array<Array<number>> = [
""" % len(cardComposes)

code_part2 = """
    ];

    getLength() :number
    {
        return this.length;
    }
    getComposes() :Array<Array<number>>
    {
        return this.composes;
    }
}
"""

with open("cardsComposes.ts", 'w') as fd:
    fd.write(code_part1)
    for cardCompose in cardComposes:
        fd.write("        [{}, {}, {}],\n".format(cardCompose.cards[0], cardCompose.cards[1], cardCompose.cards[2]))
    fd.write(code_part2)
