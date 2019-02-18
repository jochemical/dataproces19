#!/usr/bin/env python
# Name: Jochem Kemp
# Student number: 6128203
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom): # dom is dus de html code in mooiere opmaak!
    """
    Extract a list of highest rated movies from DOM ( IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    L_mov = [] # Lijst in een lijst, bestaande uit informatie over alle films

    # Titel en acteurs:
    L_a = dom.find_all('a') # voor titel en actors zoek op <a ...

    l = len(L_a) # Lengte van lijst met grove data

    for i in range(0,l):
        mov = L_a[i].get("href") # <href is indicatie voor filmnaam en acteurs

        if 'li_tt' in mov: # li_tt is een indicatie voor de film titel
            L_mov.append([L_a[i].string, '', '', [], '']) # lijst wordt toegevoegd met de naam van de film erin

        if 'li_st' in mov and len(L_mov) > 0: # li_st is een indicatie voor de acteurs
            L_mov[-1][3].append(L_a[i].string) # voegt aan de laatst toegevoegde lijst de acteur toe

    # Rating:
    l = 0
    L_rate = dom.find_all("strong") # strong is een indicatie voor rating
    for rate in L_rate:
        r = str(rate.string)
        if len(r) == 3 and '.' in r: # Deze voorwaarden zijn noodzakelijk om de rating te destileren
            L_mov[l][1] = r
            l = l + 1 # update index

    # Year:
    L_span = dom.find_all('span') # <span is een indicatie voor jaar van de film

    j = 0
    for span in L_span:
        year = str(span.string)

        if "(" in year: # Deze voorwaarde is noodzakelijk om de jaartallen eruit te filteren

            if len(year) > 6: # Enkele jaar elementen bevatten een latijns getal die hieronder wordt verwijderd
                y = year.split(" ")
                L_mov[j][2] = y[1][1:5]

            else:
                L_mov[j][2] = year[1:5]

            j = j + 1 # als een correct jaartal is gevonden wordt de index verhoogd met 1

    # runtime:
    L_p = dom.find_all(class_="runtime") # class_="runtime" is indicatie voor runtime

    k = 0
    for p in L_p:
        runtime = str(p.string)
        s = runtime.split(" ") # runtime bevat 'min' die hier eerst wordt verwijderd
        L_mov[k][4] = s[0]
        k = k + 1 # update index

    #print(L_mov)
    return L_mov   # Return lijst in lijst met alle geselecteerde films.


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime']) # De eerste rij bevat kolom-aanduidingen
    for mov in movies: # in iedere rij wordt een nieuwe film geschreven
        writer.writerow(mov)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f: # wb = write bite, hier opent hij een nieuwe file
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')
    # html.parser is een functie van beautifulsoup en verwerkt de html

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom) # dus movies moet een lijst in een lijst worden

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies) # Een functie die eerder is aangemaakt
