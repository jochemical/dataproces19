
"""
Pythoncode: rewrite a txt-file to a JSON-file.
"""

# Import libraries
import json
import csv
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# inputfile:
INPUT_CSV = "data8.csv"
col = ["Country","Household net adjusted disposable income","Years in education","Employment rate","Life satisfaction"]
data = pd.read_csv(INPUT_CSV, usecols= col)#, nrows=57 )

# outputfile:
OUTPUT = "output8.json"

# Selecting data:
data = data[['Country','Household net adjusted disposable income','Years in education','Employment rate','Life satisfaction']]
data.set_index("Country", drop=True, inplace=True)
out = data.to_json(orient='index')

# Writing JSON file:
with open(OUTPUT, 'w') as f:
    f.write(out)

print('JSON-file was written.')
