"""
Bubble Sort Implementation in Python
Description: Sorts a list of integers using the bubble sort algorithm.
"""
from typing import List

def bubble_sort(arr: List[int]) -> List[int]:
    """
    Sorts a list using the Bubble Sort algorithm.

    Args:
        arr: List of integers to sort

    Returns:
        List[int]: Sorted list

    Time Complexity: O(n^2) in worst and average cases, O(n) in best case (already sorted)
    Space Complexity: O(1) as it's an in-place sorting algorithm

    Examples:
        >>> my_list = [64, 34, 25, 12, 22, 11, 90]
        >>> bubble_sort(my_list)
        >>> print(my_list)
        [11, 12, 22, 25, 34, 64, 90]

        >>> empty_list = []
        >>> bubble_sort(empty_list)
        >>> print(empty_list)
        []

        >>> sorted_list = [1, 2, 3]
        >>> bubble_sort(sorted_list)
        >>> print(sorted_list)
        [1, 2, 3]
    """
    n = len(arr)

    # If array is empty or has one element, it's already sorted
    if n <= 1:
        return arr

    # Traverse through all array elements
    for i in range(n):
        swapped = False  # To optimize: stop if no swaps in inner loop

        # Last i elements are already in place
        for j in range(0, n - i - 1):
            # Swap if the element found is greater than the next element
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

        # If no elements were swapped, array is sorted
        if not swapped:
            break

    return arr
