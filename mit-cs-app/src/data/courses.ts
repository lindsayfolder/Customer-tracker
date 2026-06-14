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
];

export default courses;
