
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
INPUT_CSV = "data.csv"
col = ["TIME", "Value"]
data = pd.read_csv(INPUT_CSV, usecols= col, nrows=57 )

# outputfile:
OUTPUT = "output.json"

# Selecting data:
data = data[['TIME','Value']]
data.set_index("TIME", drop=True, inplace=True)
out = data.to_json(orient='index')

# Writing JSON file:
with open(OUTPUT, 'w') as f:
    f.write(out)

print('JSON-file was written.')
