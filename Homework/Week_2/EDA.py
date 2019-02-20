# Import libraries
import pandas as pd
import csv
import matplotlib.pyplot as plt
import numpy as np
import json


# Input data:
INPUT_CSV = "input.csv"
data = pd.read_csv(INPUT_CSV)
data_m = pd.read_csv(INPUT_CSV)
data_5 = pd.read_csv(INPUT_CSV)
data_jason = pd.read_csv(INPUT_CSV)


# Function to clean up GDP-data:
def clean_GDP(data_m):
    # Remove 'dollars':
    data_m[["GDP ($ per capita) dollars"]] = data_m["GDP ($ per capita) dollars"].str.replace(' dollars','')

    # drop rows with NaN in GDP column:
    data_m = data_m.dropna(subset=['GDP ($ per capita) dollars'])

    # drop rows with 'unknown'
    data_m = data_m[data_m["GDP ($ per capita) dollars"] != 'unknown']

    # Change strings to float:
    data_m["GDP ($ per capita) dollars"] = data_m["GDP ($ per capita) dollars"].astype(float)

    return data_m


# Calculate Mean, Mode and Median of GDP:
def info_GDP(data_m):
    # Clean up data:
    data_m = clean_GDP(data_m)

    # Calculate Mean:
    mean_GDP = data_m["GDP ($ per capita) dollars"].mean()
    print("Mean is: %f" %mean_GDP)

    # Calculate Median:
    median_GDP = data_m["GDP ($ per capita) dollars"].median()
    print("Median is: %f" %median_GDP)

    # Calculate Mode:
    mode_GDP = data_m["GDP ($ per capita) dollars"].mode()
    print("Mode is: %f" %mode_GDP)

    # Calculate Standard Deviation:
    std_GDP = data_m["GDP ($ per capita) dollars"].std()
    print("Standard Deviation is: %f" %std_GDP)
    print()


# Make Histogram for GDP-data:
def Hist_data(data_m):
    # Clean up data:
    data_m = clean_GDP(data_m)

    # Plot Histogram:
    hist = data_m.hist(column="GDP ($ per capita) dollars", bins=np.arange(0, 80000 + 1000, 1000))
    plt.xlabel('GDP ($ per capita) dollars')
    plt.ylabel('Frequency')
    plt.title('Histogram of GDP ($ per capita) dollars')
    plt.show()


# Function to clean up Infant-data:
def clean_infant(data_5):
    # drop rows with NaN in GDP column:
    data_5 = data_5.dropna(subset=['Infant mortality (per 1000 births)'])

    # drop rows with 'unknown'
    data_5 = data_5[data_5["Infant mortality (per 1000 births)"] != 'unknown']

    # replace ',' for '.' :
    data_5[["Infant mortality (per 1000 births)"]] = data_5["Infant mortality (per 1000 births)"].str.replace(',','.')

    # Change strings to float:
    data_5["Infant mortality (per 1000 births)"] = data_5["Infant mortality (per 1000 births)"].astype(float)

    return data_5


# Five number summary:
def five_sum(data_5):
    # Clean up data:
    data_5 = clean_infant(data_5)

    # Calculate the five number summary:
    min_5 = data_5['Infant mortality (per 1000 births)'].min()
    max_5 = data_5['Infant mortality (per 1000 births)'].max()
    median_5 = data_5['Infant mortality (per 1000 births)'].median()
    quartile = data_5['Infant mortality (per 1000 births)'].quantile([0.25,0.75])

    # Print information:
    print('Minimum of Infant mortality is: %f' %min_5)
    print('Maximum of Infant mortality is: %f' %max_5)
    print('Median of Infant mortality is: %f' %median_5)
    print('The 1st and 3th quartile of the Infant mortality are:')
    print(quartile)
    print()


# Function for plotting boxplot:
def boxplot(data_5):
    # Clean up data:
    data_5 = clean_infant(data_5)

    # Plotting data:
    data = data_5['Infant mortality (per 1000 births)']
    boxplot = plt.boxplot(data, 0, 'D', 1, 0.75)
    plt.ylabel('Infant mortality (per 1000 births)')
    plt.title('Boxplot of Infant mortality (per 1000 births)')
    plt.show()
    #boxplot = data_5.boxplot(column=['Infant mortality (per 1000 births)'], 0, 'rs', 0, 0.75)


# JSON convertion:
def JSON_convert(data_m):
    # Clean up data:
    data_m = clean_GDP(data_m)
    data_m = clean_infant(data_m)

    # Selecting data:
    data_m = data_m[['Country','Region','Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars']]
    data_m.set_index("Country", drop=True, inplace=True)
    out = data_m.to_json(orient='index')

    # Writing JSON file:
    with open('JSON.txt', 'w') as f:
        f.write(out)

    print('JSON-file was written.')


# Execute functions
info_GDP(data_m)
five_sum(data_5)
JSON_convert(data_m)
Hist_data(data_m)
boxplot(data_5)
