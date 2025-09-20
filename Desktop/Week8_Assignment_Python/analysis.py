import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# 1️⃣ Load the CSV
df = pd.read_csv("metadata_sample.csv")

# 2️⃣ Check first 5 rows
print("First 5 rows:")
print(df.head())

# 3️⃣ Check info about dataset
print("\nDataset info:")
print(df.info())

# 4️⃣ Clean data: remove rows with missing title or abstract
df = df.dropna(subset=['title', 'abstract'])

# 5️⃣ Convert publish_time to datetime and extract year
df['publish_time'] = pd.to_datetime(df['publish_time'], errors='coerce')
df['year'] = df['publish_time'].dt.year

# 6️⃣ Count papers per year
print("\nNumber of papers per year:")
print(df['year'].value_counts())

# 7️⃣ Plot papers per year
sns.countplot(x='year', data=df)
plt.title("Number of Papers per Year")
plt.show()
import matplotlib.pyplot as plt
import seaborn as sns

sns.countplot(x='year', data=df)
plt.title("Number of Papers per Year")
plt.show()
