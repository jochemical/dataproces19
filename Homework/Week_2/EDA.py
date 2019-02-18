import pandas as pd
import csv
import matplotlib.pyplot as plt
import numpy as np

INPUT_CSV = "input.csv"
data = pd.read_csv(INPUT_CSV)
#print(data)



#print(data["GDP ($ per capita) dollars"].str.replace(' dollars',''))

data[["GDP ($ per capita) dollars"]] = data["GDP ($ per capita) dollars"].str.replace(' dollars','')
A = data[["GDP ($ per capita) dollars"]]
print(A)
#
# data["GDP ($ per capita) dollars"] = data.GDP.astype(float)
# mean_GDP = data["GDP ($ per capita) dollars"].mean()
# print(mean_GDP)
