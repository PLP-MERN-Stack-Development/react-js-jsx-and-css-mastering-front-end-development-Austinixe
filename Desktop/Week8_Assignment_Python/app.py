import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load CSV
df = pd.read_csv("metadata_sample.csv")

# Clean data
df = df.dropna(subset=['title', 'abstract'])
df['publish_time'] = pd.to_datetime(df['publish_time'], errors='coerce')
df['year'] = df['publish_time'].dt.year

# App title
st.title("COVID-19 Research Papers Analysis")

# Display dataset
st.subheader("Dataset Preview")
st.dataframe(df)

# Year filter
years = df['year'].dropna().unique()
selected_year = st.selectbox("Select Year", sorted(years))

filtered_df = df[df['year'] == selected_year]

st.subheader(f"Papers Published in {selected_year}")
st.dataframe(filtered_df)

# Plot chart for filtered data
st.subheader(f"Number of Papers in {selected_year}")
fig, ax = plt.subplots()
sns.countplot(x='year', data=filtered_df, ax=ax)
st.pyplot(fig)
