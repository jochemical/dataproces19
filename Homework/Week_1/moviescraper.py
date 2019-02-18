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


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM ( IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    # dom is dus de html code in mooiere opmaak!
    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED MOVIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.
    L_mov = [] #
    L_href = []
    # voor titel zoek naar <a href="/title/tt5813916/?ref_=adv_li_tt">Dag II</a>
    # voor rating, zoek naar <span class="global-sprite rating-star imdb-rating"></span>
    # <strong>9,6</strong>
    # voor year of release, zoek naar: <span class="lister-item-year text-muted unbold">(2017)</span>
    # voor actors/actresses zoek naar:  Stars:
    # voor runtime zoek naar <span class="runtime">113 min</span>

    L_a = dom.find_all('a')

    # x = 0
    # print(len(L_a))
    # for a in L_a:
    #     #r = L_a.get("href")
    #
    #     if x > 100 and x < 400:
    #         print(a)
    #     x = x +1




    L_stars = []
    l = len(L_a)
    #for a in L_a:
    ac_bolean = 0
    for i in range(0,l):
        mov = L_a[i].get("href")

        if 'li_tt' in mov: # movie-titles

            L_mov.append([L_a[i].string, '', '', [], '']) # lijst wordt toegevoegd met de naam van de film erin
            #print(L_a[i].string)
            L_href.append(mov)

        if 'li_st' in mov and len(L_mov)>0: # actors
            #ac_bolean = 1
            #L_href.append(mov)
            L_mov[-1][3].append(L_a[i].string)
            #L_stars.append(L_a[i].string)
            #print(a.string)
        # else:
        #     if ac_bolean == 1:
        #         # L_mov[i].append(L_stars)
        #         L_stars = []
        #         ac_bolean = 0
        #     #print(L_stars)

    # year:
    #print(L_href)
    L_span = dom.find_all('span')
    #print(L_span)
    #print(list(s for s in L_span if 'unbold' in s))
    j = 0
    for span in L_span:
        #if 'lister-item-year' in span:
            #print("findyear")
            #year = span.get("span")
        year = str(span.string)
        if "(" in year:
            #print(year)
            if len(year) > 6:
                #print(year)
                y = year.split(" ")
                L_mov[j][2] = y[1][1:5]
                #print(y[1][1:5])
            else:
                L_mov[j][2] = year[1:5]
                #print(year[1:5])
            j = j + 1

    # runtime:
    L_p = dom.find_all(class_="runtime")
    k = 0
    for p in L_p:
        runtime = str(p.string)
        s = runtime.split(" ")
        #print(s)
        L_mov[k][4] = s[0]
        #print(p)

        #if 'min' in runtime:
        #print(runtime)
        #L_mov[k][4] = runtime
        k = k + 1
        #L_exmov.append(mov)
    #for element in L_h3:
    #     soup = BeautifulSoup(element, 'html.parser')

    #h3 = " ".join(str(x) for x in L_h3)
    #L_h3 = h3.split(">")

    # Rating:
    l = 0
    L_rate = dom.find_all("strong")
    for rate in L_rate:
        r = str(rate.string)
        if len(r) == 3 and '.' in r:
            L_mov[l][1] = r
            l = l + 1
            #print(r)


    L_title = []
    #for line in h3:
    #    if '<a' in line:
    #        L_title.append(line)
    #h3s = BeautifulSoup(L_h3, 'html.parser')
    #L_a = h3.find_all('a')
    #L_titel = dom.find(class="lister-item-header")


    #for line in dom:
    #    if 'href' in line:
    #        L_exmov.append(test)
    # print(L_exmov)
    #print(L_mov)
    return L_mov   # REPLACE THIS LINE AS WELL IF APPROPRIATE


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    for mov in movies:
        writer.writerow(mov) # maak loop!
    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE MOVIES TO DISK


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
    with open(BACKUP_HTML, 'wb') as f: # wb write bite, hier opent hij een nieuwe file
        f.write(html)
    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser') # html.parser is een functie
    #en verwerkt de html dat bealutyfll soup begijrpt

    # test om soupfile te bekijken:
    # a = 0
    # if a < 10:
    #     for line in dom:
    #         print(line)
    #         a = a + 1

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom) # dus movies moet een lijst in een lijst worden

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies) # Een functie die eerder is aangemaakt
