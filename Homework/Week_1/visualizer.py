#!/usr/bin/env python
# Name: Jochem Kemp
# Student number: 6128203
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
import numpy as np

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}  # werkt als een normale ditionary
#print(data_dict)

# lijsten voor grafiek:
x_values = [] # gemiddelden
y_values = [] # jaartallen

with open(INPUT_CSV, newline="") as f: # hier opent hij de file movies.csv als file genaamd f
    dic_mov = csv.DictReader(f) # 'ordered dictionary' met alle info uit het csv-bestand
    # dic_mov is een file bestaande uit regels
    # iedere regel is een ordered dictionary en die werkt net iets anders dan een gewone library!

    for mov in dic_mov:
        #print(mov) # test hoe deze dictionary eruit ziet
        #print(mov['Year']) # test
        rating = mov['Rating'] # rating is dus de invulling behorend bij heyword 'rating', dat in de orderdered dictionary mov staat
        year = mov['Year'] # year is dus de invulling behorend bij heyword 'year', dat in de orderdered dictionary mov staat

        data_dict[year].append(rating) # data_dict[year] is een lijstje in de dictionary
        # Alle ratings binnen hetzelfde jaar moeten in hetzelfde lijstje komen om zo later het geiddelde te kunnen uitrekenen
    #print()
    #print(data_dict)

    for i in range(START_YEAR,END_YEAR):
        # uitrekenen van het gemiddelde:
        som = 0
        nr_mov = len(data_dict[str(i)])
        for rate in data_dict[str(i)]:
            som = som + float(rate)
        gem = som / nr_mov

        x_values.append(gem)
        y_values.append(float(i))

    # grafiek:
    plt.plot(x_values, y_values, 'r--', linewidth=2)
    plt.plot(x_values, y_values, 'bo')
    plt.title("Year vs. rating (of the 50 highest rated IMDB-movies)", fontsize=14, fontweight='bold')
    plt.xlabel("Rating (grade out of 10)", fontsize=12)
    plt.ylabel("Time (yr)", fontsize=12)
    plt.axis([8.2, 8.8, 2007, 2018])
    plt.yticks([i for i in range(START_YEAR,END_YEAR,1)])
    plt.xticks([i for i in np.arange(8.2,8.8,0.1)])
    plt.show()

if __name__ == "__main__":
    print(data_dict)
