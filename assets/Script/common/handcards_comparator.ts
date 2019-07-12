
import {HandCardsLevel} from "./handcards_level"
import getCardsLevel from "./handcards_level"
import sortNumberFromSmallerToBigger from "./utils"

export default class HandCardsComparator
{
    private compareLevel1(nums1: Array<number>, nums2: Array<number>): number
    {
        for (let i: number = 2; i >= 1; --i)
        {
            if (nums1[i] < nums2[i]) { return -1; }
            if (nums1[i] > nums2[i]) { return 1; }
        }
        return 0;
    }

    private compareLevel2(nums1: Array<number>, nums2: Array<number>): number
    {
        if (nums1[1] < nums2[1]) { return -1;}
        if (nums1[1] > nums2[1]) { return 1;}
        let diffNum1: number = (nums1[1] == nums1[0]) ? nums1[2] : nums1[0];
        let diffNum2: number = (nums2[1] == nums2[0]) ? nums2[2] : nums2[0];
        return diffNum1 - diffNum2;
    }

    private compareLevel3(nums1: Array<number>, nums2: Array<number>): number
    {
        return nums1[0] - nums2[0];
    }

    private compareLevel4(nums1: Array<number>, nums2: Array<number>): number
    {
        return this.compareLevel1(nums1, nums2);
    }

    private compareLevel5(nums1: Array<number>, nums2: Array<number>): number
    {
        return this.compareLevel3(nums1, nums2);
    }

    private compareLevel6(nums1: Array<number>, nums2: Array<number>): number
    {
        return this.compareLevel3(nums1, nums2);
    }

    compare(player1Cards: Array<number>, player2Cards: Array<number>) : number
    {
        let player1Nums: Array<number> = [player1Cards[0]%13, player1Cards[1]%13, player1Cards[2]%13].sort(sortNumberFromSmallerToBigger);
        let player2Nums: Array<number> = [player2Cards[0]%13, player2Cards[1]%13, player2Cards[2]%13].sort(sortNumberFromSmallerToBigger);
        let player1CardsLevel: number = getCardsLevel(player1Cards);
        let player2CardsLevel: number = getCardsLevel(player2Cards);
        if (player1CardsLevel > player2CardsLevel) { return 1; }
        if (player1CardsLevel < player2CardsLevel) { return -1; }
        switch (player1CardsLevel)
        {
            case HandCardsLevel.level6: return this.compareLevel6(player1Nums, player2Nums);
            case HandCardsLevel.level5: return this.compareLevel5(player1Nums, player2Nums);
            case HandCardsLevel.level4: return this.compareLevel4(player1Nums, player2Nums);
            case HandCardsLevel.level3: return this.compareLevel3(player1Nums, player2Nums);
            case HandCardsLevel.level2: return this.compareLevel2(player1Nums, player2Nums);
            case HandCardsLevel.level1: return this.compareLevel1(player1Nums, player2Nums);
        }
        return 0;
    }
}
