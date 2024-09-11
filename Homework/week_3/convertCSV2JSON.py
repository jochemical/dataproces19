
"""
This pythoncode converts a txt-file to a JSON-file.
"""
import json
import csv

# inputfile:
KNMI_IN = "KNMI_20190224.txt"

# outputfile:
KNMI_OUT = "knmi_out.js"

# reading txtFile:
with open(KNMI_IN, newline="") as ki: # open file KNMI_IN called ki
    # list in a list for days and temperatures:
    LL_d_t = []

    # read input data:
    tolist = csv.reader(ki)

    # clean data and put in LL_d_t:
    for L in tolist:  # every line 'L' is a list
        if L[0].strip() == '240':
            L_d_t = []
            L_d_t.append(float(L[1][6:].strip()))
            L_d_t.append(float(L[2].strip()))
            LL_d_t.append(L_d_t)

# Dictionary to make JASON-file:
dictionary = {}

# Filling in dictionary:
for day in LL_d_t:
    dictionary[day[0]] = day[1]

# write output file:
with open(KNMI_OUT, 'w') as ko:
    json.dump(dictionary, ko)
