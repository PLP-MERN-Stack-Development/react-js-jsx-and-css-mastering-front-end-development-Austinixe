# Function to calculate discount
def calculate_discount(price, discount_percent):
    if discount_percent >= 20:
        discount_amount = (discount_percent / 100) * price
        final_price = price - discount_amount
        return final_price
    else:
        # Discount is less than 20%, return original price
        return price

# Start of the program
print("Welcome to the Discount Calculator!")

# Prompt user for input
original_price = float(input("Enter the original price of the item: "))
discount_percent = float(input("Enter the discount percentage: "))

# Calculate final price using the function
final_price = calculate_discount(original_price, discount_percent)

# Print the result
if final_price == original_price:
    print(f"No discount applied. The price remains: ${final_price:.2f}")
else:
    print(f"Discount applied! The final price is: ${final_price:.2f}")
