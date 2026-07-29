export const CURRENT_USER = {
  name: "Alex Rivera",
  username: "alex_rivera",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  rank: 14280,
  streakDays: 42,
  solvedEasy: 142,
  totalEasy: 820,
  solvedMedium: 210,
  totalMedium: 1640,
  solvedHard: 45,
  totalHard: 710
};

export const INITIAL_PROBLEMS = [
  {
    id: 1,
    title: "1. Two Sum",
    difficulty: "Easy",
    acceptance: "52.4%",
    status: "Solved",
    tags: ["Array", "Hash Table"],
    companyTags: ["Amazon", "Google", "Meta"],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      }
    ],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) {\n            return [map.get(diff), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n};`,
      python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            diff = target - num\n            if diff in seen:\n                return [seen[diff], i]\n            seen[num] = i\n        return []`
    }
  },
  {
    id: 2,
    title: "2. Add Two Numbers",
    difficulty: "Medium",
    acceptance: "43.1%",
    status: "Todo",
    tags: ["Linked List", "Math", "Recursion"],
    companyTags: ["Amazon", "Microsoft"],
    description: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.`,
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807."
      }
    ],
    starterCode: {
      javascript: `function addTwoNumbers(l1, l2) {\n    // Implementation here\n};`,
      python: `class Solution:\n    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\n        pass`
    }
  },
  {
    id: 3,
    title: "3. Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    acceptance: "34.8%",
    status: "Solved",
    tags: ["Hash Table", "String", "Sliding Window"],
    companyTags: ["Amazon", "Google"],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.'
      }
    ],
    starterCode: {
      javascript: `var lengthOfLongestSubstring = function(s) {\n    let set = new Set();\n    let left = 0, maxLen = 0;\n    for (let right = 0; right < s.length; right++) {\n        while (set.has(s[right])) {\n            set.delete(s[left]);\n            left++;\n        }\n        set.add(s[right]);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n};`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass`
    }
  },
  {
    id: 4,
    title: "4. Median of Two Sorted Arrays",
    difficulty: "Hard",
    acceptance: "39.2%",
    status: "Todo",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    companyTags: ["Amazon", "Google", "Apple"],
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be \`O(log (m+n))\`.`,
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2."
      }
    ],
    starterCode: {
      javascript: `var findMedianSortedArrays = function(nums1, nums2) {\n    // Implementation here\n};`,
      python: `class Solution:\n    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:\n        pass`
    }
  }
];
