import string
import secrets
import random

def generate_password(length: int = 12,
                      use_upper: bool = True,
                      use_digits: bool = True,
                      use_punctuation: bool = True) -> str:
    """
    Generate a secure random password.

    Parameters:
    - length (int): Total length of the password to generate (default 12).
    - use_upper (bool): If True include at least one uppercase letter and allow uppercase letters in the pool (default True).
    - use_digits (bool): If True include at least one digit and allow digits in the pool (default True).
    - use_punctuation (bool): If True include at least one punctuation character and allow punctuation in the pool (default True).

    Behavior:
    - Builds a character pool from the selected categories (lowercase always included).
    - Raises ValueError if no character sets are selected.
    - Guarantees at least one character from each selected category is present (when length permits).
    - Fills the remaining characters from the combined pool using the
      secrets module for cryptographically secure selection.
    - Shuffles the resulting characters using a secure SystemRandom shuffle
      and returns the password as a string.
    """
    pools = [
        string.ascii_lowercase,
        string.ascii_uppercase if use_upper else '',
        string.digits if use_digits else '',
        string.punctuation if use_punctuation else ''
    ]
    alphabet = ''.join(pools)
    if not alphabet:
        raise ValueError("No character sets selected for password generation.")
    # Ensure at least one char from each selected category
    password_chars = []
    if string.ascii_lowercase:
        password_chars.append(secrets.choice(string.ascii_lowercase))
    if use_upper:
        password_chars.append(secrets.choice(string.ascii_uppercase))
    if use_digits:
        password_chars.append(secrets.choice(string.digits))
    if use_punctuation:
        password_chars.append(secrets.choice(string.punctuation))
    # Trim if required and fill the rest
    password_chars = password_chars[:length]
    while len(password_chars) < length:
        password_chars.append(secrets.choice(alphabet))
    # Shuffle securely
    random.SystemRandom().shuffle(password_chars)
    return ''.join(password_chars)

# Provide an exact-name alias requested: globals key with a space
globals()['generate password'] = generate_password


# Allow running from terminal
if __name__ == "__main__":
    import sys

    # Check if argument is provided
    if len(sys.argv) > 1:
        try:
            length = int(sys.argv[1])
            print(generate_password(length=length))
        except ValueError:
            print("Invalid length argument. Please provide an integer.")
