export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  language: string;
  testCases: TestCase[];
  hint?: string;
  solution: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  exercises: Exercise[];
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  color: string;
  lessons: Lesson[];
}

const courses: Course[] = [
  {
    id: '6.0001',
    code: '6.0001',
    title: 'Introduction to Computer Science',
    description: 'Foundational programming concepts using Python. Covers variables, control flow, functions, and object-oriented programming.',
    difficulty: 'Beginner',
    language: 'python',
    color: '#4CAF50',
    lessons: [
      {
        id: '6.0001-1',
        title: 'Variables & Data Types',
        content: `# Variables & Data Types

In Python, variables store data. Unlike some languages, you don't need to declare a type — Python infers it automatically.

## Basic Types
- **int** — whole numbers: \`42\`, \`-7\`
- **float** — decimals: \`3.14\`, \`-0.5\`
- **str** — text: \`"hello"\`, \`'world'\`
- **bool** — \`True\` or \`False\`

## Assignment
\`\`\`python
name = "Alice"
age = 20
gpa = 3.85
is_student = True
\`\`\`

## Type Conversion
\`\`\`python
x = int("42")     # string → int
y = float(10)     # int → float
z = str(3.14)     # float → string
\`\`\`

## f-strings (formatted strings)
\`\`\`python
name = "Bob"
age = 21
print(f"My name is {name} and I am {age} years old.")
\`\`\``,
        exercises: [
          {
            id: '6.0001-1-1',
            title: 'Hello, MIT!',
            description: 'Create a variable called `name` set to your name, and a variable `course` set to "6.0001". Print: `Hello, I am [name] and I am taking [course].`',
            starterCode: `# Create your variables here
name =
course =

# Print the message
print(f"Hello, I am {name} and I am taking {course}.")`,
            language: 'python',
            hint: 'String values need to be wrapped in quotes: name = "Alice"',
            solution: `name = "Alice"
course = "6.0001"
print(f"Hello, I am {name} and I am taking {course}.")`,
            testCases: [
              {
                input: '',
                expectedOutput: 'Hello, I am',
                description: 'Output starts with "Hello, I am"',
              },
              {
                input: '',
                expectedOutput: 'and I am taking',
                description: 'Output contains "and I am taking"',
              },
            ],
          },
          {
            id: '6.0001-1-2',
            title: 'Type Conversion',
            description: 'Given the string `"42"`, convert it to an integer, multiply by 2, then print the result.',
            starterCode: `s = "42"

# Convert s to an integer and multiply by 2
result =

print(result)`,
            language: 'python',
            hint: 'Use int() to convert a string to an integer.',
            solution: `s = "42"
result = int(s) * 2
print(result)`,
            testCases: [
              {
                input: '',
                expectedOutput: '84',
                description: 'Prints 84',
              },
            ],
          },
          {
            id: '6.0001-1-3',
            title: 'Circle Area',
            description: 'Write a program that calculates the area of a circle with radius 7. Use `3.14159` for pi. Print the result rounded to 2 decimal places.',
            starterCode: `radius = 7
pi = 3.14159

# Calculate area
area =

print(round(area, 2))`,
            language: 'python',
            hint: 'Area of a circle = pi * radius * radius',
            solution: `radius = 7
pi = 3.14159
area = pi * radius * radius
print(round(area, 2))`,
            testCases: [
              {
                input: '',
                expectedOutput: '153.94',
                description: 'Prints 153.94',
              },
            ],
          },
        ],
      },
      {
        id: '6.0001-2',
        title: 'Control Flow',
        content: `# Control Flow

Control flow lets your program make decisions and repeat actions.

## if / elif / else
\`\`\`python
grade = 85

if grade >= 90:
    print("A")
elif grade >= 80:
    print("B")
elif grade >= 70:
    print("C")
else:
    print("F")
\`\`\`

## while loops
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

## for loops
\`\`\`python
for i in range(5):
    print(i)          # prints 0 1 2 3 4

for char in "hello":
    print(char)       # prints each letter
\`\`\`

## break and continue
\`\`\`python
for i in range(10):
    if i == 5:
        break         # stop the loop
    if i % 2 == 0:
        continue      # skip even numbers
    print(i)          # prints 1, 3
\`\`\``,
        exercises: [
          {
            id: '6.0001-2-1',
            title: 'FizzBuzz',
            description: 'Print numbers 1 through 20. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for multiples of both print "FizzBuzz".',
            starterCode: `for i in range(1, 21):
    # Your logic here
    pass`,
            language: 'python',
            hint: 'Check for multiples of both 3 and 5 first, before checking each individually.',
            solution: `for i in range(1, 21):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`,
            testCases: [
              { input: '', expectedOutput: 'Fizz', description: 'Contains Fizz' },
              { input: '', expectedOutput: 'Buzz', description: 'Contains Buzz' },
              { input: '', expectedOutput: 'FizzBuzz', description: 'Contains FizzBuzz' },
            ],
          },
          {
            id: '6.0001-2-2',
            title: 'Sum of Evens',
            description: 'Use a loop to compute the sum of all even numbers from 1 to 100 (inclusive). Print the result.',
            starterCode: `total = 0

for i in range(1, 101):
    # Add even numbers only
    pass

print(total)`,
            language: 'python',
            hint: 'A number is even if i % 2 == 0',
            solution: `total = 0
for i in range(1, 101):
    if i % 2 == 0:
        total += i
print(total)`,
            testCases: [
              { input: '', expectedOutput: '2550', description: 'Prints 2550' },
            ],
          },
          {
            id: '6.0001-2-3',
            title: 'Guess Counter',
            description: 'Count how many numbers in the list `[4, 7, 2, 9, 1, 5, 8, 3]` are greater than 5. Print the count.',
            starterCode: `numbers = [4, 7, 2, 9, 1, 5, 8, 3]
count = 0

# Count numbers greater than 5
for n in numbers:
    pass

print(count)`,
            language: 'python',
            hint: 'Use an if statement inside the for loop.',
            solution: `numbers = [4, 7, 2, 9, 1, 5, 8, 3]
count = 0
for n in numbers:
    if n > 5:
        count += 1
print(count)`,
            testCases: [
              { input: '', expectedOutput: '3', description: 'Prints 3' },
            ],
          },
        ],
      },
      {
        id: '6.0001-3',
        title: 'Functions',
        content: `# Functions

Functions let you package reusable logic with a name.

## Defining a Function
\`\`\`python
def greet(name):
    return f"Hello, {name}!"

message = greet("Alice")
print(message)   # Hello, Alice!
\`\`\`

## Default Parameters
\`\`\`python
def power(base, exponent=2):
    return base ** exponent

print(power(3))      # 9 (uses default exponent=2)
print(power(2, 10))  # 1024
\`\`\`

## Multiple Return Values
\`\`\`python
def min_max(lst):
    return min(lst), max(lst)

lo, hi = min_max([3, 1, 4, 1, 5, 9])
print(lo, hi)   # 1 9
\`\`\`

## Recursion
\`\`\`python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120
\`\`\``,
        exercises: [
          {
            id: '6.0001-3-1',
            title: 'Factorial',
            description: 'Write a function `factorial(n)` that returns n! (n factorial). Then print `factorial(6)`.',
            starterCode: `def factorial(n):
    # Base case: factorial of 0 is 1
    # Recursive case: n * factorial(n-1)
    pass

print(factorial(6))`,
            language: 'python',
            hint: 'factorial(0) = 1, factorial(n) = n * factorial(n-1)',
            solution: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(6))`,
            testCases: [
              { input: '', expectedOutput: '720', description: 'factorial(6) = 720' },
            ],
          },
          {
            id: '6.0001-3-2',
            title: 'Is Palindrome',
            description: 'Write a function `is_palindrome(s)` that returns `True` if the string is a palindrome, `False` otherwise. Test with "racecar" and "hello".',
            starterCode: `def is_palindrome(s):
    # A string is a palindrome if it reads the same forwards and backwards
    pass

print(is_palindrome("racecar"))
print(is_palindrome("hello"))`,
            language: 'python',
            hint: 'In Python you can reverse a string with s[::-1]',
            solution: `def is_palindrome(s):
    return s == s[::-1]

print(is_palindrome("racecar"))
print(is_palindrome("hello"))`,
            testCases: [
              { input: '', expectedOutput: 'True', description: '"racecar" is a palindrome' },
              { input: '', expectedOutput: 'False', description: '"hello" is not a palindrome' },
            ],
          },
          {
            id: '6.0001-3-3',
            title: 'Fibonacci',
            description: 'Write a function `fib(n)` that returns the nth Fibonacci number (0-indexed: fib(0)=0, fib(1)=1, fib(2)=1, fib(7)=13). Print fib(7).',
            starterCode: `def fib(n):
    # fib(0) = 0, fib(1) = 1
    # fib(n) = fib(n-1) + fib(n-2)
    pass

print(fib(7))`,
            language: 'python',
            hint: 'You need two base cases: n==0 and n==1',
            solution: `def fib(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    return fib(n - 1) + fib(n - 2)

print(fib(7))`,
            testCases: [
              { input: '', expectedOutput: '13', description: 'fib(7) = 13' },
            ],
          },
        ],
      },
      {
        id: '6.0001-4',
        title: 'Lists & Dictionaries',
        content: `# Lists & Dictionaries

## Lists
\`\`\`python
fruits = ["apple", "banana", "cherry"]
fruits.append("date")
fruits.remove("banana")
print(fruits[0])    # apple
print(fruits[-1])   # date
print(len(fruits))  # 3
\`\`\`

## List Slicing
\`\`\`python
nums = [0, 1, 2, 3, 4, 5]
print(nums[1:4])   # [1, 2, 3]
print(nums[:3])    # [0, 1, 2]
print(nums[3:])    # [3, 4, 5]
print(nums[::2])   # [0, 2, 4]
\`\`\`

## List Comprehensions
\`\`\`python
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
\`\`\`

## Dictionaries
\`\`\`python
student = {
    "name": "Alice",
    "grade": 92,
    "courses": ["6.0001", "6.042"]
}

print(student["name"])         # Alice
student["grade"] = 95          # update
student["year"] = 2             # add new key

for key, value in student.items():
    print(f"{key}: {value}")
\`\`\``,
        exercises: [
          {
            id: '6.0001-4-1',
            title: 'List Comprehension Squares',
            description: 'Use a list comprehension to create a list of squares of odd numbers from 1 to 19. Print the list.',
            starterCode: `# Create a list of squares of odd numbers 1-19 using a list comprehension
squares =

print(squares)`,
            language: 'python',
            hint: 'Combine a condition (x % 2 != 0) and expression (x**2) in the comprehension.',
            solution: `squares = [x**2 for x in range(1, 20) if x % 2 != 0]
print(squares)`,
            testCases: [
              { input: '', expectedOutput: '[1, 9, 25, 49, 81, 121, 169, 225, 289, 361]', description: 'Correct squares list' },
            ],
          },
          {
            id: '6.0001-4-2',
            title: 'Word Frequency',
            description: 'Count how many times each word appears in the sentence below. Print the dictionary.',
            starterCode: `sentence = "the quick brown fox jumps over the lazy dog the fox"
words = sentence.split()
freq = {}

for word in words:
    # Add word to freq dict or increment its count
    pass

print(freq)`,
            language: 'python',
            hint: 'Use freq.get(word, 0) to get current count with a default of 0.',
            solution: `sentence = "the quick brown fox jumps over the lazy dog the fox"
words = sentence.split()
freq = {}
for word in words:
    freq[word] = freq.get(word, 0) + 1
print(freq)`,
            testCases: [
              { input: '', expectedOutput: "'the': 3", description: '"the" appears 3 times' },
              { input: '', expectedOutput: "'fox': 2", description: '"fox" appears 2 times' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: '6.006',
    code: '6.006',
    title: 'Introduction to Algorithms',
    description: 'Design and analysis of efficient algorithms. Covers sorting, searching, graphs, and dynamic programming.',
    difficulty: 'Intermediate',
    language: 'python',
    color: '#2196F3',
    lessons: [
      {
        id: '6.006-1',
        title: 'Sorting Algorithms',
        content: `# Sorting Algorithms

Sorting is one of the most fundamental problems in computer science.

## Bubble Sort — O(n²)
Repeatedly swap adjacent elements that are out of order.
\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
\`\`\`

## Merge Sort — O(n log n)
Divide the array in half, sort each half, then merge.
\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]
\`\`\`

## Key Insight
- Bubble/Selection/Insertion Sort: **O(n²)** — fine for small arrays
- Merge/Heap/Quick Sort: **O(n log n)** — needed for large data`,
        exercises: [
          {
            id: '6.006-1-1',
            title: 'Insertion Sort',
            description: 'Implement insertion sort. For each element, insert it into its correct position in the already-sorted portion of the array. Print the sorted result of [5, 2, 8, 1, 9, 3].',
            starterCode: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        # Move elements greater than key one position forward
        while j >= 0 and arr[j] > key:
            pass  # shift arr[j] right and decrement j
        arr[j + 1] = key
    return arr

print(insertion_sort([5, 2, 8, 1, 9, 3]))`,
            language: 'python',
            hint: 'Inside the while loop: arr[j+1] = arr[j], then j -= 1',
            solution: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

print(insertion_sort([5, 2, 8, 1, 9, 3]))`,
            testCases: [
              { input: '', expectedOutput: '[1, 2, 3, 5, 8, 9]', description: 'Correctly sorted' },
            ],
          },
          {
            id: '6.006-1-2',
            title: 'Merge Two Sorted Arrays',
            description: 'Given two sorted arrays, merge them into one sorted array without using Python\'s built-in sort. Print the result.',
            starterCode: `def merge(left, right):
    result = []
    i = j = 0
    # Compare elements from both arrays and add smaller one
    while i < len(left) and j < len(right):
        pass  # your logic here
    # Append remaining elements
    result += left[i:]
    result += right[j:]
    return result

print(merge([1, 3, 5, 7], [2, 4, 6, 8]))`,
            language: 'python',
            hint: 'Compare left[i] and right[j], append the smaller one and advance its index.',
            solution: `def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result += left[i:]
    result += right[j:]
    return result

print(merge([1, 3, 5, 7], [2, 4, 6, 8]))`,
            testCases: [
              { input: '', expectedOutput: '[1, 2, 3, 4, 5, 6, 7, 8]', description: 'Merged sorted array' },
            ],
          },
          {
            id: '6.006-1-3',
            title: 'Count Inversions',
            description: 'An inversion is a pair (i, j) where i < j but arr[i] > arr[j]. Count the number of inversions in [3, 1, 2, 4, 5, 0].',
            starterCode: `def count_inversions(arr):
    count = 0
    n = len(arr)
    for i in range(n):
        for j in range(i + 1, n):
            # Check if (i, j) is an inversion
            pass
    return count

print(count_inversions([3, 1, 2, 4, 5, 0]))`,
            language: 'python',
            hint: 'An inversion: arr[i] > arr[j] when i < j. Increment count when you find one.',
            solution: `def count_inversions(arr):
    count = 0
    n = len(arr)
    for i in range(n):
        for j in range(i + 1, n):
            if arr[i] > arr[j]:
                count += 1
    return count

print(count_inversions([3, 1, 2, 4, 5, 0]))`,
            testCases: [
              { input: '', expectedOutput: '7', description: 'Correct inversion count' },
            ],
          },
        ],
      },
      {
        id: '6.006-2',
        title: 'Binary Search',
        content: `# Binary Search

Binary search finds a target in a **sorted** array in O(log n) time by repeatedly halving the search space.

## Algorithm
\`\`\`python
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid          # found!
        elif arr[mid] < target:
            low = mid + 1       # search right half
        else:
            high = mid - 1      # search left half
    return -1                   # not found
\`\`\`

## Why O(log n)?
Each step eliminates **half** the remaining elements. For n=1,000,000 it takes at most 20 steps.

| n | steps |
|---|-------|
| 8 | 3 |
| 1,024 | 10 |
| 1,048,576 | 20 |

## Variations
- Find **first** occurrence of a duplicate
- Find **last** occurrence
- Find **insertion point** for a missing value`,
        exercises: [
          {
            id: '6.006-2-1',
            title: 'Binary Search',
            description: 'Implement binary search. Return the index of the target or -1 if not found. Search for 7 in [1, 3, 5, 7, 9, 11, 13].',
            starterCode: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            pass  # search right
        else:
            pass  # search left
    return -1

print(binary_search([1, 3, 5, 7, 9, 11, 13], 7))
print(binary_search([1, 3, 5, 7, 9, 11, 13], 4))`,
            language: 'python',
            hint: 'When target > arr[mid], set low = mid + 1. When target < arr[mid], set high = mid - 1.',
            solution: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

print(binary_search([1, 3, 5, 7, 9, 11, 13], 7))
print(binary_search([1, 3, 5, 7, 9, 11, 13], 4))`,
            testCases: [
              { input: '', expectedOutput: '3', description: '7 is at index 3' },
              { input: '', expectedOutput: '-1', description: '4 is not in the array' },
            ],
          },
          {
            id: '6.006-2-2',
            title: 'Square Root via Binary Search',
            description: 'Use binary search to find the integer square root of n (largest integer k where k² ≤ n). Print isqrt(50).',
            starterCode: `def isqrt(n):
    low, high = 0, n
    result = 0
    while low <= high:
        mid = (low + high) // 2
        if mid * mid <= n:
            result = mid
            low = mid + 1
        else:
            pass  # mid is too large
    return result

print(isqrt(50))
print(isqrt(144))`,
            language: 'python',
            hint: 'When mid*mid > n, the answer is in the left half: high = mid - 1',
            solution: `def isqrt(n):
    low, high = 0, n
    result = 0
    while low <= high:
        mid = (low + high) // 2
        if mid * mid <= n:
            result = mid
            low = mid + 1
        else:
            high = mid - 1
    return result

print(isqrt(50))
print(isqrt(144))`,
            testCases: [
              { input: '', expectedOutput: '7', description: 'isqrt(50) = 7' },
              { input: '', expectedOutput: '12', description: 'isqrt(144) = 12' },
            ],
          },
        ],
      },
      {
        id: '6.006-3',
        title: 'Dynamic Programming',
        content: `# Dynamic Programming

Dynamic programming (DP) solves problems by breaking them into overlapping subproblems and caching results.

## Two approaches:
**Top-down (memoization):** Recursion + cache
\`\`\`python
memo = {}
def fib(n):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]
\`\`\`

**Bottom-up (tabulation):** Build table from smallest subproblems
\`\`\`python
def fib(n):
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
\`\`\`

## Classic DP Problems
- **Knapsack** — maximize value within weight limit
- **Longest Common Subsequence** — find shared sequence
- **Coin Change** — minimum coins to make amount
- **Edit Distance** — minimum edits to transform string`,
        exercises: [
          {
            id: '6.006-3-1',
            title: 'Coin Change',
            description: 'Given coins = [1, 5, 10, 25] and amount = 41, find the minimum number of coins needed to make that amount. Print the result.',
            starterCode: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # base case: 0 coins needed for amount 0
    for amt in range(1, amount + 1):
        for coin in coins:
            if coin <= amt:
                # Can we do better using this coin?
                pass
    return dp[amount] if dp[amount] != float('inf') else -1

print(coin_change([1, 5, 10, 25], 41))`,
            language: 'python',
            hint: 'dp[amt] = min(dp[amt], dp[amt - coin] + 1)',
            solution: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for amt in range(1, amount + 1):
        for coin in coins:
            if coin <= amt:
                dp[amt] = min(dp[amt], dp[amt - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

print(coin_change([1, 5, 10, 25], 41))`,
            testCases: [
              { input: '', expectedOutput: '4', description: '25+10+5+1 = 41 in 4 coins' },
            ],
          },
          {
            id: '6.006-3-2',
            title: 'Longest Increasing Subsequence',
            description: 'Find the length of the longest strictly increasing subsequence in [10, 9, 2, 5, 3, 7, 101, 18]. Print the length.',
            starterCode: `def lis(nums):
    n = len(nums)
    dp = [1] * n  # every element is a subsequence of length 1

    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                # nums[i] can extend the subsequence ending at j
                pass

    return max(dp)

print(lis([10, 9, 2, 5, 3, 7, 101, 18]))`,
            language: 'python',
            hint: 'dp[i] = max(dp[i], dp[j] + 1) when nums[j] < nums[i]',
            solution: `def lis(nums):
    n = len(nums)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

print(lis([10, 9, 2, 5, 3, 7, 101, 18]))`,
            testCases: [
              { input: '', expectedOutput: '4', description: 'LIS length is 4 (e.g., 2,3,7,101)' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: '6.042',
    code: '6.042',
    title: 'Mathematics for Computer Science',
    description: 'Mathematical foundations: logic, proofs, sets, number theory, combinatorics, and probability.',
    difficulty: 'Intermediate',
    language: 'python',
    color: '#FF9800',
    lessons: [
      {
        id: '6.042-1',
        title: 'Number Theory',
        content: `# Number Theory

Number theory is the study of integers and their properties. It underpins cryptography, hashing, and many algorithms.

## Greatest Common Divisor (GCD)
The GCD of two numbers is the largest number that divides both.

**Euclidean Algorithm:**
\`\`\`python
def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a
\`\`\`

## Least Common Multiple (LCM)
\`\`\`python
def lcm(a, b):
    return a * b // gcd(a, b)
\`\`\`

## Prime Numbers
A number is prime if divisible only by 1 and itself.
\`\`\`python
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True
\`\`\`

## Modular Arithmetic
\`\`\`python
# a ≡ b (mod m) means a and b have the same remainder when divided by m
print(17 % 5)    # 2
print(22 % 5)    # 2  → 17 ≡ 22 (mod 5)
\`\`\``,
        exercises: [
          {
            id: '6.042-1-1',
            title: 'GCD via Euclidean Algorithm',
            description: 'Implement the Euclidean algorithm for GCD. Print gcd(48, 18) and gcd(100, 75).',
            starterCode: `def gcd(a, b):
    while b != 0:
        # Replace a with b, b with a % b
        pass
    return a

print(gcd(48, 18))
print(gcd(100, 75))`,
            language: 'python',
            hint: 'a, b = b, a % b inside the while loop',
            solution: `def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

print(gcd(48, 18))
print(gcd(100, 75))`,
            testCases: [
              { input: '', expectedOutput: '6', description: 'gcd(48, 18) = 6' },
              { input: '', expectedOutput: '25', description: 'gcd(100, 75) = 25' },
            ],
          },
          {
            id: '6.042-1-2',
            title: 'Sieve of Eratosthenes',
            description: 'Use the Sieve of Eratosthenes to find all prime numbers up to 50. Print the list.',
            starterCode: `def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            # Mark all multiples of i as not prime
            for j in range(i*i, n+1, i):
                pass
    return [i for i in range(n+1) if is_prime[i]]

print(sieve(50))`,
            language: 'python',
            hint: 'Set is_prime[j] = False for each multiple j of i.',
            solution: `def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n+1, i):
                is_prime[j] = False
    return [i for i in range(n+1) if is_prime[i]]

print(sieve(50))`,
            testCases: [
              { input: '', expectedOutput: '[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]', description: 'All primes up to 50' },
            ],
          },
          {
            id: '6.042-1-3',
            title: 'Modular Exponentiation',
            description: 'Compute (base^exp) % mod efficiently using fast exponentiation. Print pow_mod(2, 10, 1000) and pow_mod(3, 100, 1000000007).',
            starterCode: `def pow_mod(base, exp, mod):
    result = 1
    base = base % mod
    while exp > 0:
        if exp % 2 == 1:
            result = (result * base) % mod
        exp = exp // 2
        base = (base * base) % mod
    return result

print(pow_mod(2, 10, 1000))
print(pow_mod(3, 100, 1000000007))`,
            language: 'python',
            hint: 'This implementation is given — run it to see the results and understand how it works.',
            solution: `def pow_mod(base, exp, mod):
    result = 1
    base = base % mod
    while exp > 0:
        if exp % 2 == 1:
            result = (result * base) % mod
        exp = exp // 2
        base = (base * base) % mod
    return result

print(pow_mod(2, 10, 1000))
print(pow_mod(3, 100, 1000000007))`,
            testCases: [
              { input: '', expectedOutput: '24', description: '2^10 % 1000 = 24... wait, 1024 % 1000 = 24' },
              { input: '', expectedOutput: '981453966', description: '3^100 mod 10^9+7' },
            ],
          },
        ],
      },
      {
        id: '6.042-2',
        title: 'Combinatorics',
        content: `# Combinatorics

Combinatorics counts how many ways things can be arranged or selected.

## Permutations
Ordered arrangements of k items from n: **P(n,k) = n! / (n-k)!**
\`\`\`python
# How many ways to arrange 3 books from 5?
# P(5,3) = 5 × 4 × 3 = 60
\`\`\`

## Combinations
Unordered selections of k items from n: **C(n,k) = n! / (k! × (n-k)!)**
\`\`\`python
# How many ways to choose 3 people from 5?
# C(5,3) = 10
\`\`\`

## Pascal's Triangle
C(n,k) = C(n-1,k-1) + C(n-1,k)

\`\`\`
     1
    1 1
   1 2 1
  1 3 3 1
 1 4 6 4 1
\`\`\`

## Inclusion-Exclusion
|A ∪ B| = |A| + |B| - |A ∩ B|`,
        exercises: [
          {
            id: '6.042-2-1',
            title: 'Combinations (n choose k)',
            description: 'Implement C(n, k) using the recursive formula: C(n,k) = C(n-1,k-1) + C(n-1,k). Print C(10, 3).',
            starterCode: `def C(n, k):
    # Base cases
    if k == 0 or k == n:
        return 1
    # Recursive case
    return

print(C(10, 3))
print(C(5, 2))`,
            language: 'python',
            hint: 'C(n, k) = C(n-1, k-1) + C(n-1, k)',
            solution: `def C(n, k):
    if k == 0 or k == n:
        return 1
    return C(n - 1, k - 1) + C(n - 1, k)

print(C(10, 3))
print(C(5, 2))`,
            testCases: [
              { input: '', expectedOutput: '120', description: 'C(10,3) = 120' },
              { input: '', expectedOutput: '10', description: 'C(5,2) = 10' },
            ],
          },
          {
            id: '6.042-2-2',
            title: 'Pascal\'s Triangle',
            description: 'Generate and print the first 6 rows of Pascal\'s Triangle (each row as a list).',
            starterCode: `def pascal(n):
    triangle = []
    for i in range(n):
        row = [1] * (i + 1)
        for j in range(1, i):
            # Each element is the sum of the two above it
            row[j] = triangle[i-1][j-1] + triangle[i-1][j]
        triangle.append(row)
    return triangle

for row in pascal(6):
    print(row)`,
            language: 'python',
            hint: 'This code is mostly complete — review it, understand it, and run it.',
            solution: `def pascal(n):
    triangle = []
    for i in range(n):
        row = [1] * (i + 1)
        for j in range(1, i):
            row[j] = triangle[i-1][j-1] + triangle[i-1][j]
        triangle.append(row)
    return triangle

for row in pascal(6):
    print(row)`,
            testCases: [
              { input: '', expectedOutput: '[1, 5, 10, 10, 5, 1]', description: 'Row 5 is [1,5,10,10,5,1]' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: '6.004',
    code: '6.004',
    title: 'Computation Structures',
    description: 'From binary to processors: boolean logic, combinational circuits, memory, and assembly language.',
    difficulty: 'Intermediate',
    language: 'python',
    color: '#9C27B0',
    lessons: [
      {
        id: '6.004-1',
        title: 'Binary & Number Systems',
        content: `# Binary & Number Systems

Computers store everything as binary (base-2) — sequences of 0s and 1s.

## Converting Decimal to Binary
\`\`\`
13 = 8 + 4 + 1 = 1101₂
   Step: 13 ÷ 2 = 6 r1
         6  ÷ 2 = 3 r0
         3  ÷ 2 = 1 r1
         1  ÷ 2 = 0 r1
   Read remainders bottom to top: 1101
\`\`\`

## Python Built-ins
\`\`\`python
bin(13)    # '0b1101'
oct(13)    # '0o15'
hex(255)   # '0xff'
int('1101', 2)   # 13 (binary string to int)
int('ff', 16)    # 255 (hex string to int)
\`\`\`

## Bitwise Operators
\`\`\`python
a = 0b1010   # 10
b = 0b1100   # 12

a & b   # AND  → 0b1000 = 8
a | b   # OR   → 0b1110 = 14
a ^ b   # XOR  → 0b0110 = 6
~a      # NOT  → -11 (two's complement)
a << 1  # left shift  → 20
a >> 1  # right shift → 5
\`\`\``,
        exercises: [
          {
            id: '6.004-1-1',
            title: 'Decimal to Binary',
            description: 'Write a function that converts a decimal integer to its binary string (without using Python\'s bin()). Print to_binary(42) and to_binary(255).',
            starterCode: `def to_binary(n):
    if n == 0:
        return "0"
    bits = []
    while n > 0:
        bits.append(str(n % 2))
        n = n // 2
    return ''.join(reversed(bits))

print(to_binary(42))
print(to_binary(255))`,
            language: 'python',
            hint: 'The algorithm is provided — run it and trace through to understand how it works.',
            solution: `def to_binary(n):
    if n == 0:
        return "0"
    bits = []
    while n > 0:
        bits.append(str(n % 2))
        n = n // 2
    return ''.join(reversed(bits))

print(to_binary(42))
print(to_binary(255))`,
            testCases: [
              { input: '', expectedOutput: '101010', description: '42 in binary is 101010' },
              { input: '', expectedOutput: '11111111', description: '255 in binary is 11111111' },
            ],
          },
          {
            id: '6.004-1-2',
            title: 'Count Set Bits',
            description: 'Write a function that counts the number of 1-bits in a number\'s binary representation. Print count_bits(255) and count_bits(42).',
            starterCode: `def count_bits(n):
    count = 0
    while n > 0:
        # Check if the lowest bit is set
        count += n & 1
        n >>= 1  # shift right by 1
    return count

print(count_bits(255))
print(count_bits(42))`,
            language: 'python',
            hint: 'n & 1 gives the least significant bit. n >>= 1 removes that bit.',
            solution: `def count_bits(n):
    count = 0
    while n > 0:
        count += n & 1
        n >>= 1
    return count

print(count_bits(255))
print(count_bits(42))`,
            testCases: [
              { input: '', expectedOutput: '8', description: '255 = 11111111 has 8 set bits' },
              { input: '', expectedOutput: '3', description: '42 = 101010 has 3 set bits' },
            ],
          },
          {
            id: '6.004-1-3',
            title: 'Bitwise Operations',
            description: 'Using only bitwise operators, write a function that checks if a number is a power of 2. Print is_power_of_two(64) and is_power_of_two(100).',
            starterCode: `def is_power_of_two(n):
    # Hint: a power of 2 in binary is exactly one 1-bit
    # e.g., 8 = 1000, 16 = 10000
    # What does n & (n-1) equal for powers of 2?
    if n <= 0:
        return False
    return

print(is_power_of_two(64))
print(is_power_of_two(100))`,
            language: 'python',
            hint: 'For powers of 2: n & (n-1) == 0. This works because subtracting 1 flips all bits after the single 1-bit.',
            solution: `def is_power_of_two(n):
    if n <= 0:
        return False
    return (n & (n - 1)) == 0

print(is_power_of_two(64))
print(is_power_of_two(100))`,
            testCases: [
              { input: '', expectedOutput: 'True', description: '64 is a power of 2' },
              { input: '', expectedOutput: 'False', description: '100 is not a power of 2' },
            ],
          },
        ],
      },
      {
        id: '6.004-2',
        title: 'Boolean Logic & Gates',
        content: `# Boolean Logic & Gates

Digital circuits are built from logic gates that implement boolean operations.

## Basic Gates
| Gate | Symbol | Operation |
|------|--------|-----------|
| AND  | A·B    | True only if both inputs True |
| OR   | A+B    | True if at least one input True |
| NOT  | Ā      | Inverts the input |
| NAND | !(A·B) | AND then NOT |
| XOR  | A⊕B    | True if inputs differ |

## Boolean Algebra Laws
\`\`\`
Identity:     A + 0 = A,  A · 1 = A
Null:         A + 1 = 1,  A · 0 = 0
Idempotent:   A + A = A,  A · A = A
Complement:   A + Ā = 1,  A · Ā = 0
De Morgan's:  !(A·B) = !A + !B
              !(A+B) = !A · !B
\`\`\`

## Half Adder
Adds two 1-bit numbers:
- Sum = A XOR B
- Carry = A AND B`,
        exercises: [
          {
            id: '6.004-2-1',
            title: 'Logic Gate Simulator',
            description: 'Implement AND, OR, NOT, XOR, and NAND functions. Then compute: AND(1,0), OR(1,0), XOR(1,1), NAND(1,1).',
            starterCode: `def AND(a, b): return a and b
def OR(a, b):  return a or b
def NOT(a):    return not a
def XOR(a, b): return
def NAND(a, b): return

print(AND(1, 0))
print(OR(1, 0))
print(XOR(1, 1))
print(NAND(1, 1))`,
            language: 'python',
            hint: 'XOR is True when inputs differ. NAND is NOT(AND(a,b)).',
            solution: `def AND(a, b): return a and b
def OR(a, b):  return a or b
def NOT(a):    return not a
def XOR(a, b): return (a or b) and not (a and b)
def NAND(a, b): return not (a and b)

print(AND(1, 0))
print(OR(1, 0))
print(XOR(1, 1))
print(NAND(1, 1))`,
            testCases: [
              { input: '', expectedOutput: 'False', description: 'AND(1,0) = False' },
              { input: '', expectedOutput: 'True', description: 'OR(1,0) = True' },
            ],
          },
          {
            id: '6.004-2-2',
            title: 'Half Adder',
            description: 'Implement a half adder that takes two 1-bit inputs and returns (sum, carry). Test with (1,1), (1,0), (0,0).',
            starterCode: `def half_adder(a, b):
    # Sum is XOR, Carry is AND
    s =
    c =
    return s, c

print(half_adder(1, 1))  # (0, 1) — 1+1=10 in binary
print(half_adder(1, 0))  # (1, 0)
print(half_adder(0, 0))  # (0, 0)`,
            language: 'python',
            hint: 'Sum bit = a XOR b, Carry bit = a AND b',
            solution: `def half_adder(a, b):
    s = a ^ b
    c = a & b
    return s, c

print(half_adder(1, 1))
print(half_adder(1, 0))
print(half_adder(0, 0))`,
            testCases: [
              { input: '', expectedOutput: '(0, 1)', description: '1+1 = sum=0, carry=1' },
              { input: '', expectedOutput: '(1, 0)', description: '1+0 = sum=1, carry=0' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: '6.009',
    code: '6.009',
    title: 'Fundamentals of Programming',
    description: 'Deeper dive into Python programming: recursion, trees, higher-order functions, and functional programming patterns.',
    difficulty: 'Intermediate',
    language: 'python',
    color: '#E91E63',
    lessons: [
      {
        id: '6.009-1',
        title: 'Recursion & Trees',
        content: `# Recursion & Trees

Recursion is when a function calls itself. It's essential for working with tree-shaped data structures.

## Recursion Depth
Each recursive call adds a frame to the call stack. Python's default limit is ~1000 frames. Deep recursion can hit this limit, so consider iterative solutions for very deep inputs.

## Tree Traversals
Given a binary tree, there are three classic ways to visit all nodes:

**Pre-order (Root → Left → Right):**
\`\`\`python
def preorder(node):
    if node is None:
        return []
    return [node.val] + preorder(node.left) + preorder(node.right)
\`\`\`

**In-order (Left → Root → Right):**
\`\`\`python
def inorder(node):
    if node is None:
        return []
    return inorder(node.left) + [node.val] + inorder(node.right)
\`\`\`

**Post-order (Left → Right → Root):**
\`\`\`python
def postorder(node):
    if node is None:
        return []
    return postorder(node.left) + postorder(node.right) + [node.val]
\`\`\`

## Tree Height
The height of a tree is the number of edges on the longest path from root to leaf.
\`\`\`python
def height(node):
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))
\`\`\``,
        exercises: [
          {
            id: '6.009-1-1',
            title: 'Tree Height',
            description: 'Define a Node class with val, left, and right attributes. Write a height(node) function that returns the maximum depth of the tree. Build a 3-level tree and print its height.',
            starterCode: `class Node:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def height(node):
    # Base case: empty tree has height -1
    # Recursive case: 1 + max height of left and right subtrees
    pass

# Build a 3-level tree:
#       1
#      / \\
#     2   3
#    / \\
#   4   5
root = Node(1, Node(2, Node(4), Node(5)), Node(3))
print(height(root))`,
            language: 'python',
            hint: 'If node is None, return -1. Otherwise return 1 + max(height(node.left), height(node.right))',
            solution: `class Node:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def height(node):
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))

root = Node(1, Node(2, Node(4), Node(5)), Node(3))
print(height(root))`,
            testCases: [
              { input: '', expectedOutput: '2', description: 'A 3-level tree has height 2' },
            ],
          },
          {
            id: '6.009-1-2',
            title: 'Flatten List',
            description: 'Write a function flatten(lst) that recursively flattens a nested list. For example, [[1,[2,3]],[4]] should become [1,2,3,4]. Print the result.',
            starterCode: `def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            # Recursively flatten and extend result
            pass
        else:
            # Append the item directly
            pass
    return result

print(flatten([[1, [2, 3]], [4]]))`,
            language: 'python',
            hint: 'Use isinstance(item, list) to check if an item is a list. Use result.extend() for sublists.',
            solution: `def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

print(flatten([[1, [2, 3]], [4]]))`,
            testCases: [
              { input: '', expectedOutput: '[1, 2, 3, 4]', description: 'Flattened list is [1, 2, 3, 4]' },
            ],
          },
          {
            id: '6.009-1-3',
            title: 'Power Set',
            description: 'Write a function power_set(s) that returns all subsets of a list as a list of lists. Print the length of power_set([1,2,3]) — it should be 8.',
            starterCode: `def power_set(s):
    if len(s) == 0:
        return [[]]
    # Take the first element and recurse on the rest
    first = s[0]
    rest_subsets = power_set(s[1:])
    # For each subset of rest, add a version with first and without first
    pass

print(len(power_set([1, 2, 3])))`,
            language: 'python',
            hint: 'For each subset in power_set(s[1:]), create two subsets: one with s[0] prepended and one without.',
            solution: `def power_set(s):
    if len(s) == 0:
        return [[]]
    first = s[0]
    rest_subsets = power_set(s[1:])
    with_first = [[first] + subset for subset in rest_subsets]
    return rest_subsets + with_first

print(len(power_set([1, 2, 3])))`,
            testCases: [
              { input: '', expectedOutput: '8', description: 'power_set([1,2,3]) has 2^3 = 8 subsets' },
            ],
          },
        ],
      },
      {
        id: '6.009-2',
        title: 'Higher-Order Functions',
        content: `# Higher-Order Functions

Higher-order functions take functions as arguments or return functions. They are a key tool for writing concise, expressive Python.

## map
Applies a function to every element of an iterable.
\`\`\`python
nums = [1, 2, 3, 4]
squares = list(map(lambda x: x**2, nums))  # [1, 4, 9, 16]
\`\`\`

## filter
Keeps only elements for which the function returns True.
\`\`\`python
evens = list(filter(lambda x: x % 2 == 0, range(10)))  # [0, 2, 4, 6, 8]
\`\`\`

## reduce
Combines all elements into a single value using a function.
\`\`\`python
from functools import reduce
total = reduce(lambda acc, x: acc + x, [1, 2, 3, 4])  # 10
\`\`\`

## Lambda Functions
Anonymous functions defined inline.
\`\`\`python
double = lambda x: x * 2
print(double(5))  # 10
\`\`\`

## Closures
A closure is a function that remembers variables from the enclosing scope.
\`\`\`python
def make_adder(n):
    def adder(x):
        return x + n   # 'n' is captured from the outer scope
    return adder

add5 = make_adder(5)
print(add5(3))   # 8
\`\`\``,
        exercises: [
          {
            id: '6.009-2-1',
            title: 'Map & Filter',
            description: 'Given nums = list(range(1, 11)), use map to square all numbers, then use filter to keep only those greater than 25. Print the result as a list.',
            starterCode: `nums = list(range(1, 11))

# Step 1: use map to square all numbers
squared = list(map(lambda x: x**2, nums))

# Step 2: use filter to keep only those > 25
result = list(filter(lambda x: x > 25, squared))

print(result)`,
            language: 'python',
            hint: 'map(func, iterable) applies func to each element. filter(func, iterable) keeps elements where func returns True.',
            solution: `nums = list(range(1, 11))
squared = list(map(lambda x: x**2, nums))
result = list(filter(lambda x: x > 25, squared))
print(result)`,
            testCases: [
              { input: '', expectedOutput: '[36, 49, 64, 81, 100]', description: 'Squares > 25 from 1..10' },
            ],
          },
          {
            id: '6.009-2-2',
            title: 'Make Multiplier',
            description: 'Write a function make_multiplier(n) that returns a function which multiplies its argument by n. Print make_multiplier(7)(6).',
            starterCode: `def make_multiplier(n):
    # Return a function that multiplies its argument by n
    pass

multiply_by_7 = make_multiplier(7)
print(multiply_by_7(6))
print(make_multiplier(7)(6))`,
            language: 'python',
            hint: 'Define an inner function inside make_multiplier that uses n from the outer scope.',
            solution: `def make_multiplier(n):
    def multiplier(x):
        return x * n
    return multiplier

multiply_by_7 = make_multiplier(7)
print(multiply_by_7(6))
print(make_multiplier(7)(6))`,
            testCases: [
              { input: '', expectedOutput: '42', description: '7 * 6 = 42' },
            ],
          },
          {
            id: '6.009-2-3',
            title: 'My Reduce',
            description: 'Implement my_reduce(fn, lst, init) without using functools. It should apply fn cumulatively: my_reduce(fn, [a,b,c], init) = fn(fn(fn(init, a), b), c). Use it to find the product of [1,2,3,4,5]. Print the result.',
            starterCode: `def my_reduce(fn, lst, init):
    acc = init
    for item in lst:
        # Apply fn to accumulator and current item
        pass
    return acc

# Use my_reduce to compute the product of [1,2,3,4,5]
product = my_reduce(lambda acc, x: acc * x, [1, 2, 3, 4, 5], 1)
print(product)`,
            language: 'python',
            hint: 'Inside the loop, update acc = fn(acc, item).',
            solution: `def my_reduce(fn, lst, init):
    acc = init
    for item in lst:
        acc = fn(acc, item)
    return acc

product = my_reduce(lambda acc, x: acc * x, [1, 2, 3, 4, 5], 1)
print(product)`,
            testCases: [
              { input: '', expectedOutput: '120', description: '1*2*3*4*5 = 120' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: '6.034',
    code: '6.034',
    title: 'Artificial Intelligence',
    description: 'Classic AI techniques: search algorithms, knowledge representation, machine learning, and neural networks.',
    difficulty: 'Advanced',
    language: 'python',
    color: '#00BCD4',
    lessons: [
      {
        id: '6.034-1',
        title: 'Search Algorithms',
        content: `# Search Algorithms

Search is the backbone of AI problem-solving. Given a problem space, we want to find a path from start to goal.

## Graph Representation
We represent graphs as adjacency lists (dictionaries):
\`\`\`python
graph = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['E'],
    'D': ['F'],
    'E': ['F'],
    'F': []
}
\`\`\`

## Breadth-First Search (BFS)
Explores all neighbors at depth d before depth d+1. Finds the **shortest path** in unweighted graphs.
\`\`\`python
from collections import deque

def bfs(graph, start, goal):
    queue = deque([[start]])
    visited = set([start])
    while queue:
        path = queue.popleft()
        node = path[-1]
        if node == goal:
            return path
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])
    return None
\`\`\`

## Depth-First Search (DFS)
Explores as far as possible along each branch before backtracking. Uses less memory than BFS but doesn't guarantee shortest path.

## A* Search
Uses a heuristic to guide search toward the goal, combining actual cost (g) and estimated remaining cost (h). Optimal when the heuristic never overestimates.

## When to Use Each
| Algorithm | Shortest Path? | Memory | Use Case |
|-----------|---------------|--------|----------|
| BFS | Yes (unweighted) | High | Shortest path, level-order |
| DFS | No | Low | Connectivity, cycle detection |
| A* | Yes (weighted) | Medium | Maps, games with heuristics |`,
        exercises: [
          {
            id: '6.034-1-1',
            title: 'BFS Shortest Path',
            description: 'Implement BFS to find the shortest path from "A" to "F" in the given graph. Print the path as a list.',
            starterCode: `from collections import deque

graph = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['E'],
    'D': ['F'],
    'E': ['F'],
    'F': []
}

def bfs_shortest_path(graph, start, goal):
    queue = deque([[start]])
    visited = set([start])
    while queue:
        path = queue.popleft()
        node = path[-1]
        if node == goal:
            return path
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                # Add the extended path to the queue
                pass
    return None

print(bfs_shortest_path(graph, 'A', 'F'))`,
            language: 'python',
            hint: 'Add path + [neighbor] to the queue for each unvisited neighbor.',
            solution: `from collections import deque

graph = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['E'],
    'D': ['F'],
    'E': ['F'],
    'F': []
}

def bfs_shortest_path(graph, start, goal):
    queue = deque([[start]])
    visited = set([start])
    while queue:
        path = queue.popleft()
        node = path[-1]
        if node == goal:
            return path
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])
    return None

print(bfs_shortest_path(graph, 'A', 'F'))`,
            testCases: [
              { input: '', expectedOutput: "['A',", description: 'Path starts with A' },
              { input: '', expectedOutput: "'F']", description: "Path ends with F" },
            ],
          },
          {
            id: '6.034-1-2',
            title: 'DFS Path Exists',
            description: 'Implement dfs(graph, start, end, visited=None) that returns True if a path exists from start to end, False otherwise. Test whether a path exists from A to D in a disconnected graph.',
            starterCode: `def dfs(graph, start, end, visited=None):
    if visited is None:
        visited = set()
    if start == end:
        return True
    visited.add(start)
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            # Recursively check if end is reachable from neighbor
            pass
    return False

graph2 = {'A': ['B'], 'B': [], 'C': ['D'], 'D': []}
print(dfs(graph2, 'A', 'B'))
print(dfs(graph2, 'A', 'D'))`,
            language: 'python',
            hint: 'If the recursive call returns True, immediately return True.',
            solution: `def dfs(graph, start, end, visited=None):
    if visited is None:
        visited = set()
    if start == end:
        return True
    visited.add(start)
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            if dfs(graph, neighbor, end, visited):
                return True
    return False

graph2 = {'A': ['B'], 'B': [], 'C': ['D'], 'D': []}
print(dfs(graph2, 'A', 'B'))
print(dfs(graph2, 'A', 'D'))`,
            testCases: [
              { input: '', expectedOutput: 'True', description: 'A can reach B' },
              { input: '', expectedOutput: 'False', description: 'A cannot reach D (disconnected)' },
            ],
          },
          {
            id: '6.034-1-3',
            title: 'Count Connected Components',
            description: 'Given an undirected graph as an adjacency list, count the number of connected components. Test with the provided graph — the answer should be 3.',
            starterCode: `def count_components(graph):
    visited = set()
    components = 0

    def dfs(node):
        visited.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs(neighbor)

    for node in graph:
        if node not in visited:
            # Start a new DFS — this discovers one full component
            pass

    return components

graph = {0: [1, 2], 1: [0], 2: [0], 3: [4], 4: [3], 5: []}
print(count_components(graph))`,
            language: 'python',
            hint: 'Each time you start a DFS from an unvisited node, increment components by 1 and call dfs(node).',
            solution: `def count_components(graph):
    visited = set()
    components = 0

    def dfs(node):
        visited.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs(neighbor)

    for node in graph:
        if node not in visited:
            dfs(node)
            components += 1

    return components

graph = {0: [1, 2], 1: [0], 2: [0], 3: [4], 4: [3], 5: []}
print(count_components(graph))`,
            testCases: [
              { input: '', expectedOutput: '3', description: 'Graph has 3 connected components: {0,1,2}, {3,4}, {5}' },
            ],
          },
        ],
      },
      {
        id: '6.034-2',
        title: 'Basic Machine Learning Concepts',
        content: `# Basic Machine Learning Concepts

Machine learning allows computers to learn patterns from data rather than following explicit rules.

## Key Terminology
- **Features** — the input variables (e.g., height, weight, age)
- **Labels** — the output we want to predict (e.g., disease: yes/no)
- **Training set** — data used to fit the model
- **Test set** — held-out data to evaluate model performance (never seen during training)
- **Overfitting** — model memorizes training data but fails to generalize

## Train/Test Split
\`\`\`python
# Typical split: 80% train, 20% test
n = len(data)
train = data[:int(0.8 * n)]
test = data[int(0.8 * n):]
\`\`\`

## K-Nearest Neighbors (KNN)
KNN classifies a new point by majority vote among the k nearest training points.

**Distance matters:** Points that are "close" in feature space tend to share the same label.

**Steps:**
1. Compute distance from the new point to all training points
2. Find the k nearest neighbors
3. Return the most common label among them

## Feature Normalization
Raw features often have very different scales (e.g., age 0–100, income 0–1,000,000). Without normalization, large-scale features dominate distance calculations.

**Min-Max scaling:** scales each feature to [0, 1]
\`\`\`python
normalized = (x - min_val) / (max_val - min_val)
\`\`\``,
        exercises: [
          {
            id: '6.034-2-1',
            title: 'Euclidean Distance',
            description: 'Write a function euclidean(p1, p2) that computes the Euclidean distance between two n-dimensional points represented as lists. Print euclidean([1,2,3],[4,6,3]).',
            starterCode: `def euclidean(p1, p2):
    # Sum the squared differences across all dimensions, then take the square root
    total = 0
    for i in range(len(p1)):
        pass  # add (p1[i] - p2[i])**2 to total
    return total ** 0.5

print(round(euclidean([1, 2, 3], [4, 6, 3]), 4))`,
            language: 'python',
            hint: 'total += (p1[i] - p2[i]) ** 2 inside the loop, then return total ** 0.5',
            solution: `def euclidean(p1, p2):
    total = 0
    for i in range(len(p1)):
        total += (p1[i] - p2[i]) ** 2
    return total ** 0.5

print(round(euclidean([1, 2, 3], [4, 6, 3]), 4))`,
            testCases: [
              { input: '', expectedOutput: '5.0', description: 'sqrt((4-1)^2 + (6-2)^2 + (3-3)^2) = sqrt(9+16) = 5.0' },
            ],
          },
          {
            id: '6.034-2-2',
            title: 'KNN Classifier',
            description: 'Implement a 1-nearest-neighbor classifier. Given labeled training points, predict the label for a new point by finding the closest training point. Test with the provided data.',
            starterCode: `def euclidean(p1, p2):
    return sum((a - b) ** 2 for a, b in zip(p1, p2)) ** 0.5

def predict_1nn(train, new_point):
    # Find the training point with minimum distance to new_point
    best_label = None
    best_dist = float('inf')
    for features, label in train:
        dist = euclidean(features, new_point)
        if dist < best_dist:
            pass  # update best_dist and best_label
    return best_label

train = [([1, 1], 'A'), ([5, 5], 'B'), ([1, 2], 'A'), ([4, 5], 'B')]
print(predict_1nn(train, [2, 2]))
print(predict_1nn(train, [4, 4]))`,
            language: 'python',
            hint: 'Update best_dist = dist and best_label = label whenever you find a closer neighbor.',
            solution: `def euclidean(p1, p2):
    return sum((a - b) ** 2 for a, b in zip(p1, p2)) ** 0.5

def predict_1nn(train, new_point):
    best_label = None
    best_dist = float('inf')
    for features, label in train:
        dist = euclidean(features, new_point)
        if dist < best_dist:
            best_dist = dist
            best_label = label
    return best_label

train = [([1, 1], 'A'), ([5, 5], 'B'), ([1, 2], 'A'), ([4, 5], 'B')]
print(predict_1nn(train, [2, 2]))
print(predict_1nn(train, [4, 4]))`,
            testCases: [
              { input: '', expectedOutput: 'A', description: '[2,2] is closest to class A points' },
              { input: '', expectedOutput: 'B', description: '[4,4] is closest to class B points' },
            ],
          },
          {
            id: '6.034-2-3',
            title: 'Normalize Features',
            description: 'Write a normalize(data) function that applies min-max scaling to each feature column, scaling values to [0,1]. Input: [[1,200],[2,400],[3,600]]. Print the normalized result.',
            starterCode: `def normalize(data):
    if not data:
        return data
    num_features = len(data[0])
    result = []
    for col in range(num_features):
        col_vals = [row[col] for row in data]
        min_val = min(col_vals)
        max_val = max(col_vals)
        # Normalize: (val - min) / (max - min)
        pass
    # Reconstruct rows from normalized columns
    return [[result[col][row] for col in range(num_features)] for row in range(len(data))]

print(normalize([[1, 200], [2, 400], [3, 600]]))`,
            language: 'python',
            hint: 'For each column, compute normalized values and append them as a list to result.',
            solution: `def normalize(data):
    if not data:
        return data
    num_features = len(data[0])
    result = []
    for col in range(num_features):
        col_vals = [row[col] for row in data]
        min_val = min(col_vals)
        max_val = max(col_vals)
        if max_val == min_val:
            result.append([0.0] * len(data))
        else:
            result.append([(v - min_val) / (max_val - min_val) for v in col_vals])
    return [[result[col][row] for col in range(num_features)] for row in range(len(data))]

print(normalize([[1, 200], [2, 400], [3, 600]]))`,
            testCases: [
              { input: '', expectedOutput: '[[0.0, 0.0]', description: 'First row normalized to [0.0, 0.0]' },
              { input: '', expectedOutput: '[1.0, 1.0]]', description: 'Last row normalized to [1.0, 1.0]' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: '6.036',
    code: '6.036',
    title: 'Machine Learning',
    description: 'Introduction to machine learning: linear algebra foundations, gradient descent, loss functions, and linear regression.',
    difficulty: 'Advanced',
    language: 'python',
    color: '#FF5722',
    lessons: [
      {
        id: '6.036-1',
        title: 'Linear Algebra for ML',
        content: `# Linear Algebra for ML

Linear algebra is the language of machine learning. Neural networks, regression, and most ML algorithms reduce to matrix operations.

## Vectors
A vector is an ordered list of numbers. In ML, a data point is typically represented as a vector of features.
\`\`\`python
v = [1, 2, 3]   # a 3-dimensional vector
\`\`\`

## Dot Product
The dot product of two vectors measures their "alignment."
\`\`\`python
# dot([1,2,3], [4,5,6]) = 1*4 + 2*5 + 3*6 = 32
\`\`\`

It appears everywhere: in neuron activations, similarity measures, and regression predictions.

## Matrix Multiplication
If A is m×n and B is n×p, then C = A·B is m×p where:
\`\`\`
C[i][j] = sum(A[i][k] * B[k][j] for k in range(n))
\`\`\`

## Why This Matters for ML
- **Linear regression:** prediction = dot(weights, features)
- **Neural networks:** output = activation(matmul(W, input) + b)
- **PCA/SVD:** matrix decompositions for dimensionality reduction

## Cosine Similarity
Measures angle between two vectors — used in text similarity, recommendation systems.
\`\`\`
cosine_sim(v1, v2) = dot(v1, v2) / (|v1| * |v2|)
\`\`\`
Range: -1 (opposite) to 1 (identical direction).`,
        exercises: [
          {
            id: '6.036-1-1',
            title: 'Dot Product',
            description: 'Implement dot(v1, v2) without numpy. It should compute the sum of element-wise products. Print dot([1,2,3],[4,5,6]).',
            starterCode: `def dot(v1, v2):
    total = 0
    for i in range(len(v1)):
        # Add v1[i] * v2[i] to total
        pass
    return total

print(dot([1, 2, 3], [4, 5, 6]))`,
            language: 'python',
            hint: 'total += v1[i] * v2[i] inside the loop.',
            solution: `def dot(v1, v2):
    total = 0
    for i in range(len(v1)):
        total += v1[i] * v2[i]
    return total

print(dot([1, 2, 3], [4, 5, 6]))`,
            testCases: [
              { input: '', expectedOutput: '32', description: '1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32' },
            ],
          },
          {
            id: '6.036-1-2',
            title: 'Matrix Multiply',
            description: 'Implement matmul(A, B) for 2D lists (lists of lists). Test with A=[[1,2],[3,4]] and B=[[5,6],[7,8]]. Print the result.',
            starterCode: `def matmul(A, B):
    rows_A = len(A)
    cols_A = len(A[0])
    cols_B = len(B[0])
    # Initialize result matrix with zeros
    C = [[0] * cols_B for _ in range(rows_A)]
    for i in range(rows_A):
        for j in range(cols_B):
            for k in range(cols_A):
                # Accumulate A[i][k] * B[k][j]
                pass
    return C

A = [[1, 2], [3, 4]]
B = [[5, 6], [7, 8]]
print(matmul(A, B))`,
            language: 'python',
            hint: 'C[i][j] += A[i][k] * B[k][j] in the innermost loop.',
            solution: `def matmul(A, B):
    rows_A = len(A)
    cols_A = len(A[0])
    cols_B = len(B[0])
    C = [[0] * cols_B for _ in range(rows_A)]
    for i in range(rows_A):
        for j in range(cols_B):
            for k in range(cols_A):
                C[i][j] += A[i][k] * B[k][j]
    return C

A = [[1, 2], [3, 4]]
B = [[5, 6], [7, 8]]
print(matmul(A, B))`,
            testCases: [
              { input: '', expectedOutput: '[[19, 22]', description: 'First row of result is [19, 22]' },
              { input: '', expectedOutput: '[43, 50]]', description: 'Second row of result is [43, 50]' },
            ],
          },
          {
            id: '6.036-1-3',
            title: 'Cosine Similarity',
            description: 'Implement cosine_sim(v1, v2) = dot(v1,v2) / (magnitude(v1) * magnitude(v2)). Print cosine_sim([1,0,0],[1,1,0]) rounded to 4 decimal places.',
            starterCode: `def dot(v1, v2):
    return sum(a * b for a, b in zip(v1, v2))

def magnitude(v):
    return sum(x ** 2 for x in v) ** 0.5

def cosine_sim(v1, v2):
    # Compute dot product divided by product of magnitudes
    pass

print(round(cosine_sim([1, 0, 0], [1, 1, 0]), 4))`,
            language: 'python',
            hint: 'return dot(v1, v2) / (magnitude(v1) * magnitude(v2))',
            solution: `def dot(v1, v2):
    return sum(a * b for a, b in zip(v1, v2))

def magnitude(v):
    return sum(x ** 2 for x in v) ** 0.5

def cosine_sim(v1, v2):
    return dot(v1, v2) / (magnitude(v1) * magnitude(v2))

print(round(cosine_sim([1, 0, 0], [1, 1, 0]), 4))`,
            testCases: [
              { input: '', expectedOutput: '0.7071', description: 'cos(45°) = 1/sqrt(2) ≈ 0.7071' },
            ],
          },
        ],
      },
      {
        id: '6.036-2',
        title: 'Gradient Descent',
        content: `# Gradient Descent

Gradient descent is the workhorse optimization algorithm of machine learning. It iteratively adjusts parameters to minimize a loss function.

## The Idea
Imagine standing on a hilly landscape and wanting to reach the lowest point. At each step, look at which direction is steepest downhill and take a small step that way.

## Loss Function
A loss function measures how wrong our model is. Lower is better. For regression, we commonly use Mean Squared Error (MSE):
\`\`\`
MSE = (1/n) * sum((prediction - actual)^2)
\`\`\`

## Gradient
The gradient is the derivative of the loss with respect to the parameters. For f(x) = (x-3)², the gradient is:
\`\`\`
df/dx = 2*(x-3)
\`\`\`
This tells us which direction increases f. We move in the **opposite** direction.

## Update Rule
\`\`\`python
x = x - learning_rate * gradient
\`\`\`

## Learning Rate
- Too large: overshoots the minimum, diverges
- Too small: converges very slowly
- Just right: reaches minimum efficiently

## Linear Regression via Gradient Descent
For y = wx + b, the gradients are:
\`\`\`
dL/dw = -(2/n) * sum(x_i * (y_i - (w*x_i + b)))
dL/db = -(2/n) * sum(y_i - (w*x_i + b))
\`\`\``,
        exercises: [
          {
            id: '6.036-2-1',
            title: 'Find Minimum via Gradient Descent',
            description: 'Use gradient descent to minimize f(x) = (x-3)^2. The gradient is 2*(x-3). Start at x=0, use learning rate=0.1, run 50 iterations. Print the final x rounded to 4 decimal places.',
            starterCode: `def gradient_descent(start, lr, iterations):
    x = start
    for _ in range(iterations):
        gradient = 2 * (x - 3)
        # Update x: move opposite to gradient
        pass
    return x

result = gradient_descent(start=0, lr=0.1, iterations=50)
print(round(result, 4))`,
            language: 'python',
            hint: 'x = x - lr * gradient inside the loop.',
            solution: `def gradient_descent(start, lr, iterations):
    x = start
    for _ in range(iterations):
        gradient = 2 * (x - 3)
        x = x - lr * gradient
    return x

result = gradient_descent(start=0, lr=0.1, iterations=50)
print(round(result, 4))`,
            testCases: [
              { input: '', expectedOutput: '3.0', description: 'Gradient descent converges to x=3.0 (the minimum of (x-3)^2)' },
            ],
          },
          {
            id: '6.036-2-2',
            title: 'Mean Squared Error',
            description: 'Implement mse(predictions, actuals) that computes the mean squared error between two lists. Print mse([2.5,0,2,8],[3,-0.5,2,7]).',
            starterCode: `def mse(predictions, actuals):
    n = len(predictions)
    total = 0
    for i in range(n):
        # Add squared difference to total
        pass
    return total / n

print(mse([2.5, 0, 2, 8], [3, -0.5, 2, 7]))`,
            language: 'python',
            hint: 'total += (predictions[i] - actuals[i]) ** 2 inside the loop.',
            solution: `def mse(predictions, actuals):
    n = len(predictions)
    total = 0
    for i in range(n):
        total += (predictions[i] - actuals[i]) ** 2
    return total / n

print(mse([2.5, 0, 2, 8], [3, -0.5, 2, 7]))`,
            testCases: [
              { input: '', expectedOutput: '0.375', description: 'MSE = (0.25 + 0.25 + 0 + 1) / 4 = 0.375' },
            ],
          },
          {
            id: '6.036-2-3',
            title: 'Linear Regression Step',
            description: 'Implement gradient descent for linear regression (y = wx + b). Run 1000 steps on data = [(1,2),(2,4),(3,6),(4,8)] with lr=0.01. Start w=0, b=0. Print final w and b rounded to 2 decimal places.',
            starterCode: `data = [(1, 2), (2, 4), (3, 6), (4, 8)]
w = 0.0
b = 0.0
lr = 0.01
n = len(data)

for _ in range(1000):
    dw = 0.0
    db = 0.0
    for x, y in data:
        pred = w * x + b
        error = pred - y
        # Accumulate gradients
        dw += (2 / n) * error * x
        db += (2 / n) * error
    # Update parameters
    pass

print(round(w, 2))
print(round(b, 2))`,
            language: 'python',
            hint: 'After computing dw and db, update: w = w - lr * dw and b = b - lr * db',
            solution: `data = [(1, 2), (2, 4), (3, 6), (4, 8)]
w = 0.0
b = 0.0
lr = 0.01
n = len(data)

for _ in range(1000):
    dw = 0.0
    db = 0.0
    for x, y in data:
        pred = w * x + b
        error = pred - y
        dw += (2 / n) * error * x
        db += (2 / n) * error
    w = w - lr * dw
    b = b - lr * db

print(round(w, 2))
print(round(b, 2))`,
            testCases: [
              { input: '', expectedOutput: '2.0', description: 'Slope w converges to ~2.0' },
              { input: '', expectedOutput: '0.0', description: 'Intercept b converges to ~0.0' },
            ],
          },
        ],
      },
    ],
  },
];

export default courses;
